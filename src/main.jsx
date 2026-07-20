import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/tokens/fonts.css";
import "./styles/tokens/colors.css";
import "./styles/tokens/typography.css";
import "./styles/tokens/spacing.css";
import "./styles/page.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
