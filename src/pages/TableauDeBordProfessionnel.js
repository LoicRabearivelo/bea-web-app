/* Coordinateur de Vie - Tableau de bord professionnel */
import React, { useState, useEffect, useCallback } from 'react';
import { serviceRendezVous, serviceMessages } from '../services/serviceApi';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import './TableauDeBordProfessionnel.css';

function TableauDeBordProfessionnel() {
  const { utilisateur } = utiliserAuthentification();
  const [rendezVous, setRendezVous] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [ongletActif, setOngletActif] = useState('agenda');

  const idPro = utilisateur.identifiantProfessionnel || utilisateur.identifiant;

  const chargerDonnees = useCallback(async () => {
    try {
      setChargement(true);
      const [rendezVousCharges, messagesCharges] = await Promise.all([
        serviceRendezVous.listerTous(idPro),
        serviceMessages.listerTous(utilisateur.identifiant)
      ]);
      setRendezVous(rendezVousCharges);
      setMessages(messagesCharges);
    } catch (erreur) {
      console.error('Erreur lors du chargement des donnees du tableau de bord :', erreur);
    } finally {
      setChargement(false);
    }
  }, [utilisateur.identifiant, idPro]);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  const rendezVousAujourdHui = rendezVous.filter((rdv) => {
    const dateRdv = new Date(rdv.date);
    const maintenant = new Date();
    return dateRdv.toDateString() === maintenant.toDateString();
  });

  const rendezVousAVenir = rendezVous.filter((rdv) => {
    const dateRdv = new Date(rdv.date);
    const maintenant = new Date();
    return dateRdv > maintenant;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const rendezVousEnAttente = rendezVous.filter((rdv) => rdv.statut === 'en_attente');

  const messagesNonLus = messages.filter((message) =>
    (message.identifiantDestinataire === idPro || message.idDestinataire === idPro) && !message.lu
  );

  const confirmerRendezVous = async (identifiantRdv) => {
    try {
      await serviceRendezVous.mettreAJour(identifiantRdv, { statut: 'confirme' });
      setRendezVous((precedents) =>
        precedents.map((rdv) => rdv.identifiant === identifiantRdv ? { ...rdv, statut: 'confirme' } : rdv)
      );
    } catch (erreur) {
      console.error('Erreur lors de la confirmation du rendez-vous :', erreur);
    }
  };

  const annulerRendezVous = async (identifiantRdv) => {
    try {
      await serviceRendezVous.mettreAJour(identifiantRdv, { statut: 'annule' });
      setRendezVous((precedents) =>
        precedents.map((rdv) => rdv.identifiant === identifiantRdv ? { ...rdv, statut: 'annule' } : rdv)
      );
    } catch (erreur) {
      console.error('Erreur lors de l annulation du rendez-vous :', erreur);
    }
  };

  const formaterDate = (chaineDate) => {
    return new Date(chaineDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenirCouleurStatut = (statut) => {
    switch (statut) {
      case 'confirme': return 'badge-succes';
      case 'en_attente': return 'badge-avertissement';
      case 'annule': return 'badge-erreur';
      default: return 'badge-secondaire';
    }
  };

  const obtenirLibelleStatut = (statut) => {
    switch (statut) {
      case 'confirme': return 'Confirme';
      case 'en_attente': return 'En attente';
      case 'annule': return 'Annule';
      default: return statut;
    }
  };

  if (chargement) {
    return (
      <div className="page-tableau-pro">
        <div className="conteneur">
          <div className="indicateur-chargement">
            <div className="animation-chargement"></div>
            <p>Chargement de votre espace professionnel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-tableau-pro">
      <div className="conteneur">
        <div className="en-tete-tableau-pro">
          <div>
            <h1><i className="fa-solid fa-stethoscope"></i> Espace professionnel</h1>
            <p className="sous-titre-page">
              Bienvenue, {utilisateur.profil?.nomComplet || utilisateur.nomComplet || 'Professionnel'} - {utilisateur.profil?.specialite || ''}
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grille-statistiques">
          <div className="carte carte-statistique">
            <div className="icone-statistique fond-primaire">
              <i className="fa-solid fa-calendar-day"></i>
            </div>
            <div className="contenu-statistique">
              <span className="valeur-statistique">{rendezVousAujourdHui.length}</span>
              <span className="libelle-statistique">Aujourd'hui</span>
            </div>
          </div>
          <div className="carte carte-statistique">
            <div className="icone-statistique fond-avertissement">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div className="contenu-statistique">
              <span className="valeur-statistique">{rendezVousEnAttente.length}</span>
              <span className="libelle-statistique">En attente</span>
            </div>
          </div>
          <div className="carte carte-statistique">
            <div className="icone-statistique fond-succes">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div className="contenu-statistique">
              <span className="valeur-statistique">{rendezVousAVenir.length}</span>
              <span className="libelle-statistique">A venir</span>
            </div>
          </div>
          <div className="carte carte-statistique">
            <div className="icone-statistique fond-info">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="contenu-statistique">
              <span className="valeur-statistique">{messagesNonLus.length}</span>
              <span className="libelle-statistique">Messages</span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="onglets">
          <button
            className={`onglet ${ongletActif === 'agenda' ? 'actif' : ''}`}
            onClick={() => setOngletActif('agenda')}
          >
            <i className="fa-solid fa-calendar"></i> Agenda
          </button>
          <button
            className={`onglet ${ongletActif === 'demandes' ? 'actif' : ''}`}
            onClick={() => setOngletActif('demandes')}
          >
            <i className="fa-solid fa-inbox"></i> Demandes
            {rendezVousEnAttente.length > 0 && (
              <span className="compteur-onglet">{rendezVousEnAttente.length}</span>
            )}
          </button>
          <button
            className={`onglet ${ongletActif === 'avis' ? 'actif' : ''}`}
            onClick={() => setOngletActif('avis')}
          >
            <i className="fa-solid fa-star"></i> Avis
          </button>
        </div>

        {/* Onglet agenda */}
        {ongletActif === 'agenda' && (
          <div className="contenu-onglet">
            {rendezVousAujourdHui.length > 0 && (
              <div className="section-agenda">
                <h3><i className="fa-solid fa-calendar-day"></i> Aujourd'hui</h3>
                <div className="liste-rendez-vous">
                  {rendezVousAujourdHui.map((rdv) => (
                    <div key={rdv.identifiant} className="carte carte-rdv">
                      <div className="heure-rdv">{rdv.heure}</div>
                      <div className="details-rdv">
                        <h4>{rdv.nomPatient}</h4>
                        <p>{rdv.motif}</p>
                        <span className={`badge ${obtenirCouleurStatut(rdv.statut)}`}>
                          {obtenirLibelleStatut(rdv.statut)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section-agenda">
              <h3><i className="fa-solid fa-calendar"></i> Prochains rendez-vous</h3>
              {rendezVousAVenir.length === 0 ? (
                <div className="carte message-vide-petit">
                  <p>Aucun rendez-vous a venir pour le moment.</p>
                </div>
              ) : (
                <div className="liste-rendez-vous">
                  {rendezVousAVenir.slice(0, 10).map((rdv) => (
                    <div key={rdv.identifiant} className="carte carte-rdv">
                      <div className="heure-rdv">
                        <span className="date-rdv">{formaterDate(rdv.date)}</span>
                        <span>{rdv.heure}</span>
                      </div>
                      <div className="details-rdv">
                        <h4>{rdv.nomPatient}</h4>
                        <p>{rdv.motif}</p>
                        <span className={`badge ${obtenirCouleurStatut(rdv.statut)}`}>
                          {obtenirLibelleStatut(rdv.statut)}
                        </span>
                      </div>
                      {rdv.statut === 'en_attente' && (
                        <div className="actions-rdv">
                          <button className="bouton bouton-primaire bouton-petit" onClick={() => confirmerRendezVous(rdv.identifiant)}>
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button className="bouton bouton-danger bouton-petit" onClick={() => annulerRendezVous(rdv.identifiant)}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet demandes en attente */}
        {ongletActif === 'demandes' && (
          <div className="contenu-onglet">
            {rendezVousEnAttente.length === 0 ? (
              <div className="carte message-vide">
                <i className="fa-solid fa-inbox"></i>
                <h3>Aucune demande en attente</h3>
                <p>Toutes les demandes de rendez-vous ont ete traitees.</p>
              </div>
            ) : (
              <div className="liste-rendez-vous">
                {rendezVousEnAttente.map((rdv) => (
                  <div key={rdv.identifiant} className="carte carte-rdv carte-demande">
                    <div className="heure-rdv">
                      <span className="date-rdv">{formaterDate(rdv.date)}</span>
                      <span>{rdv.heure}</span>
                    </div>
                    <div className="details-rdv">
                      <h4>{rdv.nomPatient}</h4>
                      <p>{rdv.motif}</p>
                    </div>
                    <div className="actions-rdv">
                      <button
                        className="bouton bouton-primaire"
                        onClick={() => confirmerRendezVous(rdv.identifiant)}
                      >
                        <i className="fa-solid fa-check"></i> Confirmer
                      </button>
                      <button
                        className="bouton bouton-danger"
                        onClick={() => annulerRendezVous(rdv.identifiant)}
                      >
                        <i className="fa-solid fa-xmark"></i> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet avis */}
        {ongletActif === 'avis' && (
          <div className="contenu-onglet">
            {utilisateur.avis && utilisateur.avis.length > 0 ? (
              <div className="liste-avis-pro">
                {utilisateur.avis.map((avisElement, index) => (
                  <div key={index} className="carte avis-pro-element">
                    <div className="en-tete-avis-pro">
                      <div className="avatar-auteur petit">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div>
                        <span className="nom-auteur">{avisElement.auteur}</span>
                        <span className="date-message">{avisElement.date}</span>
                      </div>
                      <div className="note-avis-pro">
                        {[1, 2, 3, 4, 5].map((etoile) => (
                          <i
                            key={etoile}
                            className={`fa-${etoile <= avisElement.note ? 'solid' : 'regular'} fa-star`}
                            style={{ color: etoile <= avisElement.note ? '#f0ad4e' : '#ddd' }}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <p className="commentaire-avis-pro">{avisElement.commentaire}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="carte message-vide">
                <i className="fa-solid fa-star"></i>
                <h3>Aucun avis pour le moment</h3>
                <p>Les avis de vos patients apparaitront ici au fur et a mesure.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TableauDeBordProfessionnel;
