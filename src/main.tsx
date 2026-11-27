import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/fluent.css';
import './styles/shell.css';
import './styles/pages.css';
import './styles/missions.css';

// Portal 挂载在 body 下，加上作用域类后浮层内的组件也能命中 .win 样式
document.body.classList.add('win');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
