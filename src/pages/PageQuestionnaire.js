/* ==========================================================================
   Coordinateur de Vie - Questionnaire patient de depart
   Ce composant recueille les besoins du patient pour personnaliser
   son interface et ses recommandations.
   ========================================================================== */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import { serviceProfil, serviceRecommandation } from "../services/serviceApi";
import "./PageQuestionnaire.css";

function PageQuestionnaire() {
  const { utilisateur, mettreAJourUtilisateur } = utiliserAuthentification();
  const naviguer = useNavigate();
  const [etapeCourante, definirEtapeCourante] = useState(1);
  const [chargement, definirChargement] = useState(false);

  /* Etat du formulaire questionnaire */
  const [reponses, definirReponses] = useState({
    stadeGrossesse: "",
    semaines: "",
    typeGrossesse: "",
    besoins: [],
    projetNaissance: "",
    antecedents: [],
    localisation: { ville: "", zone: "" },
  });

  /* Liste des zones geographiques de La Reunion */
  const zonesGeographiques = [
    { valeur: "Nord", libelle: "Nord (Saint-Denis, Sainte-Marie)" },
    { valeur: "Sud", libelle: "Sud (Saint-Pierre, Le Tampon)" },
    { valeur: "Est", libelle: "Est (Saint-Andre, Saint-Benoit)" },
    { valeur: "Ouest", libelle: "Ouest (Saint-Paul, Saint-Leu)" },
    { valeur: "Hauts", libelle: "Hauts (Cilaos, Salazie, Plaine des Palmistes)" },
  ];

  /* Liste des stades de grossesse possibles */
  const stadesGrossesse = [
    { valeur: "desir_enfant", libelle: "Desir d'enfant / Fertilite", icone: "fa-seedling" },
    { valeur: "premier_trimestre", libelle: "Premier trimestre (1 a 12 semaines)", icone: "fa-1" },
    { valeur: "deuxieme_trimestre", libelle: "Deuxieme trimestre (13 a 27 semaines)", icone: "fa-2" },
    { valeur: "troisieme_trimestre", libelle: "Troisieme trimestre (28 a 41 semaines)", icone: "fa-3" },
    { valeur: "post_natal", libelle: "Periode post-natale", icone: "fa-baby" },
  ];

  /* Liste des besoins possibles */
  const besoinsDisponibles = [
    { valeur: "suivi_medical", libelle: "Suivi medical de grossesse", icone: "fa-stethoscope" },
    { valeur: "preparation_naissance", libelle: "Preparation a la naissance", icone: "fa-hands-holding-child" },
    { valeur: "nutrition", libelle: "Conseils nutritionnels", icone: "fa-apple-whole" },
    { valeur: "sante_mentale", libelle: "Sante mentale et bien-etre", icone: "fa-brain" },
    { valeur: "post_partum", libelle: "Accompagnement post-partum", icone: "fa-hand-holding-heart" },
    { valeur: "allaitement", libelle: "Accompagnement allaitement", icone: "fa-baby-carriage" },
    { valeur: "fertilite", libelle: "Fertilite et conception", icone: "fa-flask" },
    { valeur: "suivi_couple", libelle: "Suivi de la relation de couple", icone: "fa-heart" },
    { valeur: "pediatrie", libelle: "Suivi pediatrique du bebe", icone: "fa-child" },
    { valeur: "suivi_cycle", libelle: "Suivi du cycle menstruel", icone: "fa-calendar-days" },
  ];

  /* Gestion de la modification des reponses */
  const modifierReponse = (champ, valeur) => {
    definirReponses((precedent) => ({
      ...precedent,
      [champ]: valeur,
    }));
  };

  /* Gestion de la selection ou deselection d'un besoin */
  const basculerBesoin = (besoin) => {
    definirReponses((precedent) => ({
      ...precedent,
      besoins: precedent.besoins.includes(besoin)
        ? precedent.besoins.filter((b) => b !== besoin)
        : [...precedent.besoins, besoin],
    }));
  };

  /* Gestion de la selection ou deselection d'un antecedent */
  const basculerAntecedent = (antecedent) => {
    definirReponses((precedent) => ({
      ...precedent,
      antecedents: precedent.antecedents.includes(antecedent)
        ? precedent.antecedents.filter((a) => a !== antecedent)
        : [...precedent.antecedents, antecedent],
    }));
  };

  /* Passer a l'etape suivante */
  const etapeSuivante = () => {
    definirEtapeCourante((precedent) => precedent + 1);
  };

  /* Revenir a l'etape precedente */
  const etapePrecedente = () => {
    definirEtapeCourante((precedent) => precedent - 1);
  };

  /* Soumettre le questionnaire complet */
  const soumettre = async () => {
    definirChargement(true);
    try {
      /* Mettre a jour le profil patient avec les reponses du questionnaire */
      const donneesAJour = {
        stadeGrossesse: reponses.stadeGrossesse,
        semaines: reponses.semaines ? parseInt(reponses.semaines) : null,
        typeGrossesse: reponses.typeGrossesse,
        besoins: reponses.besoins,
        projetNaissance: reponses.projetNaissance,
        antecedents: reponses.antecedents,
        localisation: reponses.localisation,
      };

      const reponseServeur = await serviceProfil.modifierProfilPatient(
        utilisateur.identifiant,
        donneesAJour
      );

      mettreAJourUtilisateur(reponseServeur.utilisateur);
      naviguer("/patient/tableau-de-bord");
    } catch (erreur) {
      console.error("Erreur lors de la soumission du questionnaire:", erreur);
    } finally {
      definirChargement(false);
    }
  };

  /* Nombre total d'etapes du questionnaire */
  const nombreTotalEtapes = 5;

  return (
    <div className="page-questionnaire">
      <div className="conteneur">
        <div className="carte carte-questionnaire">
          {/* Barre de progression */}
          <div className="progression-questionnaire">
            <div className="barre-progression">
              <div
                className="remplissage-progression"
                style={{ width: `${(etapeCourante / nombreTotalEtapes) * 100}%` }}
              ></div>
            </div>
            <span className="texte-progression">
              Etape {etapeCourante} sur {nombreTotalEtapes}
            </span>
          </div>

          {/* Etape 1 : Localisation geographique */}
          {etapeCourante === 1 && (
            <div className="etape-questionnaire">
              <div className="en-tete-etape texte-centre">
                <i className="fa-solid fa-location-dot icone-etape-questionnaire"></i>
                <h2>Ou habitez-vous ?</h2>
                <p>
                  Pour vous proposer des professionnels proches de chez vous, nous avons
                  besoin de connaitre votre zone geographique.
                </p>
              </div>
              <div className="options-questionnaire">
                {zonesGeographiques.map((zone) => (
                  <div
                    key={zone.valeur}
                    className={`option-questionnaire ${reponses.localisation.zone === zone.valeur ? "selectionne" : ""}`}
                    onClick={() =>
                      modifierReponse("localisation", {
                        ...reponses.localisation,
                        zone: zone.valeur,
                      })
                    }
                  >
                    <i className="fa-solid fa-map-pin"></i>
                    <span>{zone.libelle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Etape 2 : Stade de grossesse */}
          {etapeCourante === 2 && (
            <div className="etape-questionnaire">
              <div className="en-tete-etape texte-centre">
                <i className="fa-solid fa-baby icone-etape-questionnaire"></i>
                <h2>Ou en etes-vous dans votre parcours ?</h2>
                <p>
                  Cette information nous permet d'adapter les contenus et les professionnels
                  recommandes a votre situation actuelle.
                </p>
              </div>
              <div className="options-questionnaire">
                {stadesGrossesse.map((stade) => (
                  <div
                    key={stade.valeur}
                    className={`option-questionnaire ${reponses.stadeGrossesse === stade.valeur ? "selectionne" : ""}`}
                    onClick={() => modifierReponse("stadeGrossesse", stade.valeur)}
                  >
                    <i className={`fa-solid ${stade.icone}`}></i>
                    <span>{stade.libelle}</span>
                  </div>
                ))}
              </div>
              {(reponses.stadeGrossesse === "premier_trimestre" ||
                reponses.stadeGrossesse === "deuxieme_trimestre" ||
                reponses.stadeGrossesse === "troisieme_trimestre") && (
                <div className="groupe-champ marge-haut-lg">
                  <label>
                    <i className="fa-solid fa-calendar-week"></i> Nombre de semaines d'amenorrhee
                  </label>
                  <input
                    type="number"
                    className="champ-saisie"
                    placeholder="Nombre de semaines"
                    min="1"
                    max="42"
                    value={reponses.semaines}
                    onChange={(evenement) => modifierReponse("semaines", evenement.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Etape 3 : Besoins */}
          {etapeCourante === 3 && (
            <div className="etape-questionnaire">
              <div className="en-tete-etape texte-centre">
                <i className="fa-solid fa-list-check icone-etape-questionnaire"></i>
                <h2>Quels sont vos besoins ?</h2>
                <p>
                  Selectionnez tous les domaines dans lesquels vous souhaitez etre accompagnee.
                  Vous pourrez modifier ces choix a tout moment.
                </p>
              </div>
              <div className="options-questionnaire grille-besoins">
                {besoinsDisponibles.map((besoin) => (
                  <div
                    key={besoin.valeur}
                    className={`option-questionnaire option-besoin ${reponses.besoins.includes(besoin.valeur) ? "selectionne" : ""}`}
                    onClick={() => basculerBesoin(besoin.valeur)}
                  >
                    <i className={`fa-solid ${besoin.icone}`}></i>
                    <span>{besoin.libelle}</span>
                    {reponses.besoins.includes(besoin.valeur) && (
                      <i className="fa-solid fa-circle-check coche-besoin"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Etape 4 : Projet de naissance et antecedents */}
          {etapeCourante === 4 && (
            <div className="etape-questionnaire">
              <div className="en-tete-etape texte-centre">
                <i className="fa-solid fa-heart icone-etape-questionnaire"></i>
                <h2>Informations complementaires</h2>
                <p>
                  Ces informations nous aident a affiner vos recommandations.
                  Elles restent strictement confidentielles.
                </p>
              </div>
              <div className="groupe-champ">
                <label>
                  <i className="fa-solid fa-star"></i> Projet de naissance
                </label>
                <select
                  className="champ-saisie"
                  value={reponses.projetNaissance}
                  onChange={(evenement) => modifierReponse("projetNaissance", evenement.target.value)}
                >
                  <option value="">Selectionnez une option</option>
                  <option value="naissance_naturelle">Naissance naturelle / physiologique</option>
                  <option value="naissance_classique">Naissance classique en maternite</option>
                  <option value="cesarienne_programmee">Cesarienne programmee</option>
                  <option value="pas_encore_decide">Je n'ai pas encore decide</option>
                  <option value="non_applicable">Non applicable</option>
                </select>
              </div>
              <div className="groupe-champ">
                <label>
                  <i className="fa-solid fa-file-medical"></i> Type de grossesse
                </label>
                <select
                  className="champ-saisie"
                  value={reponses.typeGrossesse}
                  onChange={(evenement) => modifierReponse("typeGrossesse", evenement.target.value)}
                >
                  <option value="">Selectionnez une option</option>
                  <option value="premiere_grossesse">Premiere grossesse</option>
                  <option value="deuxieme_grossesse">Deuxieme grossesse</option>
                  <option value="troisieme_et_plus">Troisieme grossesse ou plus</option>
                  <option value="non_applicable">Non applicable</option>
                </select>
              </div>
              <div className="groupe-champ">
                <label>
                  <i className="fa-solid fa-notes-medical"></i> Antecedents medicaux (selectionnez si applicable)
                </label>
                <div className="options-antecedents">
                  {["cesarienne", "fausse couche", "grossesse pathologique", "diabete gestationnel", "hypertension"].map(
                    (antecedent) => (
                      <div
                        key={antecedent}
                        className={`option-questionnaire option-petite ${reponses.antecedents.includes(antecedent) ? "selectionne" : ""}`}
                        onClick={() => basculerAntecedent(antecedent)}
                      >
                        <span>{antecedent.charAt(0).toUpperCase() + antecedent.slice(1)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Etape 5 : Recapitulatif */}
          {etapeCourante === 5 && (
            <div className="etape-questionnaire">
              <div className="en-tete-etape texte-centre">
                <i className="fa-solid fa-clipboard-check icone-etape-questionnaire"></i>
                <h2>Recapitulatif de votre profil</h2>
                <p>
                  Verifiez vos informations avant de valider. Vous pourrez les modifier
                  a tout moment depuis votre profil.
                </p>
              </div>
              <div className="recapitulatif">
                <div className="ligne-recapitulatif">
                  <span className="etiquette-recapitulatif">
                    <i className="fa-solid fa-location-dot"></i> Zone
                  </span>
                  <span>{reponses.localisation.zone || "Non renseigne"}</span>
                </div>
                <div className="ligne-recapitulatif">
                  <span className="etiquette-recapitulatif">
                    <i className="fa-solid fa-baby"></i> Stade
                  </span>
                  <span>
                    {stadesGrossesse.find((s) => s.valeur === reponses.stadeGrossesse)?.libelle || "Non renseigne"}
                  </span>
                </div>
                <div className="ligne-recapitulatif">
                  <span className="etiquette-recapitulatif">
                    <i className="fa-solid fa-list-check"></i> Besoins
                  </span>
                  <span>
                    {reponses.besoins.length > 0
                      ? reponses.besoins
                          .map((b) => besoinsDisponibles.find((bd) => bd.valeur === b)?.libelle)
                          .join(", ")
                      : "Aucun selectionne"}
                  </span>
                </div>
                <div className="ligne-recapitulatif">
                  <span className="etiquette-recapitulatif">
                    <i className="fa-solid fa-heart"></i> Projet
                  </span>
                  <span>{reponses.projetNaissance || "Non renseigne"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="navigation-questionnaire">
            {etapeCourante > 1 && (
              <button className="bouton bouton-secondaire" onClick={etapePrecedente}>
                <i className="fa-solid fa-arrow-left"></i>
                Precedent
              </button>
            )}
            <div className="espaceur"></div>
            {etapeCourante < nombreTotalEtapes ? (
              <button className="bouton bouton-primaire" onClick={etapeSuivante}>
                Suivant
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                className="bouton bouton-primaire"
                onClick={soumettre}
                disabled={chargement}
              >
                {chargement ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Validation en cours...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Valider mon profil
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageQuestionnaire;
