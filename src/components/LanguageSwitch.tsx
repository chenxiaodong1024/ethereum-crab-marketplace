import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      aria-label="Switch Language"
    >
      <Languages size={20} />
      <span className="text-sm font-medium">{i18n.language === 'en' ? '中文' : 'English'}</span>
    </button>
  );
};

export default LanguageSwitch;