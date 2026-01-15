import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";

if ("serviceWorker" in navigator) {
  // BASE_URL + 'sw.js' → pl. /InvisibleDeck/sw.js
  const swUrl = import.meta.env.BASE_URL + "sw.js";
  navigator.serviceWorker.register(swUrl).catch(() => {});
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
