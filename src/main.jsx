import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Asegúrate de que este ID sea exactamente el de tu consola de Google
const clientId = "427705743731-bkhq8nvin1ft9mso6uftmo18lmmooko6.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);