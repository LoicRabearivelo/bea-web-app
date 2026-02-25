/* Coordinateur de Vie - Page communaute et foire aux questions */
import React, { useState, useEffect, useCallback } from 'react';
import { serviceFoireAuxQuestions, serviceMessagesCommunautaires } from '../services/serviceApi';
import { utiliserAuthentification } from '../contextes/ContexteAuthentification';
import './PageCommunaute.css';

function PageCommunaute() {
  const { utilisateur, estConnecte } = utiliserAuthentification();
  const [ongletActif, setOngletActif] = useState('faq');
  const [questions, setQuestions] = useState([]);
  const [messagesCommunautaires, setMessagesCommunautaires] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [questionOuverteId, setQuestionOuverteId] = useState(null);

  /* Formulaire nouvelle question */
  const [nouvelleQuestion, setNouvelleQuestion] = useState('');

  /* Formulaire nouveau message communautaire */
  const [nouveauSujet, setNouveauSujet] = useState('');
  const [nouveauContenu, setNouveauContenu] = useState('');
  const [nouvelleCategorie, setNouvelleCategorie] = useState('general');

  /* Formulaire reponse */
  const [reponseMessageId, setReponseMessageId] = useState(null);
  const [texteReponse, setTexteReponse] = useState('');

  const chargerDonnees = useCallback(async () => {
    try {
      setChargement(true);
      const [questionsChargees, messagesCharges] = await Promise.all([
        serviceFoireAuxQuestions.listerToutes(),
        serviceMessagesCommunautaires.listerTous()
      ]);
      setQuestions(questionsChargees);
      setMessagesCommunautaires(messagesCharges);
    } catch (erreur) {
      console.error('Erreur lors du chargement des donnees communautaires :', erreur);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  const soumettreQuestion = async (evenement) => {
    evenement.preventDefault();
    if (!nouvelleQuestion.trim()) return;
    try {
      const questionCreee = await serviceFoireAuxQuestions.poserQuestion({
        question: nouvelleQuestion,
        auteur: estConnecte ? (utilisateur.nomComplet || utilisateur.profil?.nomComplet || 'Utilisateur') : 'Anonyme'
      });
      setQuestions((precedentes) => [questionCreee, ...precedentes]);
      setNouvelleQuestion('');
    } catch (erreur) {
      console.error('Erreur lors de la soumission de la question :', erreur);
    }
  };

  const soumettreMessageCommunautaire = async (evenement) => {
    evenement.preventDefault();
    if (!nouveauSujet.trim() || !nouveauContenu.trim()) return;
    try {
      const messageCreee = await serviceMessagesCommunautaires.publier({
        idAuteur: utilisateur.identifiant,
        nomAuteur: utilisateur.nomComplet || utilisateur.profil?.nomComplet || 'Utilisateur',
        sujet: nouveauSujet,
        contenu: nouveauContenu,
        categorie: nouvelleCategorie
      });
      setMessagesCommunautaires((precedents) => [messageCreee, ...precedents]);
      setNouveauSujet('');
      setNouveauContenu('');
      setNouvelleCategorie('general');
    } catch (erreur) {
      console.error('Erreur lors de la publication du message :', erreur);
    }
  };

  const soumettreReponse = async (idMessage) => {
    if (!texteReponse.trim()) return;
    try {
      const messageRepondu = await serviceMessagesCommunautaires.repondre(idMessage, {
        idAuteur: utilisateur.identifiant,
        nomAuteur: utilisateur.nomComplet || utilisateur.profil?.nomComplet || 'Utilisateur',
        contenu: texteReponse
      });
      setMessagesCommunautaires((precedents) =>
        precedents.map((message) => message.identifiant === idMessage ? messageRepondu : message)
      );
      setReponseMessageId(null);
      setTexteReponse('');
    } catch (erreur) {
      console.error('Erreur lors de la soumission de la reponse :', erreur);
    }
  };

  const categories = [
    { valeur: 'general', libelle: 'General' },
    { valeur: 'grossesse', libelle: 'Grossesse' },
    { valeur: 'accouchement', libelle: 'Accouchement' },
    { valeur: 'post-partum', libelle: 'Post-partum' },
    { valeur: 'allaitement', libelle: 'Allaitement' },
    { valeur: 'bebe', libelle: 'Bebe et petite enfance' }
  ];

  const formaterDate = (chaineDate) => {
    return new Date(chaineDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (chargement) {
    return (
      <div className="page-communaute">
        <div className="conteneur">
          <div className="indicateur-chargement">
            <div className="animation-chargement"></div>
            <p>Chargement de la communaute...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-communaute">
      <div className="conteneur">
        <h1><i className="fa-solid fa-people-group"></i> Communaute</h1>
        <p className="sous-titre-page">
          Echangez avec d'autres parents et trouvez des reponses a vos questions
        </p>

        {/* Onglets */}
        <div className="onglets">
          <button
            className={`onglet ${ongletActif === 'faq' ? 'actif' : ''}`}
            onClick={() => setOngletActif('faq')}
          >
            <i className="fa-solid fa-circle-question"></i> Foire aux questions
          </button>
          <button
            className={`onglet ${ongletActif === 'forum' ? 'actif' : ''}`}
            onClick={() => setOngletActif('forum')}
          >
            <i className="fa-solid fa-comments"></i> Forum d'echange
          </button>
        </div>

        {/* Onglet FAQ */}
        {ongletActif === 'faq' && (
          <div className="contenu-onglet">
            {/* Formulaire de question */}
            {estConnecte && (
              <div className="carte formulaire-question">
                <h3><i className="fa-solid fa-plus-circle"></i> Poser une question</h3>
                <form onSubmit={soumettreQuestion}>
                  <div className="groupe-formulaire">
                    <textarea
                      rows="2"
                      value={nouvelleQuestion}
                      onChange={(evenement) => setNouvelleQuestion(evenement.target.value)}
                      placeholder="Quelle est votre question ?"
                      required
                    />
                  </div>
                  <button type="submit" className="bouton bouton-primaire">
                    <i className="fa-solid fa-paper-plane"></i> Envoyer
                  </button>
                </form>
              </div>
            )}

            {/* Liste des questions */}
            <div className="liste-questions">
              {questions.map((question) => (
                <div key={question.identifiant} className="carte element-question">
                  <button
                    className="en-tete-question"
                    onClick={() => setQuestionOuverteId(
                      questionOuverteId === question.identifiant ? null : question.identifiant
                    )}
                  >
                    <div className="icone-question">
                      <i className="fa-solid fa-circle-question"></i>
                    </div>
                    <div className="texte-question">
                      <h4>{question.question}</h4>
                      <span className="meta-question">
                        Par {question.auteur} - {formaterDate(question.date)}
                      </span>
                    </div>
                    <i className={`fa-solid ${questionOuverteId === question.identifiant ? 'fa-chevron-up' : 'fa-chevron-down'} chevron-question`}></i>
                  </button>
                  {questionOuverteId === question.identifiant && question.reponse && (
                    <div className="reponse-question">
                      <div className="icone-reponse">
                        <i className="fa-solid fa-comment-medical"></i>
                      </div>
                      <div className="texte-reponse">
                        <p>{question.reponse}</p>
                        {question.auteurReponse && (
                          <span className="auteur-reponse">
                            <i className="fa-solid fa-user-check"></i> {question.auteurReponse}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {questionOuverteId === question.identifiant && !question.reponse && (
                    <div className="reponse-question en-attente">
                      <i className="fa-solid fa-clock"></i>
                      <p>Cette question est en attente de reponse par un professionnel.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Forum */}
        {ongletActif === 'forum' && (
          <div className="contenu-onglet">
            {/* Formulaire nouveau sujet */}
            {estConnecte && (
              <div className="carte formulaire-sujet">
                <h3><i className="fa-solid fa-pen-fancy"></i> Publier un message</h3>
                <form onSubmit={soumettreMessageCommunautaire}>
                  <div className="grille-formulaire-sujet">
                    <div className="groupe-formulaire">
                      <label htmlFor="sujet-message">Sujet</label>
                      <input
                        type="text"
                        id="sujet-message"
                        value={nouveauSujet}
                        onChange={(evenement) => setNouveauSujet(evenement.target.value)}
                        placeholder="Le sujet de votre message"
                        required
                      />
                    </div>
                    <div className="groupe-formulaire">
                      <label htmlFor="categorie-message">Categorie</label>
                      <select
                        id="categorie-message"
                        value={nouvelleCategorie}
                        onChange={(evenement) => setNouvelleCategorie(evenement.target.value)}
                      >
                        {categories.map((categorie) => (
                          <option key={categorie.valeur} value={categorie.valeur}>
                            {categorie.libelle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="groupe-formulaire">
                    <label htmlFor="contenu-message">Message</label>
                    <textarea
                      id="contenu-message"
                      rows="3"
                      value={nouveauContenu}
                      onChange={(evenement) => setNouveauContenu(evenement.target.value)}
                      placeholder="Partagez votre experience ou posez une question a la communaute..."
                      required
                    />
                  </div>
                  <button type="submit" className="bouton bouton-primaire">
                    <i className="fa-solid fa-paper-plane"></i> Publier
                  </button>
                </form>
              </div>
            )}

            {/* Liste des messages */}
            <div className="liste-messages-communautaires">
              {messagesCommunautaires.map((message) => (
                <div key={message.identifiant} className="carte message-communautaire">
                  <div className="en-tete-message-communautaire">
                    <div className="avatar-auteur">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="info-auteur">
                      <span className="nom-auteur">{message.nomAuteur}</span>
                      <span className="date-message">{formaterDate(message.date)}</span>
                    </div>
                    <span className="badge badge-secondaire">{message.categorie}</span>
                  </div>
                  <h4 className="sujet-message">{message.sujet}</h4>
                  <p className="contenu-message-communautaire">{message.contenu}</p>

                  {/* Reponses */}
                  {message.reponses && message.reponses.length > 0 && (
                    <div className="liste-reponses">
                      {message.reponses.map((reponse, index) => (
                        <div key={index} className="reponse-communautaire">
                          <div className="avatar-auteur petit">
                            <i className="fa-solid fa-user"></i>
                          </div>
                          <div className="contenu-reponse">
                            <div className="en-tete-reponse">
                              <span className="nom-auteur">{reponse.nomAuteur}</span>
                              <span className="date-message">{formaterDate(reponse.date)}</span>
                            </div>
                            <p>{reponse.contenu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bouton repondre */}
                  {estConnecte && (
                    <div className="actions-message">
                      {reponseMessageId === message.identifiant ? (
                        <div className="formulaire-reponse-inline">
                          <input
                            type="text"
                            value={texteReponse}
                            onChange={(evenement) => setTexteReponse(evenement.target.value)}
                            placeholder="Votre reponse..."
                          />
                          <button
                            className="bouton bouton-primaire bouton-petit"
                            onClick={() => soumettreReponse(message.identifiant)}
                            disabled={!texteReponse.trim()}
                          >
                            <i className="fa-solid fa-paper-plane"></i>
                          </button>
                          <button
                            className="bouton bouton-secondaire bouton-petit"
                            onClick={() => { setReponseMessageId(null); setTexteReponse(''); }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          className="bouton bouton-secondaire bouton-petit"
                          onClick={() => setReponseMessageId(message.identifiant)}
                        >
                          <i className="fa-solid fa-reply"></i> Repondre
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageCommunaute;
