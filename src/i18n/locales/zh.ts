export default {
  seller: {
    title: '卖家中心',
    info: '卖家信息',
    wallet: '钱包地址',
    balance: '合约余额',
    withdraw: '提现',
    orders: '订单管理',
    noOrders: '暂无订单',
    orderId: '订单ID',
    buyer: '买家地址',
    giftBoxId: '礼盒ID',
    giftBoxName: '礼盒名称',
    quantity: '数量',
    amount: '金额',
    shippingInfo: '收货信息',
    status: '状态',
    actions: '操作',
    fulfilled: '已发货',
    pending: '待发货',
    fulfill: '发货',
    refundPending: '退款申请中',
    refunded: '已退款',
    refundRejected: '退款被拒绝',
    notOwner: '访问受限',
    notOwnerDesc: '只有合约所有者才能访问此页面。请确保您使用的是正确的钱包地址。',
    connectWalletDesc: '请连接您的钱包以访问卖家中心',
    approveRefund: '同意退款',
    rejectRefund: '拒绝退款',
    fulfillOrder: '发货订单',
    trackingNumber: '快递单号',
    enterTrackingNumber: '请输入快递单号',
    confirmFulfill: '确认发货',
    refundAmount: '退款金额',
    enterRefundAmount: '请输入退款金额',
    confirmApprove: '确认同意',
    requestRefund: '申请退款',
  },
  header: {
    brand: '鲜蟹到家',
    home: '首页',
    products: '商品',
    account: '账户',
    seller: '卖家中心',
    connect: '连接钱包',
    disconnect: '断开连接',
    network: '网络',
  },
  productDetail: {
    notFound: {
      title: '产品未找到',
      description: '您查找的产品不存在或已被移除。',
      backButton: '返回商品列表',
    },
    backButton: '返回商品列表',
    featured: '特色商品',
    lowStock: '库存不足',
    origin: '产地',
    weight: '重量',
    category: '分类',
    crab: '蟹',
    stock: '库存',
    available: '有货',
    quantity: '数量',
    connectWallet: '连接钱包购买',
    shippingInfo: '收货信息',
    shippingInfoPlaceholder: '请输入您的收货地址、联系方式等。',
    buyOnChain: '链上购买',
    paying: '支付中...',
    outOfStock: '已售罄',
    fastShipping: {
      title: '极速配送',
      description: '保证快递送货上门。',
    },
    securePayment: {
      title: '安全支付',
      description: '所有交易均由区块链技术保障安全。',
    },
    qualityGuarantee: {
      title: '品质保障',
      description: '我们保证提供新鲜优质的大闸蟹。',
    },
  },
  home: {
    hero: {
      title: '正宗湖蟹',
      subtitle: '洪泽湖优质大闸蟹，新鲜直达',
      description: '品尝手工精选洪泽湖大闸蟹的非凡美味。新鲜，优质，送达。',
      shopNow: '立即购买',
    },
    features: {
      quality: {
        title: '卓越品质',
        desc: '每只蟹都经过精心挑选，确保大小、新鲜度和膏黄/肉质饱满。',
      },
      fresh: {
        title: '新鲜保证',
        desc: '活蟹发货并精心包装，确保它们新鲜有活力地送达。',
      },
      delivery: {
        title: '快速安全配送',
        desc: '可靠迅捷的配送，确保您的订单准时送达。',
      },
      certification: {
        title: '原产地认证',
        desc: '来自洪泽湖的可追溯原产地，保证正宗。',
      },
    },
    featured: {
      title: '特色大闸蟹礼盒',
      description: '探索我们最受欢迎、最精致的大闸蟹礼盒精选。',
      viewAll: '查看所有商品',
    },
    benefits: {
      title: '为什么选择我们？',
      description: '我们对品质、透明度和客户满意度的承诺让我们与众不同。',
      traceability: {
        title: '区块链溯源',
        description: '通过区块链技术，追踪您的大闸蟹从湖泊到餐桌的整个旅程。',
      },
      security: {
        title: '安全交易',
        description: '所有支付均通过 USDC 在链上安全处理，确保透明和安全。',
      },
      delivery: {
        title: '可靠配送',
        description: '与顶级物流供应商合作，实现及时安全的配送。',
      },
    },
    cta: {
      title: '准备好品尝与众不同了吗？',
      description: '不要错过最优质的洪泽湖大闸蟹。立即订购吧！',
      shopNow: '立即购买',
    },
  },
  products: {
    title: '商品',
    featured: '特色',
    origin: '产地',
    addToCart: '加入购物车',
    description: '描述',
    search: '搜索商品...',
    filters: {
      hide: '隐藏筛选',
      sort: {
        priceLow: '价格：从低到高',
        priceHigh: '价格：从高到低',
        nameAsc: '名称：A-Z',
        nameDesc: '名称：Z-A',
      },
      title: '筛选商品',
      clear: '清除筛选',
      categories: '分类',
      priceRange: '价格范围',
      minPrice: '最低价格',
      maxPrice: '最高价格',
      activeFilters: '当前筛选',
      price: '价格',
      show: '显示筛选',
      allCrabs: '全部大闸蟹',
      maleCrabs: '公蟹',
      femaleCrabs: '母蟹',
      mixedCrabs: '公母对半',
    },
    11: "大闸蟹礼盒",
  },
  account: {
    title: '我的账户',
    orders: {
      title: '链上订单',
      noOrders: '暂无链上订单',
    },
    wallet: {
      connected: '钱包已连接',
      network: '网络',
      chainID: '链ID',
      disconnect: '断开连接',
      connect: '连接您的钱包',
      connectDesc: '请连接您的钱包以查看账户详情和订单历史',
    },
    profile: {
      title: '个人信息',
      personal: '基本信息',
      fullName: '姓名',
      email: '电子邮箱',
      memberSince: '注册时间',
      walletAddress: '钱包地址',
      shipping: '收货地址',
      edit: '编辑资料',
    },
    purchases: {
      title: '我的购买',
      blockchainDesc: '查看您所有区块链认证的购买记录。每一笔交易都安全记录在以太坊区块链上。',
    },
  },
  checkout: {
    title: "结算",
    shippingInfo: "收货信息",
    firstName: "名字",
    lastName: "姓氏",
    email: "电子邮件",
    street: "街道地址",
    city: "城市",
    state: "省份",
    zip: "邮政编码",
    country: "国家",
    onlyOneItem: "目前只支持单商品结算。",
    success: "订单已成功提交！",
    failed: "订单提交失败：",
    confirmedTitle: "订单已确认！",
    confirmedDesc: "您的订单已成功处理并记录在区块链上。感谢您的购买！",
    transactionHash: "交易哈希：{{hash}}",
    continue: "返回主页",
    orderSummary: "订单摘要",
    paymentInfo: "支付信息",
    paymentInfoTitle: "支付信息",
    charged: "已从您的钱包收取",
    connected: "已连接: {{account}}",
    refundAmount: "退款金额",
    enterRefundAmount: "请输入退款金额"
  },
  footer: {
    brand: {
      title: '鲜蟹到家',
      desc: '您购买正宗洪泽湖大闸蟹的首选。',
    },
    quickLinks: {
      title: '快速链接',
      home: '首页',
      products: '商品',
      cart: '购物车',
      account: '账户',
    },
    information: {
      title: '信息',
      about: '关于我们',
      shipping: '配送政策',
      privacy: '隐私政策',
      terms: '条款和条件',
    },
    policies: {
      privacy: '隐私政策',
      terms: '条款和条件',
      cookies: 'Cookie 政策',
    },
    contact: {
      title: '联系我们',
      address: '洪泽湖大闸蟹基地',
      city: '江苏省淮安市洪泽区',
      email: 'info@freshcrabhome.com',
      phone: '+86 138-0000-0000',
    },
    rights: '保留所有权利。',
  },
  common: {
    cancel: '取消',
    confirm: '确认',
    orderId: '订单ID',
    quantity: '数量',
    totalAmount: '总金额',
    shippingInfo: '收货信息',
    timestamp: '下单时间',
    status: '状态',
    action: '操作',
  },
}; 