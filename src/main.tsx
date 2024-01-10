import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import ShineCursor from "./components/shine_cursor.tsx";
import "./App.css";
import SelectTeam from "./components/select_team.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ShineCursor />
      {/* <App /> */}
      <SelectTeam />
    </CookiesProvider>
  </React.StrictMode>
);
