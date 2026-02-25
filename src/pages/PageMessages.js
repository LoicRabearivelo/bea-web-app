/* Coordinateur de Vie - Page de messagerie */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { serviceMessages, serviceProfessionnels } from '../services/serviceApi';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import './PageMessages.css';

function PageMessages() {
  const { utilisateur } = utiliserAuthentification();
  const [messages, setMessages] = useState([]);
  const [professionnels, setProfessionnels] = useState([]);
  const [conversationActive, setConversationActive] = useState(null);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const [modeNouvelleConversation, setModeNouvelleConversation] = useState(false);
  const [destinataireSelectionne, setDestinataireSelectionne] = useState('');
  const referenceFinMessages = useRef(null);

  const chargerDonnees = useCallback(async () => {
    try {
      setChargement(true);
      const [messagesCharges, professionnelsCharges] = await Promise.all([
        serviceMessages.listerTous(utilisateur.identifiant),
        serviceProfessionnels.listerTous()
      ]);
      setMessages(messagesCharges);
      setProfessionnels(professionnelsCharges);
    } catch (erreur) {
      console.error('Erreur lors du chargement des messages :', erreur);
    } finally {
      setChargement(false);
    }
  }, [utilisateur.identifiant]);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  useEffect(() => {
    if (referenceFinMessages.current) {
      referenceFinMessages.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationActive, messages]);

  /* Identifiant effectif pour la messagerie */
  const identifiantEffectif = utilisateur.typeProfil === 'professionnel'
    ? (utilisateur.identifiantProfessionnel || utilisateur.identifiant)
    : utilisateur.identifiant;
  const typeEffectif = utilisateur.typeProfil || 'patient';

  /* Regrouper les messages par interlocuteur */
  const obtenirConversations = () => {
    const conversations = {};
    messages.forEach((message) => {
      const estExpediteur = message.identifiantExpediteur === identifiantEffectif &&
        message.typeExpediteur === typeEffectif;
      const idInterlocuteur = estExpediteur
        ? message.identifiantDestinataire
        : message.identifiantExpediteur;
      const typeInterlocuteur = estExpediteur
        ? message.typeDestinataire
        : message.typeExpediteur;
      const nomInterlocuteur = estExpediteur
        ? message.nomDestinataire
        : message.nomExpediteur;
      const cleConversation = typeInterlocuteur + '-' + idInterlocuteur;

      if (!conversations[cleConversation]) {
        conversations[cleConversation] = {
          idInterlocuteur,
          typeInterlocuteur,
          nomInterlocuteur,
          messages: [],
          dernierMessage: null
        };
      }
      conversations[cleConversation].messages.push(message);
      if (!conversations[cleConversation].dernierMessage ||
          new Date(message.dateEnvoi || message.date) > new Date(conversations[cleConversation].dernierMessage.dateEnvoi || conversations[cleConversation].dernierMessage.date)) {
        conversations[cleConversation].dernierMessage = message;
      }
    });

    return Object.values(conversations).sort((a, b) =>
      new Date(b.dernierMessage.dateEnvoi || b.dernierMessage.date) - new Date(a.dernierMessage.dateEnvoi || a.dernierMessage.date)
    );
  };

  const envoyerMessage = async (evenement) => {
    evenement.preventDefault();
    if (!nouveauMessage.trim()) return;

    let idDestinataire;
    let nomDestinataire;
    let typeDestinataire = 'professionnel';

    if (modeNouvelleConversation) {
      if (!destinataireSelectionne) return;
      idDestinataire = parseInt(destinataireSelectionne) || destinataireSelectionne;
      const professionnel = professionnels.find((p) => p.identifiant === idDestinataire);
      nomDestinataire = professionnel ? professionnel.nomComplet : 'Inconnu';
    } else if (conversationActive) {
      idDestinataire = conversationActive.idInterlocuteur;
      nomDestinataire = conversationActive.nomInterlocuteur;
      typeDestinataire = conversationActive.typeInterlocuteur || 'professionnel';
    } else {
      return;
    }

    try {
      const messageEnvoye = await serviceMessages.envoyer({
        idExpediteur: identifiantEffectif,
        typeExpediteur: typeEffectif,
        nomExpediteur: utilisateur.nomComplet || utilisateur.profil?.nomComplet || 'Utilisateur',
        idDestinataire,
        typeDestinataire,
        nomDestinataire,
        contenu: nouveauMessage
      });
      setMessages((precedents) => [...precedents, messageEnvoye]);
      setNouveauMessage('');
      setModeNouvelleConversation(false);

      if (!conversationActive || conversationActive.idInterlocuteur !== idDestinataire) {
        setConversationActive({
          idInterlocuteur: idDestinataire,
          nomInterlocuteur: nomDestinataire,
          messages: [...(conversationActive ? conversationActive.messages : []), messageEnvoye]
        });
      }
    } catch (erreur) {
      console.error('Erreur lors de l envoi du message :', erreur);
    }
  };

  const formaterDate = (chaineDate) => {
    const date = new Date(chaineDate);
    const maintenant = new Date();
    const differenceJours = Math.floor((maintenant - date) / (1000 * 60 * 60 * 24));
    if (differenceJours === 0) {
      return 'Aujourd\'hui, ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    if (differenceJours === 1) {
      return 'Hier, ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) +
           ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const conversations = obtenirConversations();
  const messagesConversation = conversationActive
    ? messages.filter((message) => {
        const estExpediteur = message.identifiantExpediteur === identifiantEffectif &&
          message.typeExpediteur === typeEffectif;
        const estDestinataire = message.identifiantDestinataire === identifiantEffectif &&
          message.typeDestinataire === typeEffectif;
        if (estExpediteur) {
          return message.identifiantDestinataire === conversationActive.idInterlocuteur &&
            message.typeDestinataire === conversationActive.typeInterlocuteur;
        }
        if (estDestinataire) {
          return message.identifiantExpediteur === conversationActive.idInterlocuteur &&
            message.typeExpediteur === conversationActive.typeInterlocuteur;
        }
        return false;
      }).sort((a, b) => new Date(a.dateEnvoi || a.date) - new Date(b.dateEnvoi || b.date))
    : [];

  if (chargement) {
    return (
      <div className="page-messages">
        <div className="conteneur">
          <div className="indicateur-chargement">
            <div className="animation-chargement"></div>
            <p>Chargement de vos messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-messages">
      <div className="conteneur">
        <div className="interface-messagerie">
          {/* Panneau lateral des conversations */}
          <div className="panneau-conversations">
            <div className="en-tete-conversations">
              <h2><i className="fa-solid fa-comments"></i> Messages</h2>
              <button
                className="bouton bouton-primaire bouton-petit"
                onClick={() => {
                  setModeNouvelleConversation(true);
                  setConversationActive(null);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="conversations-vide">
                <i className="fa-regular fa-comment-dots"></i>
                <p>Aucune conversation pour le moment</p>
              </div>
            ) : (
              <div className="liste-conversations">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.typeInterlocuteur + '-' + conversation.idInterlocuteur}
                    className={`element-conversation ${conversationActive && conversationActive.idInterlocuteur === conversation.idInterlocuteur && conversationActive.typeInterlocuteur === conversation.typeInterlocuteur ? 'actif' : ''}`}
                    onClick={() => {
                      setConversationActive(conversation);
                      setModeNouvelleConversation(false);
                    }}
                  >
                    <div className="avatar-conversation">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="apercu-conversation">
                      <div className="en-tete-apercu">
                        <span className="nom-interlocuteur">{conversation.nomInterlocuteur}</span>
                        <span className="date-dernier-message">
                          {formaterDate(conversation.dernierMessage.dateEnvoi || conversation.dernierMessage.date)}
                        </span>
                      </div>
                      <p className="texte-apercu">
                        {conversation.dernierMessage.contenu.length > 50
                          ? conversation.dernierMessage.contenu.substring(0, 50) + '...'
                          : conversation.dernierMessage.contenu
                        }
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zone de conversation */}
          <div className="panneau-messages">
            {modeNouvelleConversation ? (
              <>
                <div className="en-tete-messages">
                  <h3><i className="fa-solid fa-pen-to-square"></i> Nouvelle conversation</h3>
                </div>
                <div className="zone-selection-destinataire">
                  <div className="groupe-formulaire">
                    <label htmlFor="destinataire">Choisir un professionnel</label>
                    <select
                      id="destinataire"
                      value={destinataireSelectionne}
                      onChange={(evenement) => setDestinataireSelectionne(evenement.target.value)}
                    >
                      <option value="">Selectionnez un destinataire...</option>
                      {professionnels.map((professionnel) => (
                        <option key={professionnel.identifiant} value={professionnel.identifiant}>
                          {professionnel.nomComplet} - {professionnel.specialite}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <form className="formulaire-message" onSubmit={envoyerMessage}>
                  <input
                    type="text"
                    value={nouveauMessage}
                    onChange={(evenement) => setNouveauMessage(evenement.target.value)}
                    placeholder="Ecrivez votre message..."
                    disabled={!destinataireSelectionne}
                  />
                  <button
                    type="submit"
                    className="bouton bouton-primaire"
                    disabled={!destinataireSelectionne || !nouveauMessage.trim()}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </>
            ) : conversationActive ? (
              <>
                <div className="en-tete-messages">
                  <div className="avatar-conversation petit">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <h3>{conversationActive.nomInterlocuteur}</h3>
                </div>
                <div className="zone-messages">
                  {messagesConversation.map((message) => (
                    <div
                      key={message.identifiant}
                      className={`bulle-message ${message.identifiantExpediteur === identifiantEffectif && message.typeExpediteur === typeEffectif ? 'envoye' : 'recu'}`}
                    >
                      <p className="contenu-message">{message.contenu}</p>
                      <span className="heure-message">
                        {formaterDate(message.dateEnvoi || message.date)}
                      </span>
                    </div>
                  ))}
                  <div ref={referenceFinMessages}></div>
                </div>
                <form className="formulaire-message" onSubmit={envoyerMessage}>
                  <input
                    type="text"
                    value={nouveauMessage}
                    onChange={(evenement) => setNouveauMessage(evenement.target.value)}
                    placeholder="Ecrivez votre message..."
                  />
                  <button
                    type="submit"
                    className="bouton bouton-primaire"
                    disabled={!nouveauMessage.trim()}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="messages-accueil">
                <i className="fa-regular fa-comments"></i>
                <h3>Bienvenue dans votre messagerie</h3>
                <p>Selectionnez une conversation ou creez-en une nouvelle pour echanger avec un professionnel de sante.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageMessages;
