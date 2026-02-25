/* ==========================================================================
   Coordinateur de Vie - Tableau de bord patient personnalise
   Ce composant affiche un tableau de bord adapte aux besoins et au stade
   du parcours perinatal du patient connecte.
   ========================================================================== */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import {
  serviceRecommandation,
  serviceArticles,
  serviceRendezVous,
} from "../services/serviceApi";
import "./TableauDeBordPatient.css";

function TableauDeBordPatient() {
  const { utilisateur } = utiliserAuthentification();
  const [professionnelsRecommandes, definirProfessionnelsRecommandes] = useState([]);
  const [articles, definirArticles] = useState([]);
  const [rendezVousProchains, definirRendezVousProchains] = useState([]);
  const [chargement, definirChargement] = useState(true);

  /* Charger les donnees du tableau de bord au montage du composant */
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        /* Charger les recommandations de professionnels */
        const recommandations = await serviceRecommandation.obtenirRecommandations({
          stadeGrossesse: utilisateur.stadeGrossesse,
          besoins: utilisateur.besoins,
          zone: utilisateur.localisation?.zone,
          projetNaissance: utilisateur.projetNaissance,
          antecedents: utilisateur.antecedents,
        });
        definirProfessionnelsRecommandes(
          recommandations.professionnelsRecommandes?.slice(0, 3) || []
        );

        /* Charger les articles */
        const tousLesArticles = await serviceArticles.recupererTous();
        definirArticles(tousLesArticles.slice(0, 4));

        /* Charger les rendez-vous */
        const rendezVous = await serviceRendezVous.recupererRendezVousPatient(
          utilisateur.identifiant
        );
        definirRendezVousProchains(rendezVous);
      } catch (erreur) {
        console.error("Erreur lors du chargement du tableau de bord:", erreur);
      } finally {
        definirChargement(false);
      }
    };

    chargerDonnees();
  }, [utilisateur]);

  /* Determiner le message de bienvenue en fonction du stade */
  const obtenirMessageBienvenue = () => {
    const prenom = utilisateur.nomComplet?.split(" ")[0] || "vous";
    switch (utilisateur.stadeGrossesse) {
      case "desir_enfant":
        return `Bonjour ${prenom}, nous sommes la pour vous accompagner dans votre projet de parentalite.`;
      case "premier_trimestre":
        return `Bonjour ${prenom}, felicitations pour le debut de votre grossesse ! Semaine ${utilisateur.semaines || "?"}.`;
      case "deuxieme_trimestre":
        return `Bonjour ${prenom}, votre grossesse avance bien ! Semaine ${utilisateur.semaines || "?"}.`;
      case "troisieme_trimestre":
        return `Bonjour ${prenom}, l'arrivee de votre bebe approche ! Semaine ${utilisateur.semaines || "?"}.`;
      case "post_natal":
        return `Bonjour ${prenom}, felicitations pour votre bebe ! Nous continuons a vous accompagner.`;
      default:
        return `Bonjour ${prenom}, bienvenue sur votre espace Coordinateur de Vie.`;
    }
  };

  /* Determiner l'icone en fonction du stade */
  const obtenirIconeStade = () => {
    switch (utilisateur.stadeGrossesse) {
      case "desir_enfant": return "fa-seedling";
      case "premier_trimestre": return "fa-1";
      case "deuxieme_trimestre": return "fa-2";
      case "troisieme_trimestre": return "fa-3";
      case "post_natal": return "fa-baby";
      default: return "fa-heart-pulse";
    }
  };

  /* Calculer la note moyenne d'un professionnel */
  const calculerNoteMoyenne = (avis) => {
    if (!avis || avis.length === 0) return 0;
    return (avis.reduce((somme, a) => somme + a.note, 0) / avis.length).toFixed(1);
  };

  /* Afficher les etoiles de notation */
  const afficherEtoiles = (note) => {
    const etoiles = [];
    for (let i = 1; i <= 5; i++) {
      etoiles.push(
        <i
          key={i}
          className={`fa-star ${i <= Math.round(note) ? "fa-solid" : "fa-regular vide"}`}
        ></i>
      );
    }
    return etoiles;
  };

  if (chargement) {
    return (
      <div className="chargement">
        <div className="chargement-cercle"></div>
        <p>Preparation de votre tableau de bord personnalise...</p>
      </div>
    );
  }

  return (
    <div className="tableau-de-bord-patient">
      <div className="conteneur">
        {/* Section de bienvenue personnalisee */}
        <section className="section-bienvenue">
          <div className="carte carte-bienvenue">
            <div className="bienvenue-contenu">
              <div className="bienvenue-icone">
                <i className={`fa-solid ${obtenirIconeStade()}`}></i>
              </div>
              <div>
                <h1>{obtenirMessageBienvenue()}</h1>
                <p className="bienvenue-description">
                  Votre parcours est personnalise en fonction de vos besoins.
                  Explorez les ressources recommandees ci-dessous.
                </p>
                <div className="bienvenue-badges">
                  {utilisateur.besoins?.map((besoin) => (
                    <span key={besoin} className="badge badge-primaire">
                      {besoin.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section des raccourcis rapides */}
        <section className="section-raccourcis marge-haut-lg">
          <div className="grille grille-raccourcis">
            <Link to="/patient/suivi" className="carte carte-raccourci">
              <i className="fa-solid fa-chart-line"></i>
              <span>Mon suivi</span>
            </Link>
            <Link to="/patient/annuaire" className="carte carte-raccourci">
              <i className="fa-solid fa-user-doctor"></i>
              <span>Annuaire</span>
            </Link>
            <Link to="/patient/messagerie" className="carte carte-raccourci">
              <i className="fa-solid fa-comments"></i>
              <span>Messages</span>
            </Link>
            <Link to="/articles" className="carte carte-raccourci">
              <i className="fa-solid fa-newspaper"></i>
              <span>Articles</span>
            </Link>
            <Link to="/communaute" className="carte carte-raccourci">
              <i className="fa-solid fa-people-group"></i>
              <span>Communaute</span>
            </Link>
            <Link to="/patient/enfants" className="carte carte-raccourci">
              <i className="fa-solid fa-child"></i>
              <span>Fiche enfant</span>
            </Link>
          </div>
        </section>

        <div className="grille-tableau-de-bord marge-haut-lg">
          {/* Colonne principale */}
          <div className="colonne-principale">
            {/* Section des professionnels recommandes */}
            <section className="section-recommandations">
              <div className="en-tete-section flex-entre">
                <h2>
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Professionnels recommandes
                </h2>
                <Link to="/patient/annuaire" className="lien-voir-plus">
                  Voir tout <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="liste-recommandations">
                {professionnelsRecommandes.map((professionnel) => (
                  <div key={professionnel.identifiant} className="carte carte-professionnel-recommande">
                    <div className="professionnel-en-tete">
                      <img
                        src={professionnel.photoProfil}
                        alt={`Photo de ${professionnel.nomComplet}`}
                        className="photo-professionnel"
                      />
                      <div className="professionnel-infos">
                        <h4>{professionnel.nomComplet}</h4>
                        <p className="professionnel-specialite">
                          <i className="fa-solid fa-stethoscope"></i>
                          {professionnel.specialite}
                        </p>
                        <p className="professionnel-localisation">
                          <i className="fa-solid fa-location-dot"></i>
                          {professionnel.localisation.ville} ({professionnel.localisation.zone})
                        </p>
                      </div>
                    </div>
                    <div className="professionnel-details">
                      <div className="notation-etoiles">
                        {afficherEtoiles(calculerNoteMoyenne(professionnel.avis))}
                        <span className="texte-note">
                          {calculerNoteMoyenne(professionnel.avis)} ({professionnel.avis.length} avis)
                        </span>
                      </div>
                      {professionnel.scoreRecommandation > 0 && (
                        <span className="badge badge-succes">
                          <i className="fa-solid fa-thumbs-up"></i> Recommande pour vous
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/patient/annuaire/${professionnel.identifiant}`}
                      className="bouton bouton-contour bouton-petit bouton-large marge-haut-sm"
                    >
                      <i className="fa-solid fa-calendar-plus"></i>
                      Voir le profil et prendre rendez-vous
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Section des articles recommandes */}
            <section className="section-articles marge-haut-lg">
              <div className="en-tete-section flex-entre">
                <h2>
                  <i className="fa-solid fa-newspaper"></i> Articles pour vous
                </h2>
                <Link to="/articles" className="lien-voir-plus">
                  Voir tout <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="grille grille-deux-colonnes">
                {articles.map((article) => (
                  <Link
                    key={article.identifiant}
                    to={`/articles/${article.identifiant}`}
                    className="carte carte-article-apercu"
                  >
                    <div
                      className="article-image"
                      style={{ backgroundImage: `url(${article.imageCouverture})` }}
                    ></div>
                    <div className="article-contenu-apercu">
                      <span className="badge badge-secondaire">
                        {article.categorie.replace(/_/g, " ")}
                      </span>
                      <h4>{article.titre}</h4>
                      <p className="article-auteur">
                        <i className="fa-solid fa-pen"></i> {article.auteur}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Colonne laterale */}
          <div className="colonne-laterale">
            {/* Prochains rendez-vous */}
            <section className="carte carte-laterale">
              <h3>
                <i className="fa-solid fa-calendar-check"></i> Prochains rendez-vous
              </h3>
              {rendezVousProchains.length > 0 ? (
                <div className="liste-rendez-vous">
                  {rendezVousProchains.map((rdv) => (
                    <div key={rdv.identifiant} className="rendez-vous-item">
                      <div className="rdv-date">
                        <i className="fa-solid fa-clock"></i>
                        <strong>{rdv.date}</strong> a {rdv.heure}
                      </div>
                      <p className="rdv-motif">{rdv.motif}</p>
                      {rdv.professionnel && (
                        <p className="rdv-professionnel">
                          <i className="fa-solid fa-user-doctor"></i>
                          {rdv.professionnel.nomComplet}
                        </p>
                      )}
                      <span className={`badge ${rdv.statut === "confirme" ? "badge-succes" : "badge-avertissement"}`}>
                        {rdv.statut === "confirme" ? "Confirme" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="texte-vide">
                  <i className="fa-solid fa-calendar-xmark"></i>
                  Aucun rendez-vous a venir
                </p>
              )}
              <Link to="/patient/annuaire" className="bouton bouton-secondaire bouton-large marge-haut-md">
                <i className="fa-solid fa-calendar-plus"></i>
                Prendre rendez-vous
              </Link>
            </section>

            {/* Programme dietetique */}
            {utilisateur.programmeRegimeAlimentaire?.recommandations?.length > 0 && (
              <section className="carte carte-laterale marge-haut-lg">
                <h3>
                  <i className="fa-solid fa-apple-whole"></i> Votre programme dietetique
                </h3>
                <p className="programme-objectif">
                  {utilisateur.programmeRegimeAlimentaire.objectif}
                </p>
                <ul className="liste-recommandations-diet">
                  {utilisateur.programmeRegimeAlimentaire.recommandations.slice(0, 3).map(
                    (recommandation, index) => (
                      <li key={index}>
                        <i className="fa-solid fa-leaf"></i>
                        {recommandation}
                      </li>
                    )
                  )}
                </ul>
              </section>
            )}

            {/* Acces rapide au suivi */}
            <section className="carte carte-laterale marge-haut-lg">
              <h3>
                <i className="fa-solid fa-chart-line"></i> Mon suivi rapide
              </h3>
              <div className="liens-suivi-rapide">
                {utilisateur.stadeGrossesse === "desir_enfant" && (
                  <Link to="/patient/suivi" className="lien-suivi-rapide">
                    <i className="fa-solid fa-calendar-days"></i>
                    Suivi du cycle
                  </Link>
                )}
                {(utilisateur.stadeGrossesse === "premier_trimestre" ||
                  utilisateur.stadeGrossesse === "deuxieme_trimestre" ||
                  utilisateur.stadeGrossesse === "troisieme_trimestre") && (
                  <Link to="/patient/suivi" className="lien-suivi-rapide">
                    <i className="fa-solid fa-baby"></i>
                    Suivi de grossesse
                  </Link>
                )}
                {utilisateur.stadeGrossesse === "post_natal" && (
                  <>
                    <Link to="/patient/suivi" className="lien-suivi-rapide">
                      <i className="fa-solid fa-hand-holding-heart"></i>
                      Suivi post-natal
                    </Link>
                    <Link to="/patient/suivi" className="lien-suivi-rapide">
                      <i className="fa-solid fa-baby-carriage"></i>
                      Suivi allaitement
                    </Link>
                  </>
                )}
                <Link to="/patient/suivi" className="lien-suivi-rapide">
                  <i className="fa-solid fa-brain"></i>
                  Sante mentale
                </Link>
                <Link to="/patient/suivi" className="lien-suivi-rapide">
                  <i className="fa-solid fa-heart"></i>
                  Suivi du couple
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableauDeBordPatient;
