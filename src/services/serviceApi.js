/* ==========================================================================
   Coordinateur de Vie - Service local (sans serveur)
   Toute la logique precedemment executee cote serveur est desormais
   integree directement dans ce module. Les donnees sont stockees
   en memoire et les operations sont synchrones, enveloppees dans
   des Promises pour conserver la compatibilite avec le code existant.
   ========================================================================== */

import donneesLocales from "../donnees/donneesLocales";

/* --------------------------------------------------------------------------
   Fonction utilitaire pour enrichir un message avec noms et alias
   (replique exacte de la logique serveur)
   -------------------------------------------------------------------------- */
function enrichirMessage(m) {
  let nomExp = "";
  let nomDest = "";
  if (m.typeExpediteur === "patient") {
    const p = donneesLocales.patients.find(
      (p) => p.identifiant === m.identifiantExpediteur
    );
    nomExp = p ? p.nomComplet : "Patient inconnu";
  } else {
    const p = donneesLocales.professionnels.find(
      (p) => p.identifiant === m.identifiantExpediteur
    );
    nomExp = p ? p.nomComplet : "Professionnel inconnu";
  }
  if (m.typeDestinataire === "patient") {
    const p = donneesLocales.patients.find(
      (p) => p.identifiant === m.identifiantDestinataire
    );
    nomDest = p ? p.nomComplet : "Patient inconnu";
  } else {
    const p = donneesLocales.professionnels.find(
      (p) => p.identifiant === m.identifiantDestinataire
    );
    nomDest = p ? p.nomComplet : "Professionnel inconnu";
  }
  return {
    ...m,
    idExpediteur: m.identifiantExpediteur,
    idDestinataire: m.identifiantDestinataire,
    nomExpediteur: nomExp,
    nomDestinataire: nomDest,
    date: m.dateEnvoi,
  };
}

/* --------------------------------------------------------------------------
   Services d'authentification
   -------------------------------------------------------------------------- */
export const serviceAuthentification = {
  /* Inscription d'un nouvel utilisateur */
  inscription: async (donnees) => {
    const { nomComplet, courriel, motDePasse, typeProfil } = donnees;

    const compteExistantPatient = donneesLocales.patients.find(
      (patient) => patient.courriel === courriel
    );
    const compteExistantProfessionnel =
      donneesLocales.utilisateursProfessionnels.find(
        (professionnel) => professionnel.courriel === courriel
      );

    if (compteExistantPatient || compteExistantProfessionnel) {
      throw new Error("Un compte avec ce courriel existe deja.");
    }

    if (typeProfil === "patient") {
      const nouveauPatient = {
        identifiant: donneesLocales.patients.length + 1,
        nomComplet,
        courriel,
        motDePasse,
        typeProfil: "patient",
        dateDeNaissance: "",
        telephone: "",
        localisation: { ville: "", zone: "" },
        stadeGrossesse: "",
        semaines: null,
        typeGrossesse: null,
        besoins: [],
        projetNaissance: null,
        antecedents: [],
        suiviCycle: [],
        suiviGrossesse: [],
        suiviSanteMentale: [],
        suiviAllaitement: [],
        programmeRegimeAlimentaire: { objectif: "", recommandations: [] },
        fichesEnfants: [],
      };
      donneesLocales.patients.push(nouveauPatient);
      return {
        message: "Compte patient cree avec succes.",
        utilisateur: { ...nouveauPatient, motDePasse: undefined },
      };
    } else if (typeProfil === "professionnel") {
      const nouveauProfessionnel = {
        identifiant: donneesLocales.professionnels.length + 1,
        nomComplet,
        specialite: "",
        localisation: { ville: "", zone: "", adresse: "" },
        telephone: "",
        courriel,
        description: "",
        photoProfil: "",
        avis: [],
        disponibilites: [],
        motsCles: [],
      };
      donneesLocales.professionnels.push(nouveauProfessionnel);

      const nouveauComptePro = {
        identifiant:
          donneesLocales.utilisateursProfessionnels.length + 101,
        identifiantProfessionnel: nouveauProfessionnel.identifiant,
        courriel,
        motDePasse,
        typeProfil: "professionnel",
      };
      donneesLocales.utilisateursProfessionnels.push(nouveauComptePro);

      return {
        message: "Compte professionnel cree avec succes.",
        utilisateur: {
          ...nouveauComptePro,
          motDePasse: undefined,
          profil: nouveauProfessionnel,
        },
      };
    }

    throw new Error("Type de profil invalide.");
  },

  /* Connexion d'un utilisateur existant */
  connexion: async (donnees) => {
    const { courriel, motDePasse } = donnees;

    const patient = donneesLocales.patients.find(
      (p) => p.courriel === courriel && p.motDePasse === motDePasse
    );
    if (patient) {
      return {
        message: "Connexion reussie.",
        utilisateur: { ...patient, motDePasse: undefined },
      };
    }

    const professionnel = donneesLocales.utilisateursProfessionnels.find(
      (p) => p.courriel === courriel && p.motDePasse === motDePasse
    );
    if (professionnel) {
      const profilPro = donneesLocales.professionnels.find(
        (p) => p.identifiant === professionnel.identifiantProfessionnel
      );
      return {
        message: "Connexion reussie.",
        utilisateur: {
          ...professionnel,
          motDePasse: undefined,
          profil: profilPro,
        },
      };
    }

    throw new Error("Courriel ou mot de passe incorrect.");
  },
};

/* --------------------------------------------------------------------------
   Services de gestion de profil
   -------------------------------------------------------------------------- */
export const serviceProfil = {
  /* Recuperer le profil d'un utilisateur */
  recupererProfil: async (typeProfil, identifiant) => {
    const identifiantNumerique = parseInt(identifiant);

    if (typeProfil === "patient") {
      const patient = donneesLocales.patients.find(
        (p) => p.identifiant === identifiantNumerique
      );
      if (patient) return { ...patient, motDePasse: undefined };
    } else if (typeProfil === "professionnel") {
      const professionnel = donneesLocales.professionnels.find(
        (p) => p.identifiant === identifiantNumerique
      );
      if (professionnel) return professionnel;
    }

    throw new Error("Profil non trouve.");
  },

  /* Modifier le profil d'un patient */
  modifierProfilPatient: async (identifiant, donnees) => {
    const identifiantNumerique = parseInt(identifiant);
    const indexPatient = donneesLocales.patients.findIndex(
      (p) => p.identifiant === identifiantNumerique
    );

    if (indexPatient === -1) {
      throw new Error("Patient non trouve.");
    }

    donneesLocales.patients[indexPatient] = {
      ...donneesLocales.patients[indexPatient],
      ...donnees,
      identifiant: identifiantNumerique,
      motDePasse: donneesLocales.patients[indexPatient].motDePasse,
    };

    return {
      message: "Profil patient mis a jour avec succes.",
      utilisateur: {
        ...donneesLocales.patients[indexPatient],
        motDePasse: undefined,
      },
    };
  },

  /* Modifier le profil d'un professionnel */
  modifierProfilProfessionnel: async (identifiant, donnees) => {
    const identifiantNumerique = parseInt(identifiant);
    const indexProfessionnel = donneesLocales.professionnels.findIndex(
      (p) => p.identifiant === identifiantNumerique
    );

    if (indexProfessionnel === -1) {
      throw new Error("Professionnel non trouve.");
    }

    donneesLocales.professionnels[indexProfessionnel] = {
      ...donneesLocales.professionnels[indexProfessionnel],
      ...donnees,
      identifiant: identifiantNumerique,
    };

    return {
      message: "Profil professionnel mis a jour avec succes.",
      professionnel: donneesLocales.professionnels[indexProfessionnel],
    };
  },

  /* Supprimer un compte utilisateur */
  supprimerCompte: async (typeProfil, identifiant) => {
    const identifiantNumerique = parseInt(identifiant);

    if (typeProfil === "patient") {
      donneesLocales.patients = donneesLocales.patients.filter(
        (p) => p.identifiant !== identifiantNumerique
      );
      return { message: "Compte patient supprime avec succes." };
    } else if (typeProfil === "professionnel") {
      donneesLocales.professionnels = donneesLocales.professionnels.filter(
        (p) => p.identifiant !== identifiantNumerique
      );
      donneesLocales.utilisateursProfessionnels =
        donneesLocales.utilisateursProfessionnels.filter(
          (p) => p.identifiantProfessionnel !== identifiantNumerique
        );
      return { message: "Compte professionnel supprime avec succes." };
    }

    throw new Error("Type de profil invalide.");
  },
};

/* --------------------------------------------------------------------------
   Services pour les professionnels de sante
   -------------------------------------------------------------------------- */
export const serviceProfessionnels = {
  /* Recuperer la liste de tous les professionnels */
  recupererTous: async () => {
    return [...donneesLocales.professionnels];
  },

  /* Alias */
  listerTous: async () => {
    return [...donneesLocales.professionnels];
  },

  /* Recuperer un professionnel par son identifiant */
  recupererParIdentifiant: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);
    const professionnel = donneesLocales.professionnels.find(
      (p) => p.identifiant === identifiantNumerique
    );
    if (professionnel) return professionnel;
    throw new Error("Professionnel non trouve.");
  },

  /* Rechercher des professionnels avec des filtres */
  rechercher: async (filtres) => {
    let resultats = [...donneesLocales.professionnels];
    const { specialite, zone, motCle } = filtres;

    if (specialite) {
      resultats = resultats.filter((p) =>
        p.specialite.toLowerCase().includes(specialite.toLowerCase())
      );
    }
    if (zone) {
      resultats = resultats.filter((p) =>
        p.localisation.zone.toLowerCase().includes(zone.toLowerCase())
      );
    }
    if (motCle) {
      resultats = resultats.filter(
        (p) =>
          p.motsCles.some((mc) =>
            mc.toLowerCase().includes(motCle.toLowerCase())
          ) ||
          p.description.toLowerCase().includes(motCle.toLowerCase()) ||
          p.specialite.toLowerCase().includes(motCle.toLowerCase())
      );
    }

    return resultats;
  },

  /* Ajouter un avis sur un professionnel */
  ajouterAvis: async (identifiant, donnees) => {
    const identifiantNumerique = parseInt(identifiant);
    const professionnel = donneesLocales.professionnels.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!professionnel) {
      throw new Error("Professionnel non trouve.");
    }

    const nouvelAvis = {
      ...donnees,
      date: new Date().toISOString().split("T")[0],
    };
    professionnel.avis.push(nouvelAvis);
    return { message: "Avis ajoute avec succes.", avis: nouvelAvis };
  },
};

/* --------------------------------------------------------------------------
   Services pour les articles et contenus educatifs
   -------------------------------------------------------------------------- */
export const serviceArticles = {
  /* Recuperer tous les articles */
  recupererTous: async () => {
    return [...donneesLocales.articles];
  },

  /* Alias pour compatibilite */
  listerTous: async () => {
    return [...donneesLocales.articles];
  },

  /* Recuperer un article par son identifiant */
  recupererParIdentifiant: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);
    const article = donneesLocales.articles.find(
      (a) => a.identifiant === identifiantNumerique
    );
    if (article) return article;
    throw new Error("Article non trouve.");
  },

  /* Filtrer les articles par categorie */
  filtrerParCategorie: async (categorie) => {
    return donneesLocales.articles.filter(
      (a) => a.categorie === categorie
    );
  },
};

/* --------------------------------------------------------------------------
   Services pour la Foire Aux Questions
   -------------------------------------------------------------------------- */
export const serviceFoireAuxQuestions = {
  /* Recuperer toutes les questions (enrichies avec alias de date) */
  recupererToutes: async () => {
    return donneesLocales.foireAuxQuestions.map((q) => ({
      ...q,
      date: q.datePublication,
      auteurReponse: q.auteurReponse || null,
    }));
  },

  /* Ajouter une nouvelle question */
  ajouterQuestion: async (donnees) => {
    const nouvelleQuestion = {
      identifiant: donneesLocales.foireAuxQuestions.length + 1,
      ...donnees,
      datePublication: new Date().toISOString().split("T")[0],
    };
    donneesLocales.foireAuxQuestions.push(nouvelleQuestion);
    return nouvelleQuestion;
  },

  /* Alias */
  listerToutes: async () => {
    return donneesLocales.foireAuxQuestions.map((q) => ({
      ...q,
      date: q.datePublication,
      auteurReponse: q.auteurReponse || null,
    }));
  },

  poserQuestion: async (donnees) => {
    const nouvelleQuestion = {
      identifiant: donneesLocales.foireAuxQuestions.length + 1,
      ...donnees,
      datePublication: new Date().toISOString().split("T")[0],
    };
    donneesLocales.foireAuxQuestions.push(nouvelleQuestion);
    return nouvelleQuestion;
  },
};

/* --------------------------------------------------------------------------
   Services de messagerie
   -------------------------------------------------------------------------- */
export const serviceMessages = {
  /* Recuperer les messages d'un utilisateur */
  recupererMessages: async (typeUtilisateur, identifiant) => {
    const identifiantNumerique = parseInt(identifiant);

    const messagesUtilisateur = donneesLocales.messages.filter(
      (m) =>
        (m.identifiantExpediteur === identifiantNumerique &&
          m.typeExpediteur === typeUtilisateur) ||
        (m.identifiantDestinataire === identifiantNumerique &&
          m.typeDestinataire === typeUtilisateur)
    );

    return messagesUtilisateur;
  },

  /* Envoyer un nouveau message */
  envoyerMessage: async (donnees) => {
    const nouveauMessage = {
      identifiant: donneesLocales.messages.length + 1,
      ...donnees,
      dateEnvoi: new Date().toISOString(),
      lu: false,
    };
    donneesLocales.messages.push(nouveauMessage);
    return nouveauMessage;
  },

  /* Alias - route intelligente qui detecte le type d'utilisateur */
  listerTous: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);

    /* Verifier si c'est un compte professionnel */
    const utilisateurPro = donneesLocales.utilisateursProfessionnels.find(
      (p) => p.identifiant === identifiantNumerique
    );

    let messagesResultat;
    if (utilisateurPro) {
      const idPro = utilisateurPro.identifiantProfessionnel;
      messagesResultat = donneesLocales.messages.filter(
        (m) =>
          (m.identifiantExpediteur === idPro &&
            m.typeExpediteur === "professionnel") ||
          (m.identifiantDestinataire === idPro &&
            m.typeDestinataire === "professionnel")
      );
    } else {
      messagesResultat = donneesLocales.messages.filter(
        (m) =>
          (m.identifiantExpediteur === identifiantNumerique &&
            m.typeExpediteur === "patient") ||
          (m.identifiantDestinataire === identifiantNumerique &&
            m.typeDestinataire === "patient")
      );
    }

    return messagesResultat.map(enrichirMessage);
  },

  envoyer: async (donnees) => {
    const nouveauMessage = {
      identifiant: donneesLocales.messages.length + 1,
      identifiantExpediteur:
        donnees.idExpediteur || donnees.identifiantExpediteur,
      typeExpediteur: donnees.typeExpediteur || "patient",
      identifiantDestinataire:
        donnees.idDestinataire || donnees.identifiantDestinataire,
      typeDestinataire: donnees.typeDestinataire || "professionnel",
      contenu: donnees.contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
    };
    donneesLocales.messages.push(nouveauMessage);
    return enrichirMessage(nouveauMessage);
  },
};

/* --------------------------------------------------------------------------
   Services de messagerie communautaire
   -------------------------------------------------------------------------- */
export const serviceMessagesCommunautaires = {
  /* Recuperer tous les messages communautaires (enrichis) */
  recupererTous: async () => {
    return donneesLocales.messagesCommunautaires.map((m) => ({
      ...m,
      date: m.dateEnvoi,
      reponses: m.reponses.map((r) => ({ ...r, date: r.dateEnvoi })),
    }));
  },

  /* Publier un nouveau message communautaire */
  publierMessage: async (donnees) => {
    const nouveauMessage = {
      identifiant: donneesLocales.messagesCommunautaires.length + 1,
      ...donnees,
      dateEnvoi: new Date().toISOString(),
      reponses: [],
    };
    donneesLocales.messagesCommunautaires.push(nouveauMessage);
    return nouveauMessage;
  },

  /* Repondre a un message communautaire */
  repondre: async (identifiantMessage, donnees) => {
    const identifiantNumerique = parseInt(identifiantMessage);
    const messageExistant = donneesLocales.messagesCommunautaires.find(
      (m) => m.identifiant === identifiantNumerique
    );

    if (!messageExistant) {
      throw new Error("Message non trouve.");
    }

    const nouvelleReponse = {
      ...donnees,
      dateEnvoi: new Date().toISOString(),
    };
    messageExistant.reponses.push(nouvelleReponse);
    return messageExistant;
  },

  /* Alias */
  listerTous: async () => {
    return donneesLocales.messagesCommunautaires.map((m) => ({
      ...m,
      date: m.dateEnvoi,
      reponses: m.reponses.map((r) => ({ ...r, date: r.dateEnvoi })),
    }));
  },

  publier: async (donnees) => {
    const nouveauMessage = {
      identifiant: donneesLocales.messagesCommunautaires.length + 1,
      ...donnees,
      dateEnvoi: new Date().toISOString(),
      reponses: [],
    };
    donneesLocales.messagesCommunautaires.push(nouveauMessage);
    return nouveauMessage;
  },
};

/* --------------------------------------------------------------------------
   Services de rendez-vous
   -------------------------------------------------------------------------- */
export const serviceRendezVous = {
  /* Recuperer les rendez-vous d'un patient */
  recupererRendezVousPatient: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);
    const rendezVousPatient = donneesLocales.rendezVous.filter(
      (rdv) => rdv.identifiantPatient === identifiantNumerique
    );

    /* Enrichir les rendez-vous avec les informations des professionnels */
    return rendezVousPatient.map((rdv) => {
      const professionnel = donneesLocales.professionnels.find(
        (p) => p.identifiant === rdv.identifiantProfessionnel
      );
      return { ...rdv, professionnel };
    });
  },

  /* Recuperer les rendez-vous d'un professionnel */
  recupererRendezVousProfessionnel: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);
    const rendezVousProfessionnel = donneesLocales.rendezVous.filter(
      (rdv) => rdv.identifiantProfessionnel === identifiantNumerique
    );

    /* Enrichir les rendez-vous avec les informations des patients */
    return rendezVousProfessionnel.map((rdv) => {
      const patient = donneesLocales.patients.find(
        (p) => p.identifiant === rdv.identifiantPatient
      );
      return {
        ...rdv,
        nomPatient: patient ? patient.nomComplet : "Patient inconnu",
        patient: patient
          ? { nomComplet: patient.nomComplet, telephone: patient.telephone }
          : null,
      };
    });
  },

  /* Creer un nouveau rendez-vous */
  creerRendezVous: async (donnees) => {
    const nouveauRendezVous = {
      identifiant: donneesLocales.rendezVous.length + 1,
      identifiantPatient:
        donnees.identifiantPatient || donnees.idPatient,
      identifiantProfessionnel:
        donnees.identifiantProfessionnel || donnees.idProfessionnel,
      date: donnees.date,
      heure: donnees.heure,
      motif: donnees.motif,
      statut: "en_attente",
    };
    donneesLocales.rendezVous.push(nouveauRendezVous);
    return nouveauRendezVous;
  },

  /* Modifier le statut d'un rendez-vous */
  modifierRendezVous: async (identifiant, donnees) => {
    const identifiantNumerique = parseInt(identifiant);
    const indexRendezVous = donneesLocales.rendezVous.findIndex(
      (rdv) => rdv.identifiant === identifiantNumerique
    );

    if (indexRendezVous === -1) {
      throw new Error("Rendez-vous non trouve.");
    }

    donneesLocales.rendezVous[indexRendezVous] = {
      ...donneesLocales.rendezVous[indexRendezVous],
      ...donnees,
    };

    return {
      message: "Rendez-vous mis a jour.",
      rendezVous: donneesLocales.rendezVous[indexRendezVous],
    };
  },

  /* Alias */
  listerTous: async (identifiant) => {
    const identifiantNumerique = parseInt(identifiant);
    const rendezVousProfessionnel = donneesLocales.rendezVous.filter(
      (rdv) => rdv.identifiantProfessionnel === identifiantNumerique
    );

    return rendezVousProfessionnel.map((rdv) => {
      const patient = donneesLocales.patients.find(
        (p) => p.identifiant === rdv.identifiantPatient
      );
      return {
        ...rdv,
        nomPatient: patient ? patient.nomComplet : "Patient inconnu",
        patient: patient
          ? { nomComplet: patient.nomComplet, telephone: patient.telephone }
          : null,
      };
    });
  },

  mettreAJour: async (identifiant, donnees) => {
    const identifiantNumerique = parseInt(identifiant);
    const indexRendezVous = donneesLocales.rendezVous.findIndex(
      (rdv) => rdv.identifiant === identifiantNumerique
    );

    if (indexRendezVous === -1) {
      throw new Error("Rendez-vous non trouve.");
    }

    donneesLocales.rendezVous[indexRendezVous] = {
      ...donneesLocales.rendezVous[indexRendezVous],
      ...donnees,
    };

    return {
      message: "Rendez-vous mis a jour.",
      rendezVous: donneesLocales.rendezVous[indexRendezVous],
    };
  },

  creer: async (donnees) => {
    const nouveauRendezVous = {
      identifiant: donneesLocales.rendezVous.length + 1,
      identifiantPatient:
        donnees.identifiantPatient || donnees.idPatient,
      identifiantProfessionnel:
        donnees.identifiantProfessionnel || donnees.idProfessionnel,
      date: donnees.date,
      heure: donnees.heure,
      motif: donnees.motif,
      statut: "en_attente",
    };
    donneesLocales.rendezVous.push(nouveauRendezVous);
    return nouveauRendezVous;
  },
};

/* --------------------------------------------------------------------------
   Services de suivi patient
   -------------------------------------------------------------------------- */
export const serviceSuivi = {
  /* Ajouter une entree de suivi de grossesse */
  ajouterSuiviGrossesse: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    patient.suiviGrossesse.push(donnees);
    return {
      message: "Donnee de suivi de grossesse ajoutee.",
      suiviGrossesse: patient.suiviGrossesse,
    };
  },

  /* Ajouter une entree de suivi de sante mentale */
  ajouterSuiviSanteMentale: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    patient.suiviSanteMentale.push(donnees);
    return {
      message: "Donnee de suivi de sante mentale ajoutee.",
      suiviSanteMentale: patient.suiviSanteMentale,
    };
  },

  /* Ajouter une entree de suivi du cycle menstruel */
  ajouterSuiviCycle: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    patient.suiviCycle.push(donnees);
    return {
      message: "Donnee de suivi du cycle ajoutee.",
      suiviCycle: patient.suiviCycle,
    };
  },

  /* Ajouter une entree de suivi de l'allaitement */
  ajouterSuiviAllaitement: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    patient.suiviAllaitement.push(donnees);
    return {
      message: "Donnee de suivi de l'allaitement ajoutee.",
      suiviAllaitement: patient.suiviAllaitement,
    };
  },
};

/* --------------------------------------------------------------------------
   Services pour les fiches enfants
   -------------------------------------------------------------------------- */
export const serviceFichesEnfants = {
  /* Creer une fiche enfant */
  creerFicheEnfant: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    const nouvelleFiche = {
      identifiant: patient.fichesEnfants.length + 1,
      ...donnees,
      poids: [],
      alimentation: [],
      sommeil: [],
      apprentissages: [],
      maladies: [],
    };
    patient.fichesEnfants.push(nouvelleFiche);
    return { message: "Fiche enfant creee.", ficheEnfant: nouvelleFiche };
  },

  /* Alias pour compatibilite */
  creer: async (identifiantPatient, donnees) => {
    const identifiantNumerique = parseInt(identifiantPatient);
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === identifiantNumerique
    );

    if (!patient) throw new Error("Patient non trouve.");

    const nouvelleFiche = {
      identifiant: patient.fichesEnfants.length + 1,
      ...donnees,
      poids: [],
      alimentation: [],
      sommeil: [],
      apprentissages: [],
      maladies: [],
    };
    patient.fichesEnfants.push(nouvelleFiche);
    return { message: "Fiche enfant creee.", ficheEnfant: nouvelleFiche };
  },

  /* Ajouter une entree dans une fiche enfant */
  ajouterEntree: async (
    identifiantPatient,
    identifiantEnfant,
    typeEntree,
    donnees
  ) => {
    const patient = donneesLocales.patients.find(
      (p) => p.identifiant === parseInt(identifiantPatient)
    );
    if (!patient) throw new Error("Patient non trouve.");

    const ficheEnfant = patient.fichesEnfants.find(
      (f) => f.identifiant === parseInt(identifiantEnfant)
    );
    if (!ficheEnfant) throw new Error("Fiche enfant non trouvee.");

    const typesValides = [
      "poids",
      "alimentation",
      "sommeil",
      "apprentissages",
      "maladies",
    ];
    if (!typesValides.includes(typeEntree)) {
      throw new Error("Type d'entree invalide.");
    }

    ficheEnfant[typeEntree].push(donnees);
    return {
      message: "Entree ajoutee a la fiche enfant.",
      ficheEnfant,
    };
  },
};

/* --------------------------------------------------------------------------
   Service de recommandation (mise en relation intelligente)
   Replique exacte de l'algorithme de scoring du serveur.
   -------------------------------------------------------------------------- */
export const serviceRecommandation = {
  /* Obtenir des recommandations de professionnels basees sur un questionnaire */
  obtenirRecommandations: async (donnees) => {
    const { stadeGrossesse, besoins, zone, projetNaissance, antecedents } =
      donnees;

    let professionnelsRecommandes = [...donneesLocales.professionnels];
    let scores = new Map();

    /* Initialiser les scores a zero */
    professionnelsRecommandes.forEach((professionnel) => {
      scores.set(professionnel.identifiant, 0);
    });

    /* Critere 1 : Correspondance geographique (zone) */
    if (zone) {
      professionnelsRecommandes.forEach((professionnel) => {
        if (
          professionnel.localisation.zone.toLowerCase() ===
          zone.toLowerCase()
        ) {
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) + 30
          );
        }
      });
    }

    /* Critere 2 : Correspondance des besoins avec les mots-cles */
    if (besoins && besoins.length > 0) {
      const correspondanceBesoins = {
        suivi_medical: ["grossesse", "suivi", "perinatalite"],
        preparation_naissance: [
          "preparation naissance",
          "accompagnement",
          "naissance naturelle",
        ],
        nutrition: ["nutrition", "alimentation"],
        sante_mentale: [
          "psychologie",
          "sante mentale",
          "depression",
          "post-partum",
        ],
        post_partum: ["post-partum", "suivi post-natal"],
        allaitement: ["allaitement", "lactation"],
        fertilite: ["fertilite", "conception"],
        suivi_couple: ["couple", "soutien emotionnel"],
        pediatrie: [
          "pediatrie",
          "nourrisson",
          "petite enfance",
          "vaccination",
          "croissance",
        ],
        suivi_cycle: ["fertilite", "cycle"],
      };

      besoins.forEach((besoin) => {
        const motsClesAssocies = correspondanceBesoins[besoin] || [];
        professionnelsRecommandes.forEach((professionnel) => {
          const correspondances = professionnel.motsCles.filter(
            (motCle) =>
              motsClesAssocies.some((mc) =>
                motCle.toLowerCase().includes(mc.toLowerCase())
              )
          );
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) +
              correspondances.length * 20
          );
        });
      });
    }

    /* Critere 3 : Projet de naissance */
    if (projetNaissance === "naissance_naturelle") {
      professionnelsRecommandes.forEach((professionnel) => {
        if (
          professionnel.motsCles.includes("naissance naturelle") ||
          professionnel.motsCles.includes("accompagnement")
        ) {
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) + 15
          );
        }
      });
    }

    /* Critere 4 : Antecedents medicaux */
    if (antecedents && antecedents.includes("cesarienne")) {
      professionnelsRecommandes.forEach((professionnel) => {
        if (
          professionnel.specialite.toLowerCase().includes("sage-femme") ||
          professionnel.specialite.toLowerCase().includes("osteopathe")
        ) {
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) + 10
          );
        }
      });
    }

    /* Critere 5 : Stade de grossesse */
    if (stadeGrossesse === "desir_enfant") {
      professionnelsRecommandes.forEach((professionnel) => {
        if (
          professionnel.motsCles.some(
            (mc) =>
              mc.includes("fertilite") || mc.includes("preparation")
          )
        ) {
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) + 15
          );
        }
      });
    } else if (stadeGrossesse === "post_natal") {
      professionnelsRecommandes.forEach((professionnel) => {
        if (
          professionnel.motsCles.some(
            (mc) =>
              mc.includes("post-partum") ||
              mc.includes("nourrisson") ||
              mc.includes("allaitement") ||
              mc.includes("pediatrie")
          )
        ) {
          scores.set(
            professionnel.identifiant,
            scores.get(professionnel.identifiant) + 15
          );
        }
      });
    }

    /* Critere 6 : Note moyenne des avis */
    professionnelsRecommandes.forEach((professionnel) => {
      if (professionnel.avis.length > 0) {
        const noteMoyenne =
          professionnel.avis.reduce(
            (somme, avis) => somme + avis.note,
            0
          ) / professionnel.avis.length;
        scores.set(
          professionnel.identifiant,
          scores.get(professionnel.identifiant) + noteMoyenne * 2
        );
      }
    });

    /* Trier les professionnels par score decroissant */
    professionnelsRecommandes.sort(
      (a, b) =>
        scores.get(b.identifiant) - scores.get(a.identifiant)
    );

    /* Ajouter le score a chaque professionnel pour la transparence */
    const resultats = professionnelsRecommandes.map((professionnel) => ({
      ...professionnel,
      scoreRecommandation: scores.get(professionnel.identifiant),
    }));

    return {
      message: "Recommandations generees avec succes.",
      professionnelsRecommandes: resultats,
    };
  },
};
