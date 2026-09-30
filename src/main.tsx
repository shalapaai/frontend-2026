import { createRoot } from 'react-dom/client';
import { addEditorChangeHandler } from './editor.js';
import { createTestPresentation } from './data.js';
import { setInitialState, getState } from './editor.js';
import App from './components/App.tsx';
import './index.css';

// Устанавливаем начальное состояние
const initialData = createTestPresentation();
setInitialState(initialData);

// Корневой компонент приложения
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  root.render(<App presentation={getState()} />);
}

// Первичная рендерка
renderApp();

// Подписываемся на изменения модели -- при каждом изменении перерисовываем приложение
addEditorChangeHandler(() => {
  renderApp();
});
