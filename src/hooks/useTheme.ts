import { useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'hyacy-theme';

function initialTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* 隐私模式下读写会抛错，回退到系统偏好 */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme(): [ThemeName, () => void] {
  const [name, setName] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = name;
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      /* 同上，忽略 */
    }
  }, [name]);

  return [name, () => setName((current) => (current === 'light' ? 'dark' : 'light'))];
}
