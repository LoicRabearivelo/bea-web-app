/* ==========================================================================
   Coordinateur de Vie — Composant Chatbot « Béa »
   Chatbot périnatal flottant, visible uniquement pour les patients.
   Formulaire de qualification pré-chat + interface de messagerie.
   Persistance localStorage de l'historique et du profil.
   API : POST https://bea-chatbot.onrender.com/chat
   ========================================================================== */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { utiliserAuthentification } from "../contextes/ContexteAuthentification";
import "./ChatBea.css";

/* --------------------------------------------------------------------------
   Constantes
   -------------------------------------------------------------------------- */
const URL_API_CHAT = "https://bea-chatbot.onrender.com/chat";
const CLE_STOCKAGE_MESSAGES = "bea_historique_messages";
const CLE_STOCKAGE_PROFIL = "bea_profil_utilisatrice";

const STADES_PERINATAUX = [
  { valeur: "conception", libelle: "Projet de conception" },
  { valeur: "T1", libelle: "1er trimestre (T1)" },
  { valeur: "T2", libelle: "2e trimestre (T2)" },
  { valeur: "T3", libelle: "3e trimestre (T3)" },
  { valeur: "post-partum", libelle: "Post-partum" },
  { valeur: "allaitement", libelle: "Allaitement" },
];

const COMMUNES_REUNION = [
  "Saint-Denis",
  "Saint-Paul",
  "Saint-Pierre",
  "Le Tampon",
  "Saint-André",
  "Saint-Louis",
  "Le Port",
  "Saint-Benoît",
  "Saint-Joseph",
  "Sainte-Marie",
  "Sainte-Suzanne",
  "Saint-Leu",
  "La Possession",
  "L'Étang-Salé",
  "Petite-Île",
  "Bras-Panon",
  "Entre-Deux",
  "Les Avirons",
  "Trois-Bassins",
  "La Plaine-des-Palmistes",
  "Sainte-Rose",
  "Cilaos",
  "Salazie",
  "Saint-Philippe",
];

/* --------------------------------------------------------------------------
   Composant principal : ChatBea
   -------------------------------------------------------------------------- */
function ChatBea() {
  const { estConnecte, utilisateur } = utiliserAuthentification();

  /* ── État du composant ────────────────────────────────────────────────── */
  const [ouvert, definirOuvert] = useState(false);
  const [profil, definirProfil] = useState(null); // profil pré-chat
  const [messages, definirMessages] = useState([]);
  const [saisie, definirSaisie] = useState("");
  const [chargement, definirChargement] = useState(false);

  /* État du formulaire de qualification */
  const [formulaire, definirFormulaire] = useState({
    age: "",
    stade: "",
    localisation: "",
  });
  const [erreursFormulaire, definirErreursFormulaire] = useState({});

  const refMessages = useRef(null);
  const refSaisie = useRef(null);

  /* ── Filtrage : uniquement pour les patients connectés ─────────────── */
  const estPatient =
    estConnecte &&
    utilisateur &&
    utilisateur.typeProfil === "patient";

  /* ── Chargement depuis le localStorage au montage ──────────────────── */
  useEffect(() => {
    try {
      const profilStocke = localStorage.getItem(CLE_STOCKAGE_PROFIL);
      if (profilStocke) {
        definirProfil(JSON.parse(profilStocke));
      }

      const messagesStockes = localStorage.getItem(CLE_STOCKAGE_MESSAGES);
      if (messagesStockes) {
        definirMessages(JSON.parse(messagesStockes));
      }
    } catch {
      /* localStorage corrompu — on repart de zéro */
    }
  }, []);

  /* ── Sauvegarde automatique dans le localStorage ───────────────────── */
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CLE_STOCKAGE_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (profil) {
      localStorage.setItem(CLE_STOCKAGE_PROFIL, JSON.stringify(profil));
    }
  }, [profil]);

  /* ── Défilement automatique vers le bas ────────────────────────────── */
  useEffect(() => {
    if (refMessages.current) {
      refMessages.current.scrollTop = refMessages.current.scrollHeight;
    }
  }, [messages, chargement]);

  /* ── Focus sur le champ de saisie à l'ouverture ───────────────────── */
  useEffect(() => {
    if (ouvert && profil && refSaisie.current) {
      refSaisie.current.focus();
    }
  }, [ouvert, profil]);

  /* ── Validation du formulaire de qualification ─────────────────────── */
  const validerFormulaire = useCallback(() => {
    const erreurs = {};
    const ageNum = parseInt(formulaire.age, 10);

    if (!formulaire.age || isNaN(ageNum)) {
      erreurs.age = "L'âge est requis";
    } else if (ageNum < 14 || ageNum > 55) {
      erreurs.age = "L'âge doit être entre 14 et 55 ans";
    }

    if (!formulaire.stade) {
      erreurs.stade = "Le stade est requis";
    }

    if (!formulaire.localisation) {
      erreurs.localisation = "La commune est requise";
    }

    definirErreursFormulaire(erreurs);
    return Object.keys(erreurs).length === 0;
  }, [formulaire]);

  /* ── Soumission du formulaire de qualification ─────────────────────── */
  const soumettreFormulaire = (e) => {
    e.preventDefault();
    if (!validerFormulaire()) return;

    const nouveauProfil = {
      age: parseInt(formulaire.age, 10),
      stade: formulaire.stade,
      localisation: formulaire.localisation + ", 974",
    };

    definirProfil(nouveauProfil);

    /* Message d'accueil de Béa */
    const messageAccueil = {
      role: "bot",
      contenu:
        `Bonjour 🌺 ! Je suis **Béa**, ta coordinatrice de vie numérique. ` +
        `Je suis là pour t'accompagner et répondre à tes questions sur la grossesse, ` +
        `l'accouchement, le post-partum ou l'allaitement ici à La Réunion.\n\n` +
        `N'hésite pas à me poser ta question, je ferai de mon mieux pour t'orienter vers ` +
        `les bonnes ressources près de chez toi 💛`,
      horodatage: new Date().toISOString(),
    };

    definirMessages([messageAccueil]);
  };

  /* ── Envoi d'un message à l'API ────────────────────────────────────── */
  const envoyerMessage = async () => {
    const texte = saisie.trim();
    if (!texte || !profil || chargement) return;

    /* Ajout du message utilisateur */
    const messageUtilisateur = {
      role: "utilisateur",
      contenu: texte,
      horodatage: new Date().toISOString(),
    };

    definirMessages((prev) => [...prev, messageUtilisateur]);
    definirSaisie("");
    definirChargement(true);

    try {
      const reponse = await fetch(URL_API_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: profil.age,
          stade: profil.stade,
          localisation: profil.localisation,
          message: texte,
        }),
      });

      if (!reponse.ok) {
        throw new Error(`Erreur ${reponse.status}`);
      }

      const donnees = await reponse.json();

      const messageBot = {
        role: "bot",
        contenu: donnees.reponse || "Désolée, je n'ai pas pu traiter ta demande.",
        horodatage: new Date().toISOString(),
      };

      definirMessages((prev) => [...prev, messageBot]);
    } catch {
      const messageErreur = {
        role: "bot",
        contenu:
          "Oups, je rencontre un petit souci technique 😔. " +
          "Réessaie dans quelques instants. Si le problème persiste, " +
          "n'hésite pas à appeler le **REPERE au 0262 40 50 60**.",
        horodatage: new Date().toISOString(),
      };

      definirMessages((prev) => [...prev, messageErreur]);
    } finally {
      definirChargement(false);
    }
  };

  /* ── Gestion de la touche Entrée ───────────────────────────────────── */
  const gererToucheEntree = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  };

  /* ── Réinitialisation complète ─────────────────────────────────────── */
  const reinitialiser = () => {
    definirProfil(null);
    definirMessages([]);
    definirFormulaire({ age: "", stade: "", localisation: "" });
    definirErreursFormulaire({});
    localStorage.removeItem(CLE_STOCKAGE_PROFIL);
    localStorage.removeItem(CLE_STOCKAGE_MESSAGES);
  };

  /* ── Formatage simple du texte (gras en markdown) ──────────────────── */
  const formaterTexte = (texte) => {
    if (!texte) return "";
    /* Convertit **texte** en <strong>texte</strong> */
    return texte.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  /* ══════════════════════════════════════════════════════════════════════
     RENDU — Ne rien afficher si l'utilisateur n'est pas un patient
     ══════════════════════════════════════════════════════════════════════ */
  if (!estPatient) return null;

  /* ── Bouton flottant (chat fermé) ──────────────────────────────────── */
  if (!ouvert) {
    return (
      <button
        className="bea-bouton-flottant"
        onClick={() => definirOuvert(true)}
        aria-label="Ouvrir le chat avec Béa"
        title="Discuter avec Béa 🌺"
      >
        <i className="fa-solid fa-comment-dots"></i>
        {messages.length === 0 && <span className="bea-badge"></span>}
      </button>
    );
  }

  /* ── Fenêtre de chat ouverte ───────────────────────────────────────── */
  return (
    <div className="bea-fenetre" role="dialog" aria-label="Chat avec Béa">
      {/* En-tête */}
      <div className="bea-en-tete">
        <div className="bea-avatar">🌺</div>
        <div className="bea-infos-en-tete">
          <h4>Béa</h4>
          <span>Coordinatrice de vie · La Réunion</span>
        </div>
        {profil && (
          <button
            className="bea-bouton-reinit"
            onClick={reinitialiser}
            title="Nouvelle conversation"
            aria-label="Réinitialiser la conversation"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        )}
        <button
          className="bea-bouton-fermer"
          onClick={() => definirOuvert(false)}
          aria-label="Fermer le chat"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* ── Formulaire de qualification (pré-chat) ───────────────────── */}
      {!profil ? (
        <form className="bea-formulaire" onSubmit={soumettreFormulaire}>
          <div className="bea-formulaire-intro">
            <span className="bea-emoji">🤱</span>
            <p>
              Avant de commencer, j'ai besoin de quelques infos pour mieux
              t'accompagner.
            </p>
          </div>

          {/* Âge */}
          <div className="bea-groupe-champ">
            <label htmlFor="bea-age">
              <i className="fa-solid fa-cake-candles"></i> Ton âge
            </label>
            <input
              type="number"
              id="bea-age"
              className="bea-champ-saisie"
              placeholder="Ex : 28"
              min="14"
              max="55"
              value={formulaire.age}
              onChange={(e) =>
                definirFormulaire({ ...formulaire, age: e.target.value })
              }
            />
            {erreursFormulaire.age && (
              <span className="bea-erreur-champ">{erreursFormulaire.age}</span>
            )}
          </div>

          {/* Stade périnatal */}
          <div className="bea-groupe-champ">
            <label htmlFor="bea-stade">
              <i className="fa-solid fa-heart-pulse"></i> Ton stade
            </label>
            <select
              id="bea-stade"
              className="bea-champ-select"
              value={formulaire.stade}
              onChange={(e) =>
                definirFormulaire({ ...formulaire, stade: e.target.value })
              }
            >
              <option value="">— Choisis ton stade —</option>
              {STADES_PERINATAUX.map((s) => (
                <option key={s.valeur} value={s.valeur}>
                  {s.libelle}
                </option>
              ))}
            </select>
            {erreursFormulaire.stade && (
              <span className="bea-erreur-champ">
                {erreursFormulaire.stade}
              </span>
            )}
          </div>

          {/* Localisation */}
          <div className="bea-groupe-champ">
            <label htmlFor="bea-localisation">
              <i className="fa-solid fa-location-dot"></i> Ta commune
            </label>
            <select
              id="bea-localisation"
              className="bea-champ-select"
              value={formulaire.localisation}
              onChange={(e) =>
                definirFormulaire({
                  ...formulaire,
                  localisation: e.target.value,
                })
              }
            >
              <option value="">— Choisis ta commune —</option>
              {COMMUNES_REUNION.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {erreursFormulaire.localisation && (
              <span className="bea-erreur-champ">
                {erreursFormulaire.localisation}
              </span>
            )}
          </div>

          <button type="submit" className="bea-bouton-valider">
            <i className="fa-solid fa-paper-plane"></i>
            Commencer la discussion
          </button>
        </form>
      ) : (
        /* ── Interface de messagerie ─────────────────────────────────── */
        <>
          {/* Zone des messages */}
          <div className="bea-messages" ref={refMessages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`bea-bulle ${
                  msg.role === "bot"
                    ? "bea-bulle-bot"
                    : "bea-bulle-utilisateur"
                }`}
              >
                {msg.role === "bot" && (
                  <div className="bea-bulle-nom">
                    🌺 <span>Béa</span>
                  </div>
                )}
                <div>{formaterTexte(msg.contenu)}</div>
              </div>
            ))}

            {/* Indicateur de chargement */}
            {chargement && (
              <div className="bea-chargement">
                <div className="bea-chargement-points">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="bea-saisie">
            <input
              ref={refSaisie}
              type="text"
              placeholder="Écris ton message…"
              value={saisie}
              onChange={(e) => definirSaisie(e.target.value)}
              onKeyDown={gererToucheEntree}
              disabled={chargement}
              aria-label="Écrire un message à Béa"
            />
            <button
              className="bea-bouton-envoyer"
              onClick={envoyerMessage}
              disabled={!saisie.trim() || chargement}
              aria-label="Envoyer"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatBea;
