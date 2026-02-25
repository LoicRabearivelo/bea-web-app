/* ==========================================================================
   Coordinateur de Vie - Page d'accueil
   Page de presentation de l'application pour les visiteurs non connectes.
   ========================================================================== */

import React from "react";
import { Link } from "react-router-dom";
import "./PageAccueil.css";

function PageAccueil() {
  return (
    <div className="page-accueil">
      {/* Section principale de bienvenue */}
      <section className="section-hero">
        <div className="conteneur">
          <div className="hero-contenu">
            <h1 className="hero-titre">
              Coordinateur de Vie
            </h1>
            <p className="hero-sous-titre">
              Votre compagnon pour chaque etape du parcours perinatal et parental a La Reunion
            </p>
            <p className="hero-description">
              Plus qu'une simple application, un veritable tiers de confiance numerique qui
              centralise les informations, vous connecte aux professionnels de sante locaux
              et vous accompagne tout au long des mille jours.
            </p>
            <div className="hero-actions">
              <Link to="/inscription" className="bouton bouton-primaire bouton-hero">
                <i className="fa-solid fa-user-plus"></i>
                Commencer mon parcours
              </Link>
              <Link to="/connexion" className="bouton bouton-contour bouton-hero">
                <i className="fa-solid fa-right-to-bracket"></i>
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section du continuum des mille jours */}
      <section className="section-mille-jours">
        <div className="conteneur">
          <h2 className="texte-centre">Le continuum des mille jours</h2>
          <p className="texte-centre description-section">
            Nous vous accompagnons a chaque etape de votre parcours, du desir d'enfant
            jusqu'a la petite enfance.
          </p>
          <div className="grille grille-trois-colonnes marge-haut-xl">
            <div className="carte carte-etape">
              <div className="icone-etape">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <h3>Avant</h3>
              <p>
                Desir d'enfant, fertilite, preparation. Nous vous aidons a vous informer
                et a trouver les professionnels adaptes des le debut de votre projet.
              </p>
            </div>
            <div className="carte carte-etape etape-active">
              <div className="icone-etape">
                <i className="fa-solid fa-baby"></i>
              </div>
              <h3>Pendant</h3>
              <p>
                Suivi de grossesse medical et emotionnel. Chaque semaine, des informations
                personnalisees et un acces direct a votre equipe de sante.
              </p>
            </div>
            <div className="carte carte-etape">
              <div className="icone-etape">
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
              <h3>Apres</h3>
              <p>
                Post-partum, retour a domicile, petite enfance. Un accompagnement continu
                pour ne jamais vous sentir seule face aux defis du quotidien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section des fonctionnalites principales */}
      <section className="section-fonctionnalites">
        <div className="conteneur">
          <h2 className="texte-centre">Ce que nous vous offrons</h2>
          <div className="grille grille-deux-colonnes marge-haut-xl">
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-book-medical"></i>
              </div>
              <div>
                <h4>Centralisation des informations</h4>
                <p>
                  Toutes les informations essentielles en un seul endroit : protocoles medicaux,
                  demarches aupres de la Caisse d'Allocations Familiales et de la Securite Sociale,
                  conseils nutritionnels locaux.
                </p>
              </div>
            </div>
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h4>Annuaire augmente des professionnels</h4>
                <p>
                  Trouvez facilement les sages-femmes, pediatres, doulas, osteopathes et
                  consultantes en lactation pres de chez vous grace a la geolocalisation.
                </p>
              </div>
            </div>
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <h4>Parcours personnalise</h4>
                <p>
                  Un algorithme intelligent analyse vos besoins pour vous proposer un parcours
                  adapte : grossesse pathologique, naissance naturelle, soutien social.
                </p>
              </div>
            </div>
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-universal-access"></i>
              </div>
              <div>
                <h4>Accessibilite et inclusion</h4>
                <p>
                  Une interface concue pour reduire la fracture numerique, accessible a tous
                  les niveaux socio-economiques avec une experience apaisante.
                </p>
              </div>
            </div>
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div>
                <h4>Communaute bienveillante</h4>
                <p>
                  Echangez avec d'autres parents, partagez vos experiences et trouvez du
                  soutien dans une communaute locale solidaire.
                </p>
              </div>
            </div>
            <div className="carte fonctionnalite-carte">
              <div className="fonctionnalite-icone">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div>
                <h4>Suivi complet</h4>
                <p>
                  Cycle menstruel, grossesse, sante mentale, allaitement, nutrition,
                  relation de couple et fiche enfant : tout votre suivi en un seul endroit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section specifique a La Reunion */}
      <section className="section-reunion">
        <div className="conteneur texte-centre">
          <div className="reunion-contenu">
            <i className="fa-solid fa-location-dot reunion-icone"></i>
            <h2>Concu pour La Reunion</h2>
            <p>
              Une approche hyper-locale qui integre les specificites culturelles,
              geographiques (Hauts et Bas) et sanitaires de l'ile. Du rougail aux bredes,
              nos conseils nutritionnels parlent votre langue.
            </p>
            <div className="reunion-zones">
              <span className="badge badge-primaire">
                <i className="fa-solid fa-mountain"></i> Hauts
              </span>
              <span className="badge badge-primaire">
                <i className="fa-solid fa-compass"></i> Nord
              </span>
              <span className="badge badge-primaire">
                <i className="fa-solid fa-sun"></i> Sud
              </span>
              <span className="badge badge-primaire">
                <i className="fa-solid fa-water"></i> Est
              </span>
              <span className="badge badge-primaire">
                <i className="fa-solid fa-umbrella-beach"></i> Ouest
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="pied-de-page">
        <div className="conteneur texte-centre">
          <p className="pied-de-page-texte">
            <i className="fa-solid fa-heart-pulse"></i> Coordinateur de Vie - La Reunion (974)
          </p>
          <p className="pied-de-page-sous-texte">
            Accompagner chaque famille durant les mille jours, avec bienveillance et proximite.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PageAccueil;
