import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { locales, LocaleKey, LocaleType } from '../locales';

interface LocaleContextType {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: LocaleType;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  // 从localStorage读取语言设置，默认使用浏览器语言
  const getInitialLocale = (): LocaleKey => {
    const savedLocale = localStorage.getItem('locale') as LocaleKey;
    if (savedLocale && Object.keys(locales).includes(savedLocale)) {
      return savedLocale;
    }
    
    const browserLocale = navigator.language;
    if (browserLocale.startsWith('zh')) {
      return 'zh-CN';
    }
    return 'en-US';
  };

  const [locale, setLocale] = useState<LocaleKey>(getInitialLocale);

  // 保存语言设置到localStorage
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  // 根据当前语言获取对应的文本
  const t = locales[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};
