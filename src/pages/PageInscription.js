/* ==========================================================================
   Coordinateur de Vie - Page d'inscription
   Formulaire permettant aux nouveaux utilisateurs de creer un compte.
   ========================================================================== */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import { serviceAuthentification } from "../services/serviceApi";
import "./PageConnexion.css";

function PageInscription() {
  const [typeProfil, definirTypeProfil] = useState("");
  const [nomComplet, definirNomComplet] = useState("");
  const [courriel, definirCourriel] = useState("");
  const [motDePasse, definirMotDePasse] = useState("");
  const [confirmationMotDePasse, definirConfirmationMotDePasse] = useState("");
  const [erreur, definirErreur] = useState("");
  const [chargement, definirChargement] = useState(false);
  const { connecter } = utiliserAuthentification();
  const naviguer = useNavigate();

  /* Gestion de la soumission du formulaire d'inscription */
  const gererSoumission = async (evenement) => {
    evenement.preventDefault();
    definirErreur("");

    /* Verifier que les mots de passe correspondent */
    if (motDePasse !== confirmationMotDePasse) {
      definirErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    /* Verifier que le type de profil est selectionne */
    if (!typeProfil) {
      definirErreur("Veuillez selectionner votre type de profil.");
      return;
    }

    definirChargement(true);

    try {
      const reponse = await serviceAuthentification.inscription({
        nomComplet,
        courriel,
        motDePasse,
        typeProfil,
      });
      connecter(reponse.utilisateur);

      /* Rediriger vers le questionnaire de depart pour les patients */
      if (typeProfil === "patient") {
        naviguer("/patient/questionnaire");
      } else {
        naviguer("/professionnel/profil");
      }
    } catch (erreurCapturee) {
      definirErreur(erreurCapturee.message);
    } finally {
      definirChargement(false);
    }
  };

  return (
    <div className="page-inscription">
      <div className="conteneur-inscription">
        <div className="carte carte-inscription">
          <div className="en-tete-inscription texte-centre">
            <i className="fa-solid fa-heart-pulse icone-inscription"></i>
            <h2>Creer un compte</h2>
            <p>Rejoignez le Coordinateur de Vie</p>
          </div>

          {erreur && (
            <div className="alerte alerte-erreur">
              <i className="fa-solid fa-circle-exclamation"></i>
              {erreur}
            </div>
          )}

          {/* Selecteur de type de profil */}
          <div className="selecteur-profil">
            <div
              className={`option-profil ${typeProfil === "patient" ? "selectionne" : ""}`}
              onClick={() => definirTypeProfil("patient")}
            >
              <i className="fa-solid fa-user"></i>
              <span>Patient</span>
            </div>
            <div
              className={`option-profil ${typeProfil === "professionnel" ? "selectionne" : ""}`}
              onClick={() => definirTypeProfil("professionnel")}
            >
              <i className="fa-solid fa-user-doctor"></i>
              <span>Professionnel</span>
            </div>
          </div>

          <form onSubmit={gererSoumission}>
            <div className="groupe-champ">
              <label htmlFor="nomComplet">
                <i className="fa-solid fa-user"></i> Nom complet
              </label>
              <input
                type="text"
                id="nomComplet"
                className="champ-saisie"
                placeholder="Votre nom et prenom"
                value={nomComplet}
                onChange={(evenement) => definirNomComplet(evenement.target.value)}
                required
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="courrielInscription">
                <i className="fa-solid fa-envelope"></i> Adresse courriel
              </label>
              <input
                type="email"
                id="courrielInscription"
                className="champ-saisie"
                placeholder="votre.adresse@email.re"
                value={courriel}
                onChange={(evenement) => definirCourriel(evenement.target.value)}
                required
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="motDePasseInscription">
                <i className="fa-solid fa-lock"></i> Mot de passe
              </label>
              <input
                type="password"
                id="motDePasseInscription"
                className="champ-saisie"
                placeholder="Choisissez un mot de passe"
                value={motDePasse}
                onChange={(evenement) => definirMotDePasse(evenement.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="confirmationMotDePasse">
                <i className="fa-solid fa-lock"></i> Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmationMotDePasse"
                className="champ-saisie"
                placeholder="Confirmez votre mot de passe"
                value={confirmationMotDePasse}
                onChange={(evenement) => definirConfirmationMotDePasse(evenement.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="bouton bouton-primaire bouton-large"
              disabled={chargement || !typeProfil}
            >
              {chargement ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Inscription en cours...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  Creer mon compte
                </>
              )}
            </button>
          </form>

          <div className="lien-connexion texte-centre marge-haut-lg">
            <p>
              Vous avez deja un compte ?{" "}
              <Link to="/connexion">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageInscription;
