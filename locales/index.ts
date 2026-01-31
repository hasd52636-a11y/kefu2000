import { zhCN } from './zh-CN';
import { enUS } from './en-US';

export type LocaleType = typeof zhCN;

export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export type LocaleKey = keyof typeof locales;
