import { useState } from 'react';
import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react';
import { AppShellPage } from './AppShellPage';
import { AppNavbar } from './components/AppNavbar';
import {
  readThemeConfig,
  toggleThemeMode,
  type ModusThemeConfig,
} from './theme';

export default function App() {
  const [themeConfig, setThemeConfig] = useState<ModusThemeConfig>(() =>
    readThemeConfig(),
  );

  const handleToggleTheme = () => {
    setThemeConfig((current) => toggleThemeMode(current));
  };

  return (
    <ModusWcThemeProvider initialTheme={readThemeConfig()}>
      <div className="app-shell root-viewport flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppShellPage
          renderNavbar={({ mobile, toggleSidebar }) => (
            <AppNavbar
              themeMode={themeConfig.mode}
              onToggleTheme={handleToggleTheme}
              condensed={mobile}
              onMainMenuToggle={toggleSidebar}
            />
          )}
        />
      </div>
    </ModusWcThemeProvider>
  );
}
