import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import ShineCursor from "./components/shine_cursor.tsx";
import "./App.css";
import AppRouter from "./router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ShineCursor />
      <AppRouter />
    </CookiesProvider>
  </React.StrictMode>
);
