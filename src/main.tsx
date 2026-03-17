import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioProvider } from './contexts/AudioContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </LanguageProvider>
  </StrictMode>,
);
