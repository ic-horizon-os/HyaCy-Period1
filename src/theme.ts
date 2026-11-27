import { createDarkTheme, createLightTheme, type BrandVariants, type Theme } from '@fluentui/react-components';
import type { ThemeName } from './hooks/useTheme';

// 运行时会由单个品牌色推导出全部色阶，类型上按完整色阶声明
const asBrand = (hex: string) => hex as unknown as BrandVariants;

// JS 侧 token 定义处：品牌色需与 tokens.css 的 --accent 保持一致
const brand: Record<ThemeName, string> = { light: '#0067C0', dark: '#60CDFF' };

function tune(theme: Theme): Theme {
  return {
    ...theme,
    fontFamilyBase: 'var(--font)',
    fontFamilyMonospace: 'var(--font-mono)',
  };
}

export const themes: Record<ThemeName, Theme> = {
  light: tune(createLightTheme(asBrand(brand.light))),
  dark: tune(createDarkTheme(asBrand(brand.dark))),
};
