import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "../styles/index.css";
import App from "./App";
import ThemeProvider from "./providers/ThemeProvider";
import AuthProvider from "./providers/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);




