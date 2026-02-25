/* ==========================================================================
   Coordinateur de Vie - Module de suivi de sante complet
   Ce composant integre tous les modules de suivi : cycle menstruel,
   grossesse, sante mentale, post-natal, couple, allaitement et dietetique.
   ========================================================================== */

import React, { useState } from "react";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import { serviceSuivi } from "../services/serviceApi";
import "./PageSuivi.css";

function PageSuivi() {
  const { utilisateur, mettreAJourUtilisateur } = utiliserAuthentification();
  const [ongletActif, definirOngletActif] = useState("grossesse");
  const [messageSucces, definirMessageSucces] = useState("");

  /* Etats des formulaires de suivi */
  const [formulaireSuiviGrossesse, definirFormulaireSuiviGrossesse] = useState({
    semaine: "", poids: "", tensionArterielle: "", humeur: "", notes: "",
  });
  const [formulaireSanteMentale, definirFormulaireSanteMentale] = useState({
    score: 5, humeur: "", notes: "",
  });
  const [formulaireCycle, definirFormulaireCycle] = useState({
    mois: "", duree: "", dateDebut: "", dateFin: "", ovulation: "", symptomes: "",
  });
  const [formulaireAllaitement, definirFormulaireAllaitement] = useState({
    nombreTetees: "", duree: "", difficultes: "", notes: "",
  });
  const [formulaireCouple, definirFormulaireCouple] = useState({
    score: 5, communication: "", qualite: "", notes: "",
  });

  /* Afficher un message de succes temporaire */
  const afficherSucces = (message) => {
    definirMessageSucces(message);
    setTimeout(() => definirMessageSucces(""), 3000);
  };

  /* Soumission du suivi de grossesse */
  const soumettreGrossesse = async (evenement) => {
    evenement.preventDefault();
    try {
      await serviceSuivi.ajouterSuiviGrossesse(utilisateur.identifiant, {
        ...formulaireSuiviGrossesse,
        semaine: parseInt(formulaireSuiviGrossesse.semaine),
        poids: parseFloat(formulaireSuiviGrossesse.poids),
      });
      afficherSucces("Donnee de suivi de grossesse enregistree avec succes.");
      definirFormulaireSuiviGrossesse({ semaine: "", poids: "", tensionArterielle: "", humeur: "", notes: "" });
    } catch (erreur) {
      console.error("Erreur:", erreur);
    }
  };

  /* Soumission du suivi de sante mentale */
  const soumettreSanteMentale = async (evenement) => {
    evenement.preventDefault();
    try {
      await serviceSuivi.ajouterSuiviSanteMentale(utilisateur.identifiant, {
        date: new Date().toISOString().split("T")[0],
        score: parseInt(formulaireSanteMentale.score),
        humeur: formulaireSanteMentale.humeur,
        notes: formulaireSanteMentale.notes,
      });
      afficherSucces("Votre etat de sante mentale a ete enregistre.");
      definirFormulaireSanteMentale({ score: 5, humeur: "", notes: "" });
    } catch (erreur) {
      console.error("Erreur:", erreur);
    }
  };

  /* Soumission du suivi du cycle */
  const soumettreCycle = async (evenement) => {
    evenement.preventDefault();
    try {
      await serviceSuivi.ajouterSuiviCycle(utilisateur.identifiant, {
        ...formulaireCycle,
        duree: parseInt(formulaireCycle.duree),
        symptomes: formulaireCycle.symptomes.split(",").map((s) => s.trim()),
      });
      afficherSucces("Donnee de suivi du cycle enregistree.");
      definirFormulaireCycle({ mois: "", duree: "", dateDebut: "", dateFin: "", ovulation: "", symptomes: "" });
    } catch (erreur) {
      console.error("Erreur:", erreur);
    }
  };

  /* Soumission du suivi de l'allaitement */
  const soumettreAllaitement = async (evenement) => {
    evenement.preventDefault();
    try {
      await serviceSuivi.ajouterSuiviAllaitement(utilisateur.identifiant, {
        date: new Date().toISOString().split("T")[0],
        nombreTetees: parseInt(formulaireAllaitement.nombreTetees),
        duree: formulaireAllaitement.duree,
        difficultes: formulaireAllaitement.difficultes,
        notes: formulaireAllaitement.notes,
      });
      afficherSucces("Donnee de suivi de l'allaitement enregistree.");
      definirFormulaireAllaitement({ nombreTetees: "", duree: "", difficultes: "", notes: "" });
    } catch (erreur) {
      console.error("Erreur:", erreur);
    }
  };

  /* Les onglets de suivi disponibles */
  const onglets = [
    { identifiant: "grossesse", libelle: "Grossesse", icone: "fa-baby" },
    { identifiant: "cycle", libelle: "Cycle", icone: "fa-calendar-days" },
    { identifiant: "sante_mentale", libelle: "Sante mentale", icone: "fa-brain" },
    { identifiant: "allaitement", libelle: "Allaitement", icone: "fa-baby-carriage" },
    { identifiant: "couple", libelle: "Couple", icone: "fa-heart" },
    { identifiant: "dietetique", libelle: "Dietetique", icone: "fa-apple-whole" },
    { identifiant: "post_natal", libelle: "Post-natal", icone: "fa-hand-holding-heart" },
  ];

  /* Niveaux d'humeur pour les selecteurs */
  const humeurs = [
    "Tres bien", "Bien", "Sereine", "Correcte", "Fatiguee",
    "Anxieuse", "Triste", "Difficile", "Tres difficile",
  ];

  return (
    <div className="page-suivi">
      <div className="conteneur">
        <h1>
          <i className="fa-solid fa-chart-line"></i> Mon suivi de sante
        </h1>
        <p className="sous-titre-page">
          Suivez votre parcours au quotidien. Toutes vos donnees sont centralisees ici.
        </p>

        {messageSucces && (
          <div className="alerte alerte-succes">
            <i className="fa-solid fa-circle-check"></i>
            {messageSucces}
          </div>
        )}

        {/* Barre d'onglets */}
        <div className="barre-onglets">
          {onglets.map((onglet) => (
            <button
              key={onglet.identifiant}
              className={`onglet ${ongletActif === onglet.identifiant ? "actif" : ""}`}
              onClick={() => definirOngletActif(onglet.identifiant)}
            >
              <i className={`fa-solid ${onglet.icone}`}></i>
              {onglet.libelle}
            </button>
          ))}
        </div>

        {/* Contenu du suivi de grossesse */}
        {ongletActif === "grossesse" && (
          <div className="contenu-onglet">
            <div className="grille grille-deux-colonnes">
              {/* Formulaire d'ajout */}
              <div className="carte">
                <h3><i className="fa-solid fa-plus-circle"></i> Ajouter une entree</h3>
                <form onSubmit={soumettreGrossesse}>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-calendar-week"></i> Semaine d'amenorrhee</label>
                    <input type="number" className="champ-saisie" min="1" max="42"
                      value={formulaireSuiviGrossesse.semaine}
                      onChange={(e) => definirFormulaireSuiviGrossesse({...formulaireSuiviGrossesse, semaine: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-weight-scale"></i> Poids (en kilogrammes)</label>
                    <input type="number" step="0.1" className="champ-saisie"
                      value={formulaireSuiviGrossesse.poids}
                      onChange={(e) => definirFormulaireSuiviGrossesse({...formulaireSuiviGrossesse, poids: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-heart-pulse"></i> Tension arterielle</label>
                    <input type="text" className="champ-saisie" placeholder="Exemple : 12/7"
                      value={formulaireSuiviGrossesse.tensionArterielle}
                      onChange={(e) => definirFormulaireSuiviGrossesse({...formulaireSuiviGrossesse, tensionArterielle: e.target.value})}
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-face-smile"></i> Humeur</label>
                    <select className="champ-saisie"
                      value={formulaireSuiviGrossesse.humeur}
                      onChange={(e) => definirFormulaireSuiviGrossesse({...formulaireSuiviGrossesse, humeur: e.target.value})}
                    >
                      <option value="">Selectionnez votre humeur</option>
                      {humeurs.map((h) => <option key={h} value={h.toLowerCase()}>{h}</option>)}
                    </select>
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-pen"></i> Notes et observations</label>
                    <textarea className="champ-saisie" rows="3"
                      placeholder="Comment vous sentez-vous ? Des symptomes particuliers ?"
                      value={formulaireSuiviGrossesse.notes}
                      onChange={(e) => definirFormulaireSuiviGrossesse({...formulaireSuiviGrossesse, notes: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-large">
                    <i className="fa-solid fa-save"></i> Enregistrer
                  </button>
                </form>
              </div>

              {/* Historique */}
              <div className="carte">
                <h3><i className="fa-solid fa-clock-rotate-left"></i> Historique</h3>
                {utilisateur.suiviGrossesse?.length > 0 ? (
                  <div className="liste-historique">
                    {[...utilisateur.suiviGrossesse].reverse().map((entree, index) => (
                      <div key={index} className="entree-historique">
                        <div className="entree-en-tete">
                          <span className="badge badge-primaire">Semaine {entree.semaine}</span>
                          <span className="texte-petit">{entree.poids} kg</span>
                        </div>
                        {entree.tensionArterielle && (
                          <p className="entree-detail">
                            <i className="fa-solid fa-heart-pulse"></i> Tension : {entree.tensionArterielle}
                          </p>
                        )}
                        {entree.humeur && (
                          <p className="entree-detail">
                            <i className="fa-solid fa-face-smile"></i> Humeur : {entree.humeur}
                          </p>
                        )}
                        {entree.notes && <p className="entree-notes">{entree.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="texte-vide">
                    <i className="fa-solid fa-chart-simple"></i>
                    Aucune donnee de suivi de grossesse pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu du suivi du cycle */}
        {ongletActif === "cycle" && (
          <div className="contenu-onglet">
            <div className="grille grille-deux-colonnes">
              <div className="carte">
                <h3><i className="fa-solid fa-plus-circle"></i> Enregistrer un cycle</h3>
                <form onSubmit={soumettreCycle}>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-calendar"></i> Mois</label>
                    <input type="month" className="champ-saisie"
                      value={formulaireCycle.mois}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, mois: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-hourglass-half"></i> Duree du cycle (en jours)</label>
                    <input type="number" className="champ-saisie" min="20" max="45"
                      value={formulaireCycle.duree}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, duree: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-calendar-day"></i> Date de debut des regles</label>
                    <input type="date" className="champ-saisie"
                      value={formulaireCycle.dateDebut}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, dateDebut: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-calendar-day"></i> Date de fin des regles</label>
                    <input type="date" className="champ-saisie"
                      value={formulaireCycle.dateFin}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, dateFin: e.target.value})}
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-star"></i> Date estimee d'ovulation</label>
                    <input type="date" className="champ-saisie"
                      value={formulaireCycle.ovulation}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, ovulation: e.target.value})}
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-notes-medical"></i> Symptomes (separes par des virgules)</label>
                    <input type="text" className="champ-saisie"
                      placeholder="Exemple : fatigue, douleurs abdominales, nausees"
                      value={formulaireCycle.symptomes}
                      onChange={(e) => definirFormulaireCycle({...formulaireCycle, symptomes: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-large">
                    <i className="fa-solid fa-save"></i> Enregistrer
                  </button>
                </form>
              </div>

              <div className="carte">
                <h3><i className="fa-solid fa-clock-rotate-left"></i> Historique des cycles</h3>
                {utilisateur.suiviCycle?.length > 0 ? (
                  <div className="liste-historique">
                    {[...utilisateur.suiviCycle].reverse().map((cycle, index) => (
                      <div key={index} className="entree-historique">
                        <div className="entree-en-tete">
                          <span className="badge badge-primaire">{cycle.mois}</span>
                          <span className="texte-petit">{cycle.duree} jours</span>
                        </div>
                        <p className="entree-detail">
                          <i className="fa-solid fa-calendar-day"></i> Du {cycle.dateDebut} au {cycle.dateFin}
                        </p>
                        {cycle.ovulation && (
                          <p className="entree-detail">
                            <i className="fa-solid fa-star"></i> Ovulation : {cycle.ovulation}
                          </p>
                        )}
                        {cycle.symptomes?.length > 0 && (
                          <div className="entree-symptomes">
                            {cycle.symptomes.map((s, i) => (
                              <span key={i} className="badge badge-secondaire">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="texte-vide">
                    <i className="fa-solid fa-calendar-days"></i>
                    Aucune donnee de suivi du cycle pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu du suivi de sante mentale */}
        {ongletActif === "sante_mentale" && (
          <div className="contenu-onglet">
            <div className="grille grille-deux-colonnes">
              <div className="carte">
                <h3><i className="fa-solid fa-plus-circle"></i> Comment allez-vous aujourd'hui ?</h3>
                <form onSubmit={soumettreSanteMentale}>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-gauge"></i> Score de bien-etre (1 a 10)</label>
                    <div className="selecteur-score">
                      <input type="range" min="1" max="10" className="curseur-score"
                        value={formulaireSanteMentale.score}
                        onChange={(e) => definirFormulaireSanteMentale({...formulaireSanteMentale, score: e.target.value})}
                      />
                      <span className="valeur-score">{formulaireSanteMentale.score}/10</span>
                    </div>
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-face-smile"></i> Humeur generale</label>
                    <select className="champ-saisie"
                      value={formulaireSanteMentale.humeur}
                      onChange={(e) => definirFormulaireSanteMentale({...formulaireSanteMentale, humeur: e.target.value})}
                      required
                    >
                      <option value="">Comment vous sentez-vous ?</option>
                      {humeurs.map((h) => <option key={h} value={h.toLowerCase()}>{h}</option>)}
                    </select>
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-pen"></i> Vos pensees et emotions</label>
                    <textarea className="champ-saisie" rows="4"
                      placeholder="Prenez le temps de decrire ce que vous ressentez. C'est important."
                      value={formulaireSanteMentale.notes}
                      onChange={(e) => definirFormulaireSanteMentale({...formulaireSanteMentale, notes: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-large">
                    <i className="fa-solid fa-save"></i> Enregistrer mon etat
                  </button>
                </form>
                <div className="message-soutien marge-haut-lg">
                  <i className="fa-solid fa-hand-holding-heart"></i>
                  <p>
                    Si vous vous sentez en detresse, n'hesitez pas a appeler le <strong>3114</strong> (numero national de prevention du suicide) ou a contacter directement un professionnel via notre messagerie.
                  </p>
                </div>
              </div>

              <div className="carte">
                <h3><i className="fa-solid fa-clock-rotate-left"></i> Mon journal de bien-etre</h3>
                {utilisateur.suiviSanteMentale?.length > 0 ? (
                  <div className="liste-historique">
                    {[...utilisateur.suiviSanteMentale].reverse().map((entree, index) => (
                      <div key={index} className={`entree-historique entree-score-${entree.score <= 3 ? "bas" : entree.score <= 6 ? "moyen" : "haut"}`}>
                        <div className="entree-en-tete">
                          <span className="badge badge-primaire">{entree.date}</span>
                          <span className={`badge ${entree.score <= 3 ? "badge-erreur" : entree.score <= 6 ? "badge-avertissement" : "badge-succes"}`}>
                            {entree.score}/10
                          </span>
                        </div>
                        <p className="entree-detail">
                          <i className="fa-solid fa-face-smile"></i> {entree.humeur}
                        </p>
                        {entree.notes && <p className="entree-notes">{entree.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="texte-vide">
                    <i className="fa-solid fa-brain"></i>
                    Commencez a suivre votre bien-etre en ajoutant votre premiere entree.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu du suivi de l'allaitement */}
        {ongletActif === "allaitement" && (
          <div className="contenu-onglet">
            <div className="grille grille-deux-colonnes">
              <div className="carte">
                <h3><i className="fa-solid fa-plus-circle"></i> Enregistrer une journee d'allaitement</h3>
                <form onSubmit={soumettreAllaitement}>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-hashtag"></i> Nombre de tetees</label>
                    <input type="number" className="champ-saisie" min="1" max="20"
                      value={formulaireAllaitement.nombreTetees}
                      onChange={(e) => definirFormulaireAllaitement({...formulaireAllaitement, nombreTetees: e.target.value})}
                      required
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-clock"></i> Duree moyenne d'une tetee</label>
                    <input type="text" className="champ-saisie" placeholder="Exemple : 15 minutes"
                      value={formulaireAllaitement.duree}
                      onChange={(e) => definirFormulaireAllaitement({...formulaireAllaitement, duree: e.target.value})}
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-triangle-exclamation"></i> Difficultes rencontrees</label>
                    <input type="text" className="champ-saisie" placeholder="Exemple : Crevasses, engorgement"
                      value={formulaireAllaitement.difficultes}
                      onChange={(e) => definirFormulaireAllaitement({...formulaireAllaitement, difficultes: e.target.value})}
                    />
                  </div>
                  <div className="groupe-champ">
                    <label><i className="fa-solid fa-pen"></i> Notes et observations</label>
                    <textarea className="champ-saisie" rows="3"
                      placeholder="Comment s'est passe l'allaitement aujourd'hui ?"
                      value={formulaireAllaitement.notes}
                      onChange={(e) => definirFormulaireAllaitement({...formulaireAllaitement, notes: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-large">
                    <i className="fa-solid fa-save"></i> Enregistrer
                  </button>
                </form>
              </div>

              <div className="carte">
                <h3><i className="fa-solid fa-clock-rotate-left"></i> Historique de l'allaitement</h3>
                {utilisateur.suiviAllaitement?.length > 0 ? (
                  <div className="liste-historique">
                    {[...utilisateur.suiviAllaitement].reverse().map((entree, index) => (
                      <div key={index} className="entree-historique">
                        <div className="entree-en-tete">
                          <span className="badge badge-primaire">{entree.date}</span>
                          <span className="texte-petit">{entree.nombreTetees} tetees</span>
                        </div>
                        {entree.duree && <p className="entree-detail"><i className="fa-solid fa-clock"></i> Duree : {entree.duree}</p>}
                        {entree.difficultes && <p className="entree-detail"><i className="fa-solid fa-triangle-exclamation"></i> {entree.difficultes}</p>}
                        {entree.notes && <p className="entree-notes">{entree.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="texte-vide">
                    <i className="fa-solid fa-baby-carriage"></i>
                    Aucune donnee de suivi de l'allaitement pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenu du suivi de couple */}
        {ongletActif === "couple" && (
          <div className="contenu-onglet">
            <div className="carte" style={{maxWidth: "600px"}}>
              <h3><i className="fa-solid fa-heart"></i> Suivi de la relation de couple</h3>
              <p className="sous-titre-carte">
                L'arrivee d'un enfant transforme profondement la dynamique du couple.
                Prendre le temps de faire le point regulierement est precieux.
              </p>
              <div className="groupe-champ">
                <label><i className="fa-solid fa-gauge"></i> Qualite de la communication (1 a 10)</label>
                <div className="selecteur-score">
                  <input type="range" min="1" max="10" className="curseur-score"
                    value={formulaireCouple.score}
                    onChange={(e) => definirFormulaireCouple({...formulaireCouple, score: e.target.value})}
                  />
                  <span className="valeur-score">{formulaireCouple.score}/10</span>
                </div>
              </div>
              <div className="groupe-champ">
                <label><i className="fa-solid fa-comments"></i> Comment qualifiez-vous votre communication ?</label>
                <select className="champ-saisie"
                  value={formulaireCouple.communication}
                  onChange={(e) => definirFormulaireCouple({...formulaireCouple, communication: e.target.value})}
                >
                  <option value="">Choisissez une option</option>
                  <option value="excellente">Excellente - Nous communiquons ouvertement</option>
                  <option value="bonne">Bonne - Des echanges reguliers</option>
                  <option value="correcte">Correcte - Quelques tensions mais ca va</option>
                  <option value="difficile">Difficile - Nous avons du mal a echanger</option>
                  <option value="tres_difficile">Tres difficile - Besoin d'aide exterieure</option>
                </select>
              </div>
              <div className="groupe-champ">
                <label><i className="fa-solid fa-pen"></i> Reflexions personnelles</label>
                <textarea className="champ-saisie" rows="4"
                  placeholder="Prenez un moment pour reflechir a votre relation. Qu'est-ce qui va bien ? Qu'est-ce qui pourrait etre ameliore ?"
                  value={formulaireCouple.notes}
                  onChange={(e) => definirFormulaireCouple({...formulaireCouple, notes: e.target.value})}
                ></textarea>
              </div>
              <button className="bouton bouton-primaire bouton-large" onClick={() => afficherSucces("Votre reflexion a ete enregistree.")}>
                <i className="fa-solid fa-save"></i> Enregistrer
              </button>
            </div>
          </div>
        )}

        {/* Contenu du programme dietetique */}
        {ongletActif === "dietetique" && (
          <div className="contenu-onglet">
            <div className="carte" style={{maxWidth: "700px"}}>
              <h3><i className="fa-solid fa-apple-whole"></i> Votre programme dietetique personnalise</h3>
              {utilisateur.programmeRegimeAlimentaire?.objectif ? (
                <>
                  <div className="objectif-diet marge-haut-md">
                    <i className="fa-solid fa-bullseye"></i>
                    <p><strong>Objectif :</strong> {utilisateur.programmeRegimeAlimentaire.objectif}</p>
                  </div>
                  <h4 className="marge-haut-lg">
                    <i className="fa-solid fa-list-check"></i> Recommandations
                  </h4>
                  <ul className="liste-recommandations-complete">
                    {utilisateur.programmeRegimeAlimentaire.recommandations.map((rec, index) => (
                      <li key={index}>
                        <i className="fa-solid fa-leaf"></i>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="texte-vide">
                  <i className="fa-solid fa-utensils"></i>
                  Completez votre questionnaire de profil pour recevoir des recommandations dietetiques personnalisees.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contenu du suivi post-natal */}
        {ongletActif === "post_natal" && (
          <div className="contenu-onglet">
            <div className="carte" style={{maxWidth: "700px"}}>
              <h3><i className="fa-solid fa-hand-holding-heart"></i> Suivi de la periode post-natale</h3>
              <p className="sous-titre-carte">
                La periode post-natale est une phase de grands changements. Voici les elements
                a surveiller et a noter regulierement.
              </p>
              <div className="liste-points-suivi">
                <div className="point-suivi">
                  <i className="fa-solid fa-droplet"></i>
                  <div>
                    <h4>Saignements post-partum</h4>
                    <p>Les lochies (saignements) diminuent progressivement sur quatre a six semaines. Consultez si les saignements augmentent ou sentent mauvais.</p>
                  </div>
                </div>
                <div className="point-suivi">
                  <i className="fa-solid fa-bed"></i>
                  <div>
                    <h4>Sommeil et recuperation</h4>
                    <p>Le manque de sommeil est normal mais ne doit pas devenir epuisant au point de ne plus fonctionner. Demandez de l'aide autour de vous.</p>
                  </div>
                </div>
                <div className="point-suivi">
                  <i className="fa-solid fa-brain"></i>
                  <div>
                    <h4>Sante emotionnelle</h4>
                    <p>Surveillez les signes de depression post-partum : tristesse persistante, perte d'interet, difficulte a creer un lien avec le bebe.</p>
                  </div>
                </div>
                <div className="point-suivi">
                  <i className="fa-solid fa-calendar-check"></i>
                  <div>
                    <h4>Visite post-natale</h4>
                    <p>La consultation post-natale obligatoire doit avoir lieu dans les six a huit semaines suivant l'accouchement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageSuivi;
