import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "react-use-cart";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CartProvider>
    <App />
  </CartProvider>
);
