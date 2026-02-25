/* ==========================================================================
   Coordinateur de Vie - Page de connexion
   Formulaire permettant aux utilisateurs de se connecter a leur compte.
   ========================================================================== */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import { serviceAuthentification } from "../services/serviceApi";
import "./PageConnexion.css";

function PageConnexion() {
  const [courriel, definirCourriel] = useState("");
  const [motDePasse, definirMotDePasse] = useState("");
  const [erreur, definirErreur] = useState("");
  const [chargement, definirChargement] = useState(false);
  const { connecter } = utiliserAuthentification();
  const naviguer = useNavigate();

  /* Gestion de la soumission du formulaire de connexion */
  const gererSoumission = async (evenement) => {
    evenement.preventDefault();
    definirErreur("");
    definirChargement(true);

    try {
      const reponse = await serviceAuthentification.connexion({
        courriel,
        motDePasse,
      });
      connecter(reponse.utilisateur);

      /* Rediriger vers le tableau de bord correspondant au type de profil */
      if (reponse.utilisateur.typeProfil === "patient") {
        naviguer("/patient/tableau-de-bord");
      } else {
        naviguer("/professionnel/tableau-de-bord");
      }
    } catch (erreurCapturee) {
      definirErreur(erreurCapturee.message);
    } finally {
      definirChargement(false);
    }
  };

  return (
    <div className="page-connexion">
      <div className="conteneur-connexion">
        <div className="carte carte-connexion">
          <div className="en-tete-connexion texte-centre">
            <i className="fa-solid fa-heart-pulse icone-connexion"></i>
            <h2>Connexion</h2>
            <p>Accedez a votre espace Coordinateur de Vie</p>
          </div>

          {erreur && (
            <div className="alerte alerte-erreur">
              <i className="fa-solid fa-circle-exclamation"></i>
              {erreur}
            </div>
          )}

          <form onSubmit={gererSoumission}>
            <div className="groupe-champ">
              <label htmlFor="courriel">
                <i className="fa-solid fa-envelope"></i> Adresse courriel
              </label>
              <input
                type="email"
                id="courriel"
                className="champ-saisie"
                placeholder="votre.adresse@email.re"
                value={courriel}
                onChange={(evenement) => definirCourriel(evenement.target.value)}
                required
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="motDePasse">
                <i className="fa-solid fa-lock"></i> Mot de passe
              </label>
              <input
                type="password"
                id="motDePasse"
                className="champ-saisie"
                placeholder="Votre mot de passe"
                value={motDePasse}
                onChange={(evenement) => definirMotDePasse(evenement.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bouton bouton-primaire bouton-large"
              disabled={chargement}
            >
              {chargement ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="lien-inscription texte-centre marge-haut-lg">
            <p>
              Vous n'avez pas encore de compte ?{" "}
              <Link to="/inscription">Creer un compte</Link>
            </p>
          </div>

          {/* Comptes de demonstration pour faciliter les tests */}
          <div className="comptes-demo marge-haut-lg">
            <p className="titre-demo">
              <i className="fa-solid fa-flask"></i> Comptes de demonstration
            </p>
            <div className="liste-demo">
              <button
                className="bouton bouton-secondaire bouton-petit"
                onClick={() => {
                  definirCourriel("camille.fontaine@email.re");
                  definirMotDePasse("motdepasse123");
                }}
              >
                <i className="fa-solid fa-user"></i> Patiente (Camille)
              </button>
              <button
                className="bouton bouton-secondaire bouton-petit"
                onClick={() => {
                  definirCourriel("laura.riviere@email.re");
                  definirMotDePasse("motdepasse456");
                }}
              >
                <i className="fa-solid fa-user"></i> Patiente (Laura)
              </button>
              <button
                className="bouton bouton-secondaire bouton-petit"
                onClick={() => {
                  definirCourriel("mc.hoarau@email.re");
                  definirMotDePasse("prosecret123");
                }}
              >
                <i className="fa-solid fa-user-doctor"></i> Professionnelle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageConnexion;
