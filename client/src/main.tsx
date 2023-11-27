import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="mern-twitter-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
