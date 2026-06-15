import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import "./index.css";
import App from "./App.jsx";
import { TransactionProvider } from "./Context/TransactionContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { CurrencyProvider } from "./Context/CurrencyContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="692380171587-2alv0q3kqsck5vjp6tj2dqchmrqdn21j.apps.googleusercontent.com">
      <CurrencyProvider>
      <ThemeProvider>
        <TransactionProvider>
          <BrowserRouter>  
            <App />
          </BrowserRouter>
        </TransactionProvider>
       </ThemeProvider>
      </CurrencyProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
