/* Coordinateur de Vie - Page profil utilisateur */
import React, { useState } from 'react';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import { serviceProfil } from '../services/serviceApi';
import './PageProfil.css';

function PageProfil() {
  const { utilisateur, mettreAJourUtilisateur, deconnecter } = utiliserAuthentification();
  const [modeEdition, setModeEdition] = useState(false);
  const [chargementSauvegarde, setChargementSauvegarde] = useState(false);
  const [messageSucces, setMessageSucces] = useState('');

  const [formulaire, setFormulaire] = useState({
    prenom: utilisateur.prenom || '',
    nom: utilisateur.nom || '',
    courriel: utilisateur.courriel || '',
    telephone: utilisateur.telephone || '',
    adresse: utilisateur.adresse || '',
    zone: utilisateur.zone || '',
    dateNaissance: utilisateur.dateNaissance || '',
    /* Champs patient */
    stadeGrossesse: utilisateur.stadeGrossesse || '',
    dateTermePrevue: utilisateur.dateTermePrevue || '',
    /* Champs professionnel */
    specialite: utilisateur.specialite || '',
    description: utilisateur.description || '',
    numeroRpps: utilisateur.numeroRpps || ''
  });

  const gererChangement = (evenement) => {
    const { name, value } = evenement.target;
    setFormulaire((precedent) => ({ ...precedent, [name]: value }));
  };

  const sauvegarderProfil = async (evenement) => {
    evenement.preventDefault();
    try {
      setChargementSauvegarde(true);
      const profilMisAJour = await serviceProfil.mettreAJour(
        utilisateur.typeProfil,
        utilisateur.identifiant,
        formulaire
      );
      mettreAJourUtilisateur(profilMisAJour);
      setModeEdition(false);
      setMessageSucces('Votre profil a ete mis a jour avec succes.');
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (erreur) {
      console.error('Erreur lors de la sauvegarde du profil :', erreur);
    } finally {
      setChargementSauvegarde(false);
    }
  };

  const annulerEdition = () => {
    setFormulaire({
      prenom: utilisateur.prenom || '',
      nom: utilisateur.nom || '',
      courriel: utilisateur.courriel || '',
      telephone: utilisateur.telephone || '',
      adresse: utilisateur.adresse || '',
      zone: utilisateur.zone || '',
      dateNaissance: utilisateur.dateNaissance || '',
      stadeGrossesse: utilisateur.stadeGrossesse || '',
      dateTermePrevue: utilisateur.dateTermePrevue || '',
      specialite: utilisateur.specialite || '',
      description: utilisateur.description || '',
      numeroRpps: utilisateur.numeroRpps || ''
    });
    setModeEdition(false);
  };

  const zones = [
    'Saint-Denis', 'Saint-Pierre', 'Saint-Paul', 'Saint-Benoit',
    'Le Tampon', 'Cilaos', 'Sainte-Marie', 'Sainte-Suzanne',
    'La Possession', 'Le Port'
  ];

  return (
    <div className="page-profil">
      <div className="conteneur">
        <h1><i className="fa-solid fa-user-circle"></i> Mon profil</h1>

        {messageSucces && (
          <div className="alerte alerte-succes">
            <i className="fa-solid fa-circle-check"></i> {messageSucces}
          </div>
        )}

        <div className="grille-profil">
          {/* Carte d identite */}
          <div className="carte carte-identite">
            <div className="avatar-profil">
              <i className={utilisateur.typeProfil === 'professionnel' ? 'fa-solid fa-user-doctor' : 'fa-solid fa-user'}></i>
            </div>
            <h2>{utilisateur.prenom} {utilisateur.nom}</h2>
            <span className="badge badge-primaire">
              {utilisateur.typeProfil === 'professionnel' ? utilisateur.specialite : 'Patient'}
            </span>
            {utilisateur.zone && (
              <p className="zone-profil">
                <i className="fa-solid fa-location-dot"></i> {utilisateur.zone}, La Reunion
              </p>
            )}
            <div className="actions-profil-carte">
              {!modeEdition && (
                <button className="bouton bouton-primaire" onClick={() => setModeEdition(true)}>
                  <i className="fa-solid fa-pen-to-square"></i> Modifier le profil
                </button>
              )}
              <button className="bouton bouton-danger" onClick={deconnecter}>
                <i className="fa-solid fa-right-from-bracket"></i> Se deconnecter
              </button>
            </div>
          </div>

          {/* Formulaire profil */}
          <div className="carte carte-formulaire-profil">
            <h3>
              <i className="fa-solid fa-id-card"></i>
              {modeEdition ? 'Modifier vos informations' : 'Informations personnelles'}
            </h3>

            <form onSubmit={sauvegarderProfil}>
              <div className="grille-champs">
                <div className="groupe-formulaire">
                  <label htmlFor="prenom">Prenom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formulaire.prenom}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formulaire.nom}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="courriel">Adresse courriel</label>
                  <input
                    type="email"
                    id="courriel"
                    name="courriel"
                    value={formulaire.courriel}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="telephone">Telephone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formulaire.telephone}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                    placeholder="0262 XX XX XX"
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="adresse">Adresse</label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formulaire.adresse}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                  />
                </div>
                <div className="groupe-formulaire">
                  <label htmlFor="zone">Zone geographique</label>
                  <select
                    id="zone"
                    name="zone"
                    value={formulaire.zone}
                    onChange={gererChangement}
                    disabled={!modeEdition}
                  >
                    <option value="">Selectionnez une zone</option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Champs specifiques patient */}
              {utilisateur.typeProfil === 'patient' && (
                <>
                  <h4 className="sous-section-profil">
                    <i className="fa-solid fa-heart-pulse"></i> Informations de sante
                  </h4>
                  <div className="grille-champs">
                    <div className="groupe-formulaire">
                      <label htmlFor="stadeGrossesse">Stade actuel</label>
                      <select
                        id="stadeGrossesse"
                        name="stadeGrossesse"
                        value={formulaire.stadeGrossesse}
                        onChange={gererChangement}
                        disabled={!modeEdition}
                      >
                        <option value="">Non renseigne</option>
                        <option value="desir_enfant">Desir d'enfant</option>
                        <option value="premier_trimestre">Premier trimestre</option>
                        <option value="deuxieme_trimestre">Deuxieme trimestre</option>
                        <option value="troisieme_trimestre">Troisieme trimestre</option>
                        <option value="post_natal">Post-natal</option>
                      </select>
                    </div>
                    <div className="groupe-formulaire">
                      <label htmlFor="dateTermePrevue">Date de terme prevue</label>
                      <input
                        type="date"
                        id="dateTermePrevue"
                        name="dateTermePrevue"
                        value={formulaire.dateTermePrevue}
                        onChange={gererChangement}
                        disabled={!modeEdition}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Champs specifiques professionnel */}
              {utilisateur.typeProfil === 'professionnel' && (
                <>
                  <h4 className="sous-section-profil">
                    <i className="fa-solid fa-stethoscope"></i> Informations professionnelles
                  </h4>
                  <div className="grille-champs">
                    <div className="groupe-formulaire">
                      <label htmlFor="specialite">Specialite</label>
                      <input
                        type="text"
                        id="specialite"
                        name="specialite"
                        value={formulaire.specialite}
                        onChange={gererChangement}
                        disabled={!modeEdition}
                      />
                    </div>
                    <div className="groupe-formulaire">
                      <label htmlFor="numeroRpps">Numero RPPS</label>
                      <input
                        type="text"
                        id="numeroRpps"
                        name="numeroRpps"
                        value={formulaire.numeroRpps}
                        onChange={gererChangement}
                        disabled={!modeEdition}
                      />
                    </div>
                  </div>
                  <div className="groupe-formulaire">
                    <label htmlFor="description">Description professionnelle</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formulaire.description}
                      onChange={gererChangement}
                      disabled={!modeEdition}
                    />
                  </div>
                </>
              )}

              {modeEdition && (
                <div className="actions-formulaire-profil">
                  <button
                    type="submit"
                    className="bouton bouton-primaire"
                    disabled={chargementSauvegarde}
                  >
                    <i className="fa-solid fa-floppy-disk"></i>
                    {chargementSauvegarde ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
                  </button>
                  <button type="button" className="bouton bouton-secondaire" onClick={annulerEdition}>
                    <i className="fa-solid fa-xmark"></i> Annuler
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageProfil;
