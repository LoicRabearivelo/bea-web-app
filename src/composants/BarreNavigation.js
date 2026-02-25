/* ==========================================================================
   Coordinateur de Vie - Composant de navigation principale
   Barre de navigation responsive avec menu adapte au type de profil
   (patient ou professionnel).
   ========================================================================== */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import "./BarreNavigation.css";

function BarreNavigation() {
  const { utilisateur, estConnecte, deconnecter } = utiliserAuthentification();
  const [menuOuvert, definirMenuOuvert] = useState(false);
  const emplacementActuel = useLocation();
  const naviguer = useNavigate();

  /* Determiner si un lien est actif pour le surlignage visuel */
  const estActif = (chemin) => emplacementActuel.pathname === chemin;

  /* Gestion de la deconnexion */
  const gererDeconnexion = () => {
    deconnecter();
    definirMenuOuvert(false);
    naviguer("/");
  };

  /* Basculer l'etat du menu mobile */
  const basculerMenu = () => {
    definirMenuOuvert(!menuOuvert);
  };

  /* Fermer le menu apres avoir clique sur un lien */
  const fermerMenu = () => {
    definirMenuOuvert(false);
  };

  return (
    <nav className="barre-navigation">
      <div className="barre-navigation-conteneur">
        {/* Logo et titre de l'application */}
        <Link to="/" className="barre-navigation-logo" onClick={fermerMenu}>
          <i className="fa-solid fa-heart-pulse"></i>
          <span className="barre-navigation-titre">Coordinateur de Vie</span>
        </Link>

        {/* Bouton du menu mobile */}
        <button
          className="bouton-menu-mobile"
          onClick={basculerMenu}
          aria-label="Ouvrir le menu de navigation"
        >
          <i className={`fa-solid ${menuOuvert ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        {/* Liens de navigation */}
        <div className={`barre-navigation-liens ${menuOuvert ? "ouvert" : ""}`}>
          {!estConnecte ? (
            /* Liens pour les visiteurs non connectes */
            <>
              <Link
                to="/"
                className={`lien-navigation ${estActif("/") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-house"></i>
                Accueil
              </Link>
              <Link
                to="/connexion"
                className={`lien-navigation ${estActif("/connexion") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="lien-navigation bouton-inscription"
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-user-plus"></i>
                Inscription
              </Link>
            </>
          ) : utilisateur.typeProfil === "patient" ? (
            /* Liens pour les patients connectes */
            <>
              <Link
                to="/patient/tableau-de-bord"
                className={`lien-navigation ${estActif("/patient/tableau-de-bord") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-house-medical"></i>
                Tableau de bord
              </Link>
              <Link
                to="/patient/annuaire"
                className={`lien-navigation ${estActif("/patient/annuaire") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-user-doctor"></i>
                Annuaire
              </Link>
              <Link
                to="/patient/suivi"
                className={`lien-navigation ${estActif("/patient/suivi") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-chart-line"></i>
                Suivi
              </Link>
              <Link
                to="/patient/messagerie"
                className={`lien-navigation ${estActif("/patient/messagerie") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-comments"></i>
                Messages
              </Link>
              <Link
                to="/articles"
                className={`lien-navigation ${estActif("/articles") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-newspaper"></i>
                Articles
              </Link>
              <Link
                to="/communaute"
                className={`lien-navigation ${estActif("/communaute") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-people-group"></i>
                Communaute
              </Link>
              <div className="separateur-navigation"></div>
              <Link
                to="/patient/profil"
                className={`lien-navigation ${estActif("/patient/profil") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-circle-user"></i>
                Profil
              </Link>
              <button className="lien-navigation bouton-deconnexion" onClick={gererDeconnexion}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Deconnexion
              </button>
            </>
          ) : (
            /* Liens pour les professionnels connectes */
            <>
              <Link
                to="/professionnel/tableau-de-bord"
                className={`lien-navigation ${estActif("/professionnel/tableau-de-bord") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-stethoscope"></i>
                Tableau de bord
              </Link>
              <Link
                to="/professionnel/rendez-vous"
                className={`lien-navigation ${estActif("/professionnel/rendez-vous") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-calendar-check"></i>
                Rendez-vous
              </Link>
              <Link
                to="/professionnel/messagerie"
                className={`lien-navigation ${estActif("/professionnel/messagerie") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-envelope"></i>
                Messages
              </Link>
              <Link
                to="/professionnel/avis"
                className={`lien-navigation ${estActif("/professionnel/avis") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-star"></i>
                Avis
              </Link>
              <div className="separateur-navigation"></div>
              <Link
                to="/professionnel/profil"
                className={`lien-navigation ${estActif("/professionnel/profil") ? "actif" : ""}`}
                onClick={fermerMenu}
              >
                <i className="fa-solid fa-circle-user"></i>
                Profil
              </Link>
              <button className="lien-navigation bouton-deconnexion" onClick={gererDeconnexion}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Deconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default BarreNavigation;
