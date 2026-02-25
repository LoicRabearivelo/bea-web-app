/* Coordinateur de Vie - Page annuaire des professionnels de sante perinatale */
import React, { useState, useEffect, useCallback } from 'react';
import { serviceProfessionnels, serviceRendezVous } from '../services/serviceApi';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import './PageAnnuaire.css';

function PageAnnuaire() {
  const { utilisateur, estConnecte } = utiliserAuthentification();
  const [professionnels, setProfessionnels] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreSpecialite, setFiltreSpecialite] = useState('');
  const [filtreZone, setFiltreZone] = useState('');
  const [recherche, setRecherche] = useState('');
  const [proSelectionnePourRdv, setProSelectionnePourRdv] = useState(null);
  const [dateRendezVous, setDateRendezVous] = useState('');
  const [heureRendezVous, setHeureRendezVous] = useState('');
  const [motifRendezVous, setMotifRendezVous] = useState('');
  const [messageConfirmation, setMessageConfirmation] = useState('');
  const [proDetailId, setProDetailId] = useState(null);

  const chargerProfessionnels = useCallback(async () => {
    try {
      setChargement(true);
      const parametres = {};
      if (filtreSpecialite) parametres.specialite = filtreSpecialite;
      if (filtreZone) parametres.zone = filtreZone;
      if (recherche) parametres.recherche = recherche;
      const donnees = await serviceProfessionnels.listerTous(parametres);
      setProfessionnels(donnees);
    } catch (erreur) {
      console.error('Erreur lors du chargement des professionnels :', erreur);
    } finally {
      setChargement(false);
    }
  }, [filtreSpecialite, filtreZone, recherche]);

  useEffect(() => {
    chargerProfessionnels();
  }, [chargerProfessionnels]);

  const specialites = [
    'Sage-femme',
    'Pediatre',
    'Doula',
    'Consultante en lactation',
    'Osteopathe perinatal',
    'Psychologue perinatal'
  ];

  const zones = [
    'Saint-Denis',
    'Saint-Pierre',
    'Saint-Paul',
    'Saint-Benoit',
    'Le Tampon',
    'Cilaos',
    'Sainte-Marie',
    'Sainte-Suzanne',
    'La Possession',
    'Le Port'
  ];

  const reinitialiserFiltres = () => {
    setFiltreSpecialite('');
    setFiltreZone('');
    setRecherche('');
  };

  const soumettreRendezVous = async (evenement) => {
    evenement.preventDefault();
    if (!estConnecte || !proSelectionnePourRdv) return;

    try {
      await serviceRendezVous.creer({
        idPatient: utilisateur.identifiant,
        idProfessionnel: proSelectionnePourRdv.identifiant,
        date: dateRendezVous,
        heure: heureRendezVous,
        motif: motifRendezVous
      });
      setMessageConfirmation('Votre demande de rendez-vous a bien ete envoyee. Le professionnel vous confirmera le creneau.');
      setDateRendezVous('');
      setHeureRendezVous('');
      setMotifRendezVous('');
      setTimeout(() => {
        setProSelectionnePourRdv(null);
        setMessageConfirmation('');
      }, 3000);
    } catch (erreur) {
      console.error('Erreur lors de la prise de rendez-vous :', erreur);
    }
  };

  const calculerMoyenneAvis = (avis) => {
    if (!avis || avis.length === 0) return null;
    const somme = avis.reduce((acc, element) => acc + element.note, 0);
    return (somme / avis.length).toFixed(1);
  };

  const afficherEtoiles = (note) => {
    const etoiles = [];
    const noteEntiere = Math.floor(note);
    const demiEtoile = note - noteEntiere >= 0.5;
    for (let index = 0; index < noteEntiere; index++) {
      etoiles.push(<i key={'pleine-' + index} className="fa-solid fa-star etoile-pleine"></i>);
    }
    if (demiEtoile) {
      etoiles.push(<i key="demi" className="fa-solid fa-star-half-stroke etoile-demi"></i>);
    }
    const restantes = 5 - noteEntiere - (demiEtoile ? 1 : 0);
    for (let index = 0; index < restantes; index++) {
      etoiles.push(<i key={'vide-' + index} className="fa-regular fa-star etoile-vide"></i>);
    }
    return etoiles;
  };

  return (
    <div className="page-annuaire">
      <div className="conteneur">
        <h1><i className="fa-solid fa-address-book"></i> Annuaire des professionnels</h1>
        <p className="sous-titre-page">
          Trouvez les professionnels de sante perinatale pres de chez vous a La Reunion
        </p>

        {/* Barre de filtres */}
        <div className="carte barre-filtres">
          <div className="grille-filtres">
            <div className="groupe-formulaire">
              <label htmlFor="recherche-pro">Recherche</label>
              <div className="champ-avec-icone">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  id="recherche-pro"
                  placeholder="Nom ou specialite..."
                  value={recherche}
                  onChange={(evenement) => setRecherche(evenement.target.value)}
                />
              </div>
            </div>
            <div className="groupe-formulaire">
              <label htmlFor="filtre-specialite">Specialite</label>
              <select
                id="filtre-specialite"
                value={filtreSpecialite}
                onChange={(evenement) => setFiltreSpecialite(evenement.target.value)}
              >
                <option value="">Toutes les specialites</option>
                {specialites.map((specialite) => (
                  <option key={specialite} value={specialite}>{specialite}</option>
                ))}
              </select>
            </div>
            <div className="groupe-formulaire">
              <label htmlFor="filtre-zone">Zone geographique</label>
              <select
                id="filtre-zone"
                value={filtreZone}
                onChange={(evenement) => setFiltreZone(evenement.target.value)}
              >
                <option value="">Toute La Reunion</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div className="groupe-formulaire actions-filtre">
              <button className="bouton bouton-secondaire" onClick={reinitialiserFiltres}>
                <i className="fa-solid fa-rotate-left"></i> Reinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Resultats */}
        {chargement ? (
          <div className="indicateur-chargement">
            <div className="animation-chargement"></div>
            <p>Recherche des professionnels...</p>
          </div>
        ) : professionnels.length === 0 ? (
          <div className="carte message-vide">
            <i className="fa-solid fa-search"></i>
            <h3>Aucun professionnel trouve</h3>
            <p>Essayez de modifier vos criteres de recherche ou de reinitialiser les filtres.</p>
            <button className="bouton bouton-primaire" onClick={reinitialiserFiltres}>
              Reinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <p className="compteur-resultats">
              {professionnels.length} professionnel{professionnels.length > 1 ? 's' : ''} trouve{professionnels.length > 1 ? 's' : ''}
            </p>
            <div className="liste-professionnels">
              {professionnels.map((professionnel) => {
                const moyenneAvis = calculerMoyenneAvis(professionnel.avis);
                const estDetailAffiche = proDetailId === professionnel.identifiant;

                return (
                  <div key={professionnel.identifiant} className="carte carte-professionnel">
                    <div className="en-tete-professionnel">
                      <div className="avatar-professionnel">
                        <i className="fa-solid fa-user-doctor"></i>
                      </div>
                      <div className="infos-professionnel">
                        <h3>{professionnel.prenom} {professionnel.nom}</h3>
                        <span className="badge badge-primaire">{professionnel.specialite}</span>
                        <div className="localisation-professionnel">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>{professionnel.adresse}, {professionnel.zone}</span>
                        </div>
                        {moyenneAvis && (
                          <div className="note-professionnel">
                            {afficherEtoiles(parseFloat(moyenneAvis))}
                            <span className="texte-note">{moyenneAvis}/5 ({professionnel.avis.length} avis)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="corps-professionnel">
                      <p className="description-professionnel">{professionnel.description}</p>

                      <div className="actions-professionnel">
                        <button
                          className="bouton bouton-primaire"
                          onClick={() => setProDetailId(estDetailAffiche ? null : professionnel.identifiant)}
                        >
                          <i className={estDetailAffiche ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}></i>
                          {estDetailAffiche ? 'Masquer les details' : 'Voir les details'}
                        </button>
                        {estConnecte && utilisateur.typeProfil === 'patient' && (
                          <button
                            className="bouton bouton-secondaire"
                            onClick={() => setProSelectionnePourRdv(professionnel)}
                          >
                            <i className="fa-solid fa-calendar-plus"></i> Prendre rendez-vous
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Details deplies */}
                    {estDetailAffiche && (
                      <div className="details-professionnel">
                        <div className="grille-details">
                          <div className="bloc-detail">
                            <h4><i className="fa-solid fa-phone"></i> Contact</h4>
                            <p>{professionnel.telephone}</p>
                            <p>{professionnel.courriel}</p>
                          </div>
                          <div className="bloc-detail">
                            <h4><i className="fa-solid fa-tags"></i> Specialisations</h4>
                            <div className="liste-tags">
                              {professionnel.sousSpecialites && professionnel.sousSpecialites.map((sousSpec) => (
                                <span key={sousSpec} className="badge badge-secondaire">{sousSpec}</span>
                              ))}
                            </div>
                          </div>
                          <div className="bloc-detail">
                            <h4><i className="fa-solid fa-clock"></i> Disponibilites</h4>
                            <p>{professionnel.disponibilites || 'Contactez le professionnel pour connaitre ses disponibilites.'}</p>
                          </div>
                        </div>

                        {/* Avis */}
                        {professionnel.avis && professionnel.avis.length > 0 && (
                          <div className="section-avis">
                            <h4><i className="fa-solid fa-comments"></i> Avis des patients</h4>
                            {professionnel.avis.map((avisElement, index) => (
                              <div key={index} className="avis-element">
                                <div className="en-tete-avis">
                                  <span className="auteur-avis">{avisElement.auteur}</span>
                                  <div className="etoiles-avis">{afficherEtoiles(avisElement.note)}</div>
                                  <span className="date-avis">{avisElement.date}</span>
                                </div>
                                <p className="commentaire-avis">{avisElement.commentaire}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Modal de prise de rendez-vous */}
        {proSelectionnePourRdv && (
          <div className="modale-superposition" onClick={() => setProSelectionnePourRdv(null)}>
            <div className="modale-contenu" onClick={(evenement) => evenement.stopPropagation()}>
              <button className="bouton-fermer-modale" onClick={() => setProSelectionnePourRdv(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h2>
                <i className="fa-solid fa-calendar-check"></i> Prendre rendez-vous
              </h2>
              <p className="info-rdv-pro">
                avec {proSelectionnePourRdv.prenom} {proSelectionnePourRdv.nom} - {proSelectionnePourRdv.specialite}
              </p>

              {messageConfirmation ? (
                <div className="message-succes">
                  <i className="fa-solid fa-circle-check"></i>
                  <p>{messageConfirmation}</p>
                </div>
              ) : (
                <form onSubmit={soumettreRendezVous}>
                  <div className="groupe-formulaire">
                    <label htmlFor="date-rdv">Date souhaitee</label>
                    <input
                      type="date"
                      id="date-rdv"
                      value={dateRendezVous}
                      onChange={(evenement) => setDateRendezVous(evenement.target.value)}
                      required
                    />
                  </div>
                  <div className="groupe-formulaire">
                    <label htmlFor="heure-rdv">Heure souhaitee</label>
                    <input
                      type="time"
                      id="heure-rdv"
                      value={heureRendezVous}
                      onChange={(evenement) => setHeureRendezVous(evenement.target.value)}
                      required
                    />
                  </div>
                  <div className="groupe-formulaire">
                    <label htmlFor="motif-rdv">Motif de la consultation</label>
                    <textarea
                      id="motif-rdv"
                      rows="3"
                      value={motifRendezVous}
                      onChange={(evenement) => setMotifRendezVous(evenement.target.value)}
                      placeholder="Decrivez brievement la raison de votre rendez-vous..."
                      required
                    />
                  </div>
                  <button type="submit" className="bouton bouton-primaire bouton-pleine-largeur">
                    <i className="fa-solid fa-paper-plane"></i> Envoyer la demande
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageAnnuaire;
