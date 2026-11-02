export type ThemeMode = 'light' | 'dark';

export type ModusThemeConfig = {
  mode: ThemeMode;
  theme: 'modus-modern';
};

const STORAGE_KEY = 'modus-theme-config';

export function resolveDataTheme(mode: ThemeMode): string {
  return mode === 'dark' ? 'modus-modern-dark' : 'modus-modern-light';
}

export function readThemeConfig(): ModusThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ModusThemeConfig>;
      if (
        (parsed.mode === 'light' || parsed.mode === 'dark') &&
        parsed.theme === 'modus-modern'
      ) {
        return { mode: parsed.mode, theme: 'modus-modern' };
      }
    }
  } catch {
    /* ignore */
  }

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { mode: systemDark ? 'dark' : 'light', theme: 'modus-modern' };
}

export function applyThemeToDocument(config: ModusThemeConfig): void {
  const el = document.documentElement;
  el.setAttribute('data-theme', resolveDataTheme(config.mode));
  el.setAttribute('data-mode', config.mode);
  el.classList.remove('light', 'dark');
  el.classList.add(config.mode);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode: config.mode, theme: config.theme }),
    );
  } catch {
    /* ignore */
  }
}

export function toggleThemeMode(current: ModusThemeConfig): ModusThemeConfig {
  const nextMode: ThemeMode = current.mode === 'light' ? 'dark' : 'light';
  const next: ModusThemeConfig = { mode: nextMode, theme: 'modus-modern' };
  applyThemeToDocument(next);
  return next;
}
