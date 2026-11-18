import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import { store } from './store/index.js';
import { openPresentation } from './store/slices/presentationSlice.ts';
import { createTestPresentation } from './data.ts';
import { Provider } from 'react-redux';

store.dispatch(openPresentation(createTestPresentation()));
const root = createRoot(document.getElementById('root')!);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
