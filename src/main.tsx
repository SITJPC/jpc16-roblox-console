import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import ShineCursor from "./components/shine_cursor.tsx";
import "./App.css";
import AppRouter from "./router.tsx";
import { SnackbarProvider} from "notistack";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <SnackbarProvider>
        <ShineCursor />
        <AppRouter />
      </SnackbarProvider>
    </CookiesProvider>
  </React.StrictMode>
);
