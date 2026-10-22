import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../../front/src/App.jsx';
import '../../front/src/styles.css';
// Base React propia: comparte las mismas funcionalidades para comparar con Astro.
createRoot(document.getElementById('root')).render(<App />);
