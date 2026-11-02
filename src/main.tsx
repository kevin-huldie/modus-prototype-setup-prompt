import { createRoot } from 'react-dom/client';
import '@trimble-oss/moduswebcomponents/modus-icons.css';
import '@trimble-oss/moduswebcomponents/modus-wc-styles.css';
import './styles/globals.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
