/* ==========================================================================
   Coordinateur de Vie - Contexte d'authentification
   Ce module gere l'etat global de l'authentification de l'utilisateur
   a travers toute l'application React.
   ========================================================================== */

import React, { createContext, useState, useContext } from "react";

/* Creation du contexte d'authentification */
const ContexteAuthentification = createContext(null);

/* --------------------------------------------------------------------------
   Fournisseur du contexte d'authentification
   Ce composant enveloppe l'application et rend disponible les informations
   relatives a l'utilisateur connecte.
   -------------------------------------------------------------------------- */
export function FournisseurAuthentification({ children }) {
  const [utilisateur, definirUtilisateur] = useState(null);
  const [estConnecte, definirEstConnecte] = useState(false);

  /* Fonction pour connecter un utilisateur */
  const connecter = (donneesUtilisateur) => {
    definirUtilisateur(donneesUtilisateur);
    definirEstConnecte(true);
  };

  /* Fonction pour deconnecter l'utilisateur */
  const deconnecter = () => {
    definirUtilisateur(null);
    definirEstConnecte(false);
  };

  /* Fonction pour mettre a jour les donnees de l'utilisateur */
  const mettreAJourUtilisateur = (nouvellesDonnees) => {
    definirUtilisateur((precedent) => ({
      ...precedent,
      ...nouvellesDonnees,
    }));
  };

  const valeurContexte = {
    utilisateur,
    estConnecte,
    connecter,
    deconnecter,
    mettreAJourUtilisateur,
  };

  return (
    <ContexteAuthentification.Provider value={valeurContexte}>
      {children}
    </ContexteAuthentification.Provider>
  );
}

/* --------------------------------------------------------------------------
   Crochet personnalise pour utiliser le contexte d'authentification
   -------------------------------------------------------------------------- */
export function utiliserAuthentification() {
  const contexte = useContext(ContexteAuthentification);
  if (!contexte) {
    throw new Error(
      "utiliserAuthentification doit etre utilise a l'interieur d'un FournisseurAuthentification"
    );
  }
  return contexte;
}
