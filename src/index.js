/* ==========================================================================
   Coordinateur de Vie - Point d'entree de l'application React
   Ce fichier initialise l'application React et monte le composant principal.
   ========================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import Application from "./Application";
import "./index.css";

const racine = ReactDOM.createRoot(document.getElementById("root"));
racine.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);
