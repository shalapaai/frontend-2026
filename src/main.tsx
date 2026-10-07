import { createRoot } from 'react-dom/client';
import { createTestPresentation } from './data.js';
import App from './components/App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  root.render(<App />);
}

renderApp();
