import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import Pages
import App from './pages/App';
import Join from './pages/Join';
import Lobby from './pages/Lobby';
import Start from './pages/Start';

// Web Vitals
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Creates a router for different pages
const router = createBrowserRouter([
  { path: "/", element: <App/>},
  { path: "/join", element: <Join/>},
  { path: "/lobby", element: <Lobby/>},
  { path: "/start", element: <Start/>},
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
