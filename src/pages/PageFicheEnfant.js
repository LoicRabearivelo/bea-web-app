/* Coordinateur de Vie - Page fiche enfant */
import React, { useState } from 'react';
import { serviceFichesEnfants } from '../services/serviceApi';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import './PageFicheEnfant.css';

function PageFicheEnfant() {
  const { utilisateur } = utiliserAuthentification();
  const [fiches, setFiches] = useState([]);
  const [ficheActiveId, setFicheActiveId] = useState(null);
  const [modeCreation, setModeCreation] = useState(false);

  const [formulaire, setFormulaire] = useState({
    prenom: '',
    dateNaissance: '',
    poids: '',
    taille: '',
    perimetreCranien: '',
    alimentation: 'allaitement_maternel',
    notes: ''
  });

  /* Suivi quotidien */
  const [nouvelleDonneeSommeil, setNouvelleDonneeSommeil] = useState({ duree: '', qualite: 'bonne' });
  const [nouvelleDonneeRepas, setNouvelleDonneeRepas] = useState({ type: '', quantite: '', heure: '' });

  const gererChangement = (evenement) => {
    const { name, value } = evenement.target;
    setFormulaire((precedent) => ({ ...precedent, [name]: value }));
  };

  const creerFicheEnfant = async (evenement) => {
    evenement.preventDefault();
    try {
      const ficheCree = await serviceFichesEnfants.creer({
        idParent: utilisateur.identifiant,
        ...formulaire,
        suiviPoids: [{ date: new Date().toISOString().split('T')[0], valeur: formulaire.poids }],
        suiviTaille: [{ date: new Date().toISOString().split('T')[0], valeur: formulaire.taille }],
        suiviSommeil: [],
        suiviRepas: [],
        vaccinations: [],
        maladies: [],
        apprentissages: []
      });
      setFiches((precedentes) => [...precedentes, ficheCree]);
      setModeCreation(false);
      setFicheActiveId(ficheCree.identifiant);
      setFormulaire({
        prenom: '', dateNaissance: '', poids: '', taille: '',
        perimetreCranien: '', alimentation: 'allaitement_maternel', notes: ''
      });
    } catch (erreur) {
      console.error('Erreur lors de la creation de la fiche enfant :', erreur);
    }
  };

  const ficheActive = fiches.find((fiche) => fiche.identifiant === ficheActiveId);

  const calculerAge = (dateNaissance) => {
    const naissance = new Date(dateNaissance);
    const maintenant = new Date();
    const differenceMs = maintenant - naissance;
    const jours = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    if (jours < 30) return jours + ' jour' + (jours > 1 ? 's' : '');
    const mois = Math.floor(jours / 30);
    if (mois < 12) return mois + ' mois';
    const annees = Math.floor(mois / 12);
    const moisRestants = mois % 12;
    return annees + ' an' + (annees > 1 ? 's' : '') + (moisRestants > 0 ? ' et ' + moisRestants + ' mois' : '');
  };

  return (
    <div className="page-fiche-enfant">
      <div className="conteneur">
        <h1><i className="fa-solid fa-baby"></i> Fiches enfants</h1>
        <p className="sous-titre-page">
          Suivez le developpement et la sante de votre enfant au quotidien
        </p>

        {/* Liste des fiches existantes et bouton de creation */}
        <div className="barre-fiches">
          {fiches.map((fiche) => (
            <button
              key={fiche.identifiant}
              className={`bouton-fiche ${ficheActiveId === fiche.identifiant ? 'actif' : ''}`}
              onClick={() => { setFicheActiveId(fiche.identifiant); setModeCreation(false); }}
            >
              <i className="fa-solid fa-child"></i> {fiche.prenom}
            </button>
          ))}
          <button
            className="bouton bouton-primaire"
            onClick={() => { setModeCreation(true); setFicheActiveId(null); }}
          >
            <i className="fa-solid fa-plus"></i> Ajouter un enfant
          </button>
        </div>

        {/* Formulaire de creation */}
        {modeCreation && (
          <div className="carte">
            <h3><i className="fa-solid fa-plus-circle"></i> Creer une fiche enfant</h3>
            <form onSubmit={creerFicheEnfant}>
              <div className="grille-champs">
                <div className="groupe-formulaire">
                  <label htmlFor="prenom-enfant">Prenom de l'enfant</label>
                  <input
                    type="text"
                    id="prenom-enfant"
                    name="prenom"
                    value={formulaire.prenom}
                    onChange={gererChangement}
                    required
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="date-naissance-enfant">Date de naissance</label>
                  <input
                    type="date"
                    id="date-naissance-enfant"
                    name="dateNaissance"
                    value={formulaire.dateNaissance}
                    onChange={gererChangement}
                    required
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="poids-enfant">Poids actuel (kg)</label>
                  <input
                    type="number"
                    id="poids-enfant"
                    name="poids"
                    value={formulaire.poids}
                    onChange={gererChangement}
                    step="0.01"
                    placeholder="3.50"
                    required
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="taille-enfant">Taille actuelle (cm)</label>
                  <input
                    type="number"
                    id="taille-enfant"
                    name="taille"
                    value={formulaire.taille}
                    onChange={gererChangement}
                    step="0.1"
                    placeholder="50"
                    required
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="perimetre-cranien">Perimetre cranien (cm)</label>
                  <input
                    type="number"
                    id="perimetre-cranien"
                    name="perimetreCranien"
                    value={formulaire.perimetreCranien}
                    onChange={gererChangement}
                    step="0.1"
                    placeholder="35"
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="alimentation-enfant">Mode d'alimentation</label>
                  <select
                    id="alimentation-enfant"
                    name="alimentation"
                    value={formulaire.alimentation}
                    onChange={gererChangement}
                  >
                    <option value="allaitement_maternel">Allaitement maternel exclusif</option>
                    <option value="allaitement_mixte">Allaitement mixte</option>
                    <option value="biberon">Biberon</option>
                    <option value="diversification">Diversification alimentaire</option>
                  </select>
                </div>
              </div>
              <div className="groupe-formulaire">
                <label htmlFor="notes-enfant">Notes</label>
                <textarea
                  id="notes-enfant"
                  name="notes"
                  rows="3"
                  value={formulaire.notes}
                  onChange={gererChangement}
                  placeholder="Informations complementaires..."
                />
              </div>
              <div className="actions-formulaire-profil">
                <button type="submit" className="bouton bouton-primaire">
                  <i className="fa-solid fa-floppy-disk"></i> Creer la fiche
                </button>
                <button type="button" className="bouton bouton-secondaire" onClick={() => setModeCreation(false)}>
                  <i className="fa-solid fa-xmark"></i> Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Detail d une fiche enfant */}
        {ficheActive && !modeCreation && (
          <div className="detail-fiche-enfant">
            {/* En-tete enfant */}
            <div className="carte en-tete-enfant">
              <div className="avatar-enfant">
                <i className="fa-solid fa-baby"></i>
              </div>
              <div className="infos-enfant">
                <h2>{ficheActive.prenom}</h2>
                <p className="age-enfant">
                  <i className="fa-solid fa-cake-candles"></i> {calculerAge(ficheActive.dateNaissance)}
                </p>
                <div className="statistiques-enfant">
                  <span className="stat-enfant">
                    <i className="fa-solid fa-weight-scale"></i> {ficheActive.poids} kg
                  </span>
                  <span className="stat-enfant">
                    <i className="fa-solid fa-ruler-vertical"></i> {ficheActive.taille} cm
                  </span>
                  {ficheActive.perimetreCranien && (
                    <span className="stat-enfant">
                      <i className="fa-solid fa-circle"></i> PC {ficheActive.perimetreCranien} cm
                    </span>
                  )}
                  <span className="stat-enfant">
                    <i className="fa-solid fa-utensils"></i> {ficheActive.alimentation.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Grille de suivi */}
            <div className="grille-suivi-enfant">
              {/* Sommeil */}
              <div className="carte">
                <h3><i className="fa-solid fa-moon"></i> Suivi du sommeil</h3>
                <form className="formulaire-inline" onSubmit={(evenement) => {
                  evenement.preventDefault();
                  /* Ajout local pour la demonstration */
                  const fichesMisesAJour = fiches.map((fiche) => {
                    if (fiche.identifiant === ficheActive.identifiant) {
                      return {
                        ...fiche,
                        suiviSommeil: [...(fiche.suiviSommeil || []), {
                          date: new Date().toISOString().split('T')[0],
                          ...nouvelleDonneeSommeil
                        }]
                      };
                    }
                    return fiche;
                  });
                  setFiches(fichesMisesAJour);
                  setNouvelleDonneeSommeil({ duree: '', qualite: 'bonne' });
                }}>
                  <div className="groupe-formulaire">
                    <label>Duree (heures)</label>
                    <input
                      type="number"
                      value={nouvelleDonneeSommeil.duree}
                      onChange={(evenement) => setNouvelleDonneeSommeil((precedent) => ({ ...precedent, duree: evenement.target.value }))}
                      step="0.5"
                      placeholder="8"
                    />
                  </div>
                  <div className="groupe-formulaire">
                    <label>Qualite</label>
                    <select
                      value={nouvelleDonneeSommeil.qualite}
                      onChange={(evenement) => setNouvelleDonneeSommeil((precedent) => ({ ...precedent, qualite: evenement.target.value }))}
                    >
                      <option value="excellente">Excellente</option>
                      <option value="bonne">Bonne</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="difficile">Difficile</option>
                    </select>
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-petit">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </form>
                {ficheActive.suiviSommeil && ficheActive.suiviSommeil.length > 0 && (
                  <div className="liste-historique">
                    {ficheActive.suiviSommeil.slice(-3).reverse().map((entree, index) => (
                      <div key={index} className="entree-historique">
                        <span className="texte-petit">{entree.date}</span>
                        <span>{entree.duree}h - {entree.qualite}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Repas */}
              <div className="carte">
                <h3><i className="fa-solid fa-utensils"></i> Suivi des repas</h3>
                <form className="formulaire-inline" onSubmit={(evenement) => {
                  evenement.preventDefault();
                  const fichesMisesAJour = fiches.map((fiche) => {
                    if (fiche.identifiant === ficheActive.identifiant) {
                      return {
                        ...fiche,
                        suiviRepas: [...(fiche.suiviRepas || []), {
                          date: new Date().toISOString().split('T')[0],
                          ...nouvelleDonneeRepas
                        }]
                      };
                    }
                    return fiche;
                  });
                  setFiches(fichesMisesAJour);
                  setNouvelleDonneeRepas({ type: '', quantite: '', heure: '' });
                }}>
                  <div className="groupe-formulaire">
                    <label>Type</label>
                    <input
                      type="text"
                      value={nouvelleDonneeRepas.type}
                      onChange={(evenement) => setNouvelleDonneeRepas((precedent) => ({ ...precedent, type: evenement.target.value }))}
                      placeholder="Tetee, biberon, puree..."
                    />
                  </div>
                  <div className="groupe-formulaire">
                    <label>Quantite</label>
                    <input
                      type="text"
                      value={nouvelleDonneeRepas.quantite}
                      onChange={(evenement) => setNouvelleDonneeRepas((precedent) => ({ ...precedent, quantite: evenement.target.value }))}
                      placeholder="120 ml, 100 g..."
                    />
                  </div>
                  <div className="groupe-formulaire">
                    <label>Heure</label>
                    <input
                      type="time"
                      value={nouvelleDonneeRepas.heure}
                      onChange={(evenement) => setNouvelleDonneeRepas((precedent) => ({ ...precedent, heure: evenement.target.value }))}
                    />
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-petit">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </form>
                {ficheActive.suiviRepas && ficheActive.suiviRepas.length > 0 && (
                  <div className="liste-historique">
                    {ficheActive.suiviRepas.slice(-3).reverse().map((entree, index) => (
                      <div key={index} className="entree-historique">
                        <span className="texte-petit">{entree.date} {entree.heure}</span>
                        <span>{entree.type} - {entree.quantite}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Croissance */}
              <div className="carte">
                <h3><i className="fa-solid fa-chart-line"></i> Courbe de croissance</h3>
                <p className="sous-titre-carte">
                  Dernieres mesures enregistrees pour {ficheActive.prenom}
                </p>
                <div className="donnees-croissance">
                  <div className="donnee-croissance">
                    <span className="libelle-donnee">Poids</span>
                    <span className="valeur-donnee">{ficheActive.poids} kg</span>
                  </div>
                  <div className="donnee-croissance">
                    <span className="libelle-donnee">Taille</span>
                    <span className="valeur-donnee">{ficheActive.taille} cm</span>
                  </div>
                  {ficheActive.perimetreCranien && (
                    <div className="donnee-croissance">
                      <span className="libelle-donnee">Perimetre cranien</span>
                      <span className="valeur-donnee">{ficheActive.perimetreCranien} cm</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apprentissages */}
              <div className="carte">
                <h3><i className="fa-solid fa-graduation-cap"></i> Apprentissages et etapes</h3>
                <p className="sous-titre-carte">
                  Notez les grandes etapes du developpement de votre enfant
                </p>
                <div className="liste-etapes">
                  <div className="etape-enfant">
                    <i className="fa-solid fa-face-smile"></i>
                    <span>Premier sourire</span>
                  </div>
                  <div className="etape-enfant">
                    <i className="fa-solid fa-hand"></i>
                    <span>Premier geste de prehension</span>
                  </div>
                  <div className="etape-enfant">
                    <i className="fa-solid fa-comment"></i>
                    <span>Premiers babillages</span>
                  </div>
                  <div className="etape-enfant non-atteint">
                    <i className="fa-regular fa-circle"></i>
                    <span>Position assise sans appui</span>
                  </div>
                  <div className="etape-enfant non-atteint">
                    <i className="fa-regular fa-circle"></i>
                    <span>Premiers pas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Etat initial sans fiche */}
        {!ficheActive && !modeCreation && fiches.length === 0 && (
          <div className="carte etat-vide">
            <i className="fa-solid fa-baby"></i>
            <h3>Aucune fiche enfant</h3>
            <p>Creez une fiche pour commencer a suivre le developpement de votre enfant.</p>
            <button className="bouton bouton-primaire" onClick={() => setModeCreation(true)}>
              <i className="fa-solid fa-plus"></i> Creer une fiche enfant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageFicheEnfant;
