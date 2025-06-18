// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CrabUSDC {
    using SafeERC20 for IERC20;

    address public owner;
    IERC20 public immutable usdc; // 使用的 USDC 合约

    enum OrderStatus { Pending, Fulfilled, RefundRequested, Refunded, RefundRejected }

    struct GiftBox {
        uint256 id;
        string name;
        string description;
        uint256 price;    // USDC (6 decimals)
        uint256 stock;
        bool active;
    }

    struct Order {
        uint256 orderId;
        address buyer;
        uint256 giftBoxId;
        uint256 quantity;
        uint256 totalAmount;
        string shippingInfo;
        uint256 timestamp;
        string trackingNumber;
        OrderStatus status;
        uint256 refundAmount;
    }

    uint256 public nextGiftBoxId = 1;
    uint256 public nextOrderId   = 1;

    mapping(uint256 => GiftBox)         public giftBoxes;
    mapping(uint256 => Order)           public orders;
    mapping(address => uint256[])       public buyerOrders;

    event GiftBoxAdded(uint256 indexed giftBoxId, string name, uint256 price, uint256 stock);
    event OrderPlaced(uint256 indexed orderId, address indexed buyer, uint256 giftBoxId, uint256 quantity, uint256 totalAmount, string shippingInfo, uint256 timestamp);
    event OrderFulfilled(uint256 indexed orderId, string trackingNumber);
    event RefundRequested(uint256 indexed orderId);
    event RefundApproved(uint256 indexed orderId, uint256 amount);
    event RefundRejected(uint256 indexed orderId);
    event Withdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // 初始化时传入USDC合约地址
    constructor(address _usdc) {
        require(_usdc != address(0), "USDC cannot be zero address");
        owner = msg.sender;
        usdc = IERC20(_usdc);
    }

    function addOrUpdateGiftBox(
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 stock,
        bool active
    ) external onlyOwner {
        uint256 id = nextGiftBoxId++;
        giftBoxes[id] = GiftBox({
            id: id,
            name: name,
            description: description,
            price: price,
            stock: stock,
            active: active
        });
        emit GiftBoxAdded(id, name, price, stock);
    }

    function updateGiftBox(
        uint256 id,
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 stock,
        bool active
    ) external onlyOwner {
        require(giftBoxes[id].id != 0, "GiftBox not exist");
        GiftBox storage box = giftBoxes[id];
        box.name = name;
        box.description = description;
        box.price = price;
        box.stock = stock;
        box.active = active;
    }

    // 修改为USDC付款
    function buyGiftBox(
        uint256 giftBoxId,
        uint256 quantity,
        string calldata shippingInfo
    ) external {
        GiftBox storage box = giftBoxes[giftBoxId];
        require(box.active, "GiftBox not for sale");
        require(quantity > 0, "Quantity must be > 0");
        require(box.stock >= quantity, "Not enough stock");

        uint256 total = box.price * quantity;

        // 从买家账户扣USDC，需提前approve
        usdc.safeTransferFrom(msg.sender, address(this), total);

        box.stock -= quantity;

        orders[nextOrderId] = Order({
            orderId: nextOrderId,
            buyer: msg.sender,
            giftBoxId: giftBoxId,
            quantity: quantity,
            totalAmount: total,
            shippingInfo: shippingInfo,
            timestamp: block.timestamp,
            trackingNumber: "",
            status: OrderStatus.Pending,
            refundAmount: 0
        });
        buyerOrders[msg.sender].push(nextOrderId);

        emit OrderPlaced(nextOrderId, msg.sender, giftBoxId, quantity, total, shippingInfo, block.timestamp);

        nextOrderId++;
    }

    function fulfillOrder(uint256 orderId, string calldata trackingNumber) external onlyOwner {
        Order storage o = orders[orderId];
        require(o.status == OrderStatus.Pending, "Cannot fulfill");
        o.status = OrderStatus.Fulfilled;
        o.trackingNumber = trackingNumber;
        emit OrderFulfilled(orderId, trackingNumber);
    }

    function requestRefund(uint256 orderId) external {
        Order storage o = orders[orderId];
        require(o.buyer == msg.sender, "Not your order");
        require(o.status == OrderStatus.Pending, "Cannot request now");
        o.status = OrderStatus.RefundRequested;
        emit RefundRequested(orderId);
    }

    function approveRefund(uint256 orderId, uint256 amount) external onlyOwner {
        Order storage o = orders[orderId];
        require(o.status == OrderStatus.RefundRequested, "No refund requested");
        require(amount <= o.totalAmount, "Refund too much");

        o.status = OrderStatus.Refunded;
        o.refundAmount = amount;

        giftBoxes[o.giftBoxId].stock += o.quantity;

        // 退款给买家
        usdc.safeTransfer(o.buyer, amount);

        emit RefundApproved(orderId, amount);
    }

    function rejectRefund(uint256 orderId) external onlyOwner {
        Order storage o = orders[orderId];
        require(o.status == OrderStatus.RefundRequested, "No refund requested");
        o.status = OrderStatus.RefundRejected;
        emit RefundRejected(orderId);
    }

    // 提现合约里的USDC
    function withdraw() external onlyOwner {
        uint256 bal = usdc.balanceOf(address(this));
        require(bal > 0, "No balance");
        usdc.safeTransfer(owner, bal);
        emit Withdraw(owner, bal);
    }
}
