import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Import Bootstrap JS and CSS
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
