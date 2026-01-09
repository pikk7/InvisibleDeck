import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/InvisibleDeck/sw.js");
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
