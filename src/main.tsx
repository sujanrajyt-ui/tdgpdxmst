import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReloreApp as App } from './ReloreApp';
import './index.css';
import './relore-design-source.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
