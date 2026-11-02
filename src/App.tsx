import { useState } from 'react';
import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react';
import { AppNavbar } from './components/AppNavbar';
import { StarterCanvas } from './components/StarterCanvas';
import {
  readThemeConfig,
  toggleThemeMode,
  type ModusThemeConfig,
} from './theme';

const PRODUCT_NAME = 'Modus Prototype Setup Prompt Test';

export default function App() {
  const [themeConfig, setThemeConfig] = useState<ModusThemeConfig>(() =>
    readThemeConfig(),
  );

  const handleToggleTheme = () => {
    setThemeConfig((current) => toggleThemeMode(current));
  };

  return (
    <ModusWcThemeProvider initialTheme={readThemeConfig()}>
      <div className="app-shell">
        <AppNavbar
          themeMode={themeConfig.mode}
          onToggleTheme={handleToggleTheme}
        />
        <main className="app-main" id="main-content">
          <div className="starter-column">
            <StarterCanvas productName={PRODUCT_NAME} />
          </div>
        </main>
      </div>
    </ModusWcThemeProvider>
  );
}
