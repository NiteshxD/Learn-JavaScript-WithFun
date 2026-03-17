// =============================================================================
// main.jsx — Application Entry Point
// =============================================================================
// This is the first JavaScript file that runs. It renders the React app
// into the DOM element with id="root" in index.html.
//
// React.StrictMode wraps the app in development to detect potential issues
// like deprecated lifecycle methods and side-effect bugs. It does NOT
// affect the production build.
// =============================================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
