import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './normalize.css'
import './index.css'
import AppRouter from './AppRouter.jsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément root manquant');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
