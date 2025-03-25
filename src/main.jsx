import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./bootstrap.min.css";
import { UserProvider } from "./Context/UserContext.jsx";
import { MessageProvider } from "./Context/MessageContext.jsx";
// import UserProvider from './Context/UserContext.jsx'


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MessageProvider>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </MessageProvider>
  </StrictMode>
);
