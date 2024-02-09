import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Planets from "./components/Planets";
import PlanetsFiber from "./components/PlanetsFiber";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Planets /> */}
    <PlanetsFiber />
  </React.StrictMode>
);
