/* ==========================================================================
   Coordinateur de Vie - Donnees locales
   Toutes les donnees fictives precedemment servies par le serveur Express
   sont desormais integrees directement dans le client.
   ========================================================================== */

const donneesLocales = {
  /* --------------------------------------------------------------------------
     Professionnels de sante
     -------------------------------------------------------------------------- */
  professionnels: [
    {
      identifiant: 1,
      nomComplet: "Marie-Claire Hoarau",
      specialite: "Sage-femme liberale",
      localisation: {
        ville: "Cilaos",
        zone: "Hauts",
        adresse: "12 rue des Thermes, 97413 Cilaos",
        latitude: -21.1356,
        longitude: 55.4545,
      },
      telephone: "0262 31 00 00",
      courriel: "mc.hoarau@email.re",
      description:
        "Sage-femme diplomee avec 15 ans d'experience dans l'accompagnement des grossesses physiologiques et pathologiques. Specialisee dans la preparation a la naissance en milieu rural.",
      photoProfil: "https://randomuser.me/api/portraits/women/44.jpg",
      avis: [
        {
          identifiantPatient: 1,
          note: 5,
          commentaire:
            "Tres a l'ecoute et tres professionnelle. Elle m'a accompagnee tout au long de ma grossesse dans les Hauts.",
          date: "2025-11-15",
        },
        {
          identifiantPatient: 2,
          note: 5,
          commentaire:
            "Un accompagnement humain et bienveillant. Je la recommande vivement.",
          date: "2025-10-20",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["09:00", "10:00", "11:00", "14:00", "15:00"],
        },
        {
          date: "2026-02-26",
          creneaux: ["09:00", "10:30", "14:00", "16:00"],
        },
        {
          date: "2026-02-27",
          creneaux: ["08:30", "10:00", "11:30", "14:30"],
        },
      ],
      motsCles: [
        "grossesse",
        "preparation naissance",
        "suivi post-natal",
        "allaitement",
      ],
    },
    {
      identifiant: 2,
      nomComplet: "Jean-Philippe Payet",
      specialite: "Pediatre",
      localisation: {
        ville: "Saint-Denis",
        zone: "Nord",
        adresse: "45 boulevard du Chaudron, 97490 Saint-Denis",
        latitude: -20.8823,
        longitude: 55.4504,
      },
      telephone: "0262 21 00 00",
      courriel: "jp.payet@email.re",
      description:
        "Pediatre installe depuis 10 ans a Saint-Denis. Specialiste du suivi du nourrisson et du jeune enfant. Prise en charge des pathologies courantes de la petite enfance en milieu tropical.",
      photoProfil: "https://randomuser.me/api/portraits/men/32.jpg",
      avis: [
        {
          identifiantPatient: 1,
          note: 4,
          commentaire:
            "Tres competent et doux avec les enfants. Les delais d'attente sont parfois un peu longs.",
          date: "2025-12-01",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["08:00", "09:00", "10:00", "11:00"],
        },
        {
          date: "2026-02-26",
          creneaux: ["14:00", "15:00", "16:00"],
        },
      ],
      motsCles: [
        "pediatrie",
        "nourrisson",
        "vaccination",
        "croissance",
        "petite enfance",
      ],
    },
    {
      identifiant: 3,
      nomComplet: "Sophie Grondin",
      specialite: "Accompagnante a la naissance (Doula)",
      localisation: {
        ville: "Saint-Pierre",
        zone: "Sud",
        adresse: "8 rue Marius et Ary Leblond, 97410 Saint-Pierre",
        latitude: -21.3393,
        longitude: 55.478,
      },
      telephone: "0692 00 00 00",
      courriel: "s.grondin@email.re",
      description:
        "Accompagnante a la naissance certifiee. Je propose un soutien emotionnel et physique continu avant, pendant et apres l'accouchement. Approche respectueuse des traditions reunionnaises.",
      photoProfil: "https://randomuser.me/api/portraits/women/68.jpg",
      avis: [
        {
          identifiantPatient: 2,
          note: 5,
          commentaire:
            "Sophie a ete un ange gardien pendant toute ma grossesse. Son soutien a ete inestimable pour mon couple.",
          date: "2025-09-10",
        },
        {
          identifiantPatient: 3,
          note: 5,
          commentaire:
            "Grace a elle, j'ai vecu un accouchement serein et respecte.",
          date: "2025-08-22",
        },
        {
          identifiantPatient: 1,
          note: 4,
          commentaire:
            "Tres bienveillante et disponible. Elle connait bien les ressources locales du Sud.",
          date: "2025-11-05",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["10:00", "14:00", "16:00"],
        },
        {
          date: "2026-02-27",
          creneaux: ["09:00", "11:00", "15:00"],
        },
      ],
      motsCles: [
        "accompagnement",
        "naissance naturelle",
        "soutien emotionnel",
        "post-partum",
        "couple",
      ],
    },
    {
      identifiant: 4,
      nomComplet: "Nathalie Dijoux",
      specialite: "Consultante en lactation",
      localisation: {
        ville: "Le Tampon",
        zone: "Sud",
        adresse: "22 rue Hubert Delisle, 97430 Le Tampon",
        latitude: -21.2781,
        longitude: 55.5178,
      },
      telephone: "0693 00 00 00",
      courriel: "n.dijoux@email.re",
      description:
        "Consultante certifiee en lactation (IBCLC). Accompagnement personnalise pour l'allaitement maternel. Consultations a domicile disponibles dans tout le Sud de l'ile.",
      photoProfil: "https://randomuser.me/api/portraits/women/55.jpg",
      avis: [
        {
          identifiantPatient: 3,
          note: 5,
          commentaire:
            "Nathalie m'a sauvee quand j'etais prete a abandonner l'allaitement. Ses conseils sont precieux.",
          date: "2025-10-12",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["08:00", "10:00", "14:00"],
        },
        {
          date: "2026-02-26",
          creneaux: ["09:00", "11:00", "15:00", "17:00"],
        },
        {
          date: "2026-02-28",
          creneaux: ["08:00", "10:00", "14:00", "16:00"],
        },
      ],
      motsCles: ["allaitement", "lactation", "nourrisson", "post-partum"],
    },
    {
      identifiant: 5,
      nomComplet: "Frederic Riviere",
      specialite: "Osteopathe perinatal",
      localisation: {
        ville: "Saint-Paul",
        zone: "Ouest",
        adresse: "15 rue du General de Gaulle, 97460 Saint-Paul",
        latitude: -21.0098,
        longitude: 55.2701,
      },
      telephone: "0262 45 00 00",
      courriel: "f.riviere@email.re",
      description:
        "Osteopathe specialise en perinatalite. Prise en charge des douleurs liees a la grossesse, preparation du bassin pour l'accouchement et soins du nourrisson.",
      photoProfil: "https://randomuser.me/api/portraits/men/45.jpg",
      avis: [
        {
          identifiantPatient: 1,
          note: 4,
          commentaire:
            "Tres bon osteopathe. Les seances m'ont beaucoup soulagee pendant le troisieme trimestre.",
          date: "2025-11-28",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["09:00", "10:30", "14:00", "15:30"],
        },
        {
          date: "2026-02-26",
          creneaux: ["08:30", "10:00", "11:30"],
        },
      ],
      motsCles: [
        "osteopathie",
        "perinatalite",
        "douleurs grossesse",
        "nourrisson",
      ],
    },
    {
      identifiant: 6,
      nomComplet: "Aissatou Madi",
      specialite: "Psychologue perinatale",
      localisation: {
        ville: "Saint-Andre",
        zone: "Est",
        adresse: "30 rue de la Gare, 97440 Saint-Andre",
        latitude: -20.9631,
        longitude: 55.6548,
      },
      telephone: "0262 58 00 00",
      courriel: "a.madi@email.re",
      description:
        "Psychologue clinicienne specialisee en perinatalite. Accompagnement de la depression post-partum, du baby blues, du deuil perinatal et des difficultes du couple apres l'arrivee de l'enfant.",
      photoProfil: "https://randomuser.me/api/portraits/women/79.jpg",
      avis: [
        {
          identifiantPatient: 2,
          note: 5,
          commentaire:
            "Aissatou m'a aidee a traverser une periode tres difficile apres mon accouchement. Elle est formidable.",
          date: "2025-12-10",
        },
      ],
      disponibilites: [
        {
          date: "2026-02-25",
          creneaux: ["09:00", "10:00", "14:00", "15:00", "16:00"],
        },
        {
          date: "2026-02-26",
          creneaux: ["09:00", "11:00", "14:00"],
        },
        {
          date: "2026-02-27",
          creneaux: ["10:00", "14:00", "16:00"],
        },
      ],
      motsCles: [
        "psychologie",
        "sante mentale",
        "post-partum",
        "depression",
        "couple",
        "deuil",
      ],
    },
  ],

  /* --------------------------------------------------------------------------
     Patients
     -------------------------------------------------------------------------- */
  patients: [
    {
      identifiant: 1,
      nomComplet: "Camille Fontaine",
      courriel: "camille.fontaine@email.re",
      motDePasse: "motdepasse123",
      typeProfil: "patient",
      dateDeNaissance: "1992-06-15",
      telephone: "0693 11 22 33",
      localisation: { ville: "Cilaos", zone: "Hauts" },
      stadeGrossesse: "deuxieme_trimestre",
      semaines: 22,
      typeGrossesse: "premiere_grossesse",
      besoins: [
        "suivi_medical",
        "preparation_naissance",
        "nutrition",
        "sante_mentale",
      ],
      projetNaissance: "naissance_naturelle",
      antecedents: [],
      suiviCycle: [],
      suiviGrossesse: [
        {
          semaine: 20,
          poids: 62,
          tensionArterielle: "11/7",
          humeur: "bien",
          notes: "Echographie morphologique realisee. Tout est normal.",
        },
        {
          semaine: 22,
          poids: 63.5,
          tensionArterielle: "12/7",
          humeur: "fatiguee",
          notes: "Quelques douleurs ligamentaires. Rendez-vous osteopathe pris.",
        },
      ],
      suiviSanteMentale: [
        {
          date: "2026-02-10",
          score: 7,
          humeur: "sereine",
          notes: "Bonne semaine globalement. Un peu d'anxiete le soir.",
        },
      ],
      suiviAllaitement: [],
      programmeRegimeAlimentaire: {
        objectif:
          "Alimentation equilibree adaptee au deuxieme trimestre avec produits locaux",
        recommandations: [
          "Consommer des fruits tropicaux locaux riches en vitamines (mangues, papayes, goyaves)",
          "Privilegier les legumes peyi (bredes, chouchous, patates douces)",
          "Assurer un apport suffisant en fer avec du boudin creole bien cuit",
          "Boire au minimum un litre et demi d'eau par jour",
          "Eviter les preparations a base de rhum arrange et les charcuteries artisanales non pasteurisees",
        ],
      },
      fichesEnfants: [],
    },
    {
      identifiant: 2,
      nomComplet: "Laura et Thomas Riviere",
      courriel: "laura.riviere@email.re",
      motDePasse: "motdepasse456",
      typeProfil: "patient",
      dateDeNaissance: "1988-03-20",
      telephone: "0692 44 55 66",
      localisation: { ville: "Saint-Denis", zone: "Nord" },
      stadeGrossesse: "post_natal",
      semaines: null,
      typeGrossesse: "deuxieme_grossesse",
      besoins: [
        "post_partum",
        "allaitement",
        "sante_mentale",
        "suivi_couple",
        "pediatrie",
      ],
      projetNaissance: null,
      antecedents: ["cesarienne"],
      suiviCycle: [],
      suiviGrossesse: [],
      suiviSanteMentale: [
        {
          date: "2026-02-05",
          score: 4,
          humeur: "difficile",
          notes:
            "Fatigue intense. Difficultes a dormir meme quand le bebe dort. Sentiment d'isolement.",
        },
        {
          date: "2026-02-12",
          score: 5,
          humeur: "mitigee",
          notes:
            "Consultation avec la psychologue. Ca aide a mettre des mots sur ce que je ressens.",
        },
      ],
      suiviAllaitement: [
        {
          date: "2026-02-15",
          nombreTetees: 8,
          duree: "15 minutes en moyenne",
          difficultes: "Crevasses sein gauche",
          notes: "Rendez-vous avec consultante en lactation programme.",
        },
      ],
      programmeRegimeAlimentaire: {
        objectif:
          "Alimentation favorisant la recuperation post-natale et la production de lait",
        recommandations: [
          "Augmenter les apports en proteines (poisson, oeufs, legumineuses)",
          "Consommer des tisanes de fenouil pour stimuler la lactation",
          "Integrer des aliments riches en omega 3 (thon peche localement, sardines)",
          "Maintenir une hydratation optimale avec de l'eau et des jus de fruits frais locaux",
        ],
      },
      fichesEnfants: [
        {
          identifiant: 1,
          prenom: "Jade",
          dateDeNaissance: "2026-01-20",
          poids: [
            { date: "2026-01-20", valeur: 3.2, unite: "kilogrammes" },
            { date: "2026-02-01", valeur: 3.5, unite: "kilogrammes" },
            { date: "2026-02-15", valeur: 4.1, unite: "kilogrammes" },
          ],
          alimentation: [
            {
              date: "2026-02-15",
              type: "allaitement_maternel",
              notes: "Allaitement exclusif. Bonne prise de poids.",
            },
          ],
          sommeil: [
            {
              date: "2026-02-15",
              heuresParNuit: 4,
              siestes: 5,
              notes: "Se reveille toutes les deux a trois heures la nuit.",
            },
          ],
          apprentissages: [
            {
              date: "2026-02-10",
              description: "Premier sourire reponse.",
            },
          ],
          maladies: [],
        },
      ],
    },
    {
      identifiant: 3,
      nomComplet: "Anais Boyer",
      courriel: "anais.boyer@email.re",
      motDePasse: "motdepasse789",
      typeProfil: "patient",
      dateDeNaissance: "1995-09-08",
      telephone: "0693 77 88 99",
      localisation: { ville: "Saint-Pierre", zone: "Sud" },
      stadeGrossesse: "desir_enfant",
      semaines: null,
      typeGrossesse: null,
      besoins: ["fertilite", "preparation", "nutrition", "suivi_cycle"],
      projetNaissance: null,
      antecedents: [],
      suiviCycle: [
        {
          mois: "2026-01",
          duree: 28,
          dateDebut: "2026-01-05",
          dateFin: "2026-01-10",
          ovulation: "2026-01-19",
          symptomes: ["fatigue", "douleurs abdominales"],
        },
        {
          mois: "2026-02",
          duree: 29,
          dateDebut: "2026-02-02",
          dateFin: "2026-02-07",
          ovulation: "2026-02-17",
          symptomes: ["sensibilite poitrine"],
        },
      ],
      suiviGrossesse: [],
      suiviSanteMentale: [
        {
          date: "2026-02-01",
          score: 6,
          humeur: "anxieuse",
          notes:
            "Stress lie a l'attente. Envie de tomber enceinte depuis plusieurs mois.",
        },
      ],
      suiviAllaitement: [],
      programmeRegimeAlimentaire: {
        objectif:
          "Preparation nutritionnelle a la conception avec des aliments locaux",
        recommandations: [
          "Prendre de l'acide folique quotidiennement (complement alimentaire)",
          "Consommer des legumes verts locaux (bredes mafane, bredes chou)",
          "Privilegier les fruits riches en antioxydants (letchis, fruits de la passion)",
          "Reduire la consommation de cafe a une tasse par jour",
          "Integrer des sources de zinc (fruits de mer, graines de courge)",
        ],
      },
      fichesEnfants: [],
    },
  ],

  /* --------------------------------------------------------------------------
     Comptes professionnels (credentials)
     -------------------------------------------------------------------------- */
  utilisateursProfessionnels: [
    {
      identifiant: 101,
      identifiantProfessionnel: 1,
      courriel: "mc.hoarau@email.re",
      motDePasse: "prosecret123",
      typeProfil: "professionnel",
    },
    {
      identifiant: 102,
      identifiantProfessionnel: 2,
      courriel: "jp.payet@email.re",
      motDePasse: "prosecret456",
      typeProfil: "professionnel",
    },
    {
      identifiant: 103,
      identifiantProfessionnel: 3,
      courriel: "s.grondin@email.re",
      motDePasse: "prosecret789",
      typeProfil: "professionnel",
    },
  ],

  /* --------------------------------------------------------------------------
     Articles et contenus educatifs
     -------------------------------------------------------------------------- */
  articles: [
    {
      identifiant: 1,
      titre: "Les demarches aupres de la Caisse d'Allocations Familiales a La Reunion",
      categorie: "demarches_administratives",
      contenu:
        "A La Reunion, la Caisse d'Allocations Familiales accompagne les familles a chaque etape. Des la declaration de grossesse, vous pouvez beneficier de la prime a la naissance sous conditions de ressources. La declaration doit etre faite avant la fin de la quatorzieme semaine de grossesse. La CAF de La Reunion propose egalement un accompagnement specifique pour les familles en situation de precarite. N'hesitez pas a vous rendre dans l'antenne la plus proche de chez vous pour un rdv personnalise. Les documents necessaires sont : votre declaration de grossesse remplie par votre medecin ou sage-femme, vos justificatifs de revenus et votre piece d'identite.",
      auteur: "Equipe Coordinateur de Vie",
      datePublication: "2026-01-10",
      etiquettes: ["CAF", "allocations", "demarches", "grossesse", "La Reunion"],
      imageCouverture: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    },
    {
      identifiant: 2,
      titre: "Bien manger pendant la grossesse avec les produits de La Reunion",
      categorie: "nutrition",
      contenu:
        "La Reunion regorge de fruits et legumes tropicaux excellents pour la sante de la femme enceinte. Les mangues sont riches en vitamine A et en fibres. Les papayes (consommees bien mures) apportent de la vitamine C. Les bredes, ces legumes verts traditionnels, sont une source precieuse de fer et d'acide folique essentiels pendant la grossesse. Le chouchou, omnipresent dans la cuisine reunionnaise, est pauvre en calories et riche en eau, parfait pour l'hydratation. Attention cependant aux preparations traditionnelles a base d'alcool et aux poissons predateurs (espadon, requin) qui peuvent contenir du mercure.",
      auteur: "Docteur Payet, Pediatre",
      datePublication: "2026-01-20",
      etiquettes: [
        "nutrition",
        "grossesse",
        "alimentation",
        "produits locaux",
        "La Reunion",
      ],
      imageCouverture: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400",
    },
    {
      identifiant: 3,
      titre: "Le post-partum : comprendre et traverser cette periode",
      categorie: "sante_mentale",
      contenu:
        "Le post-partum est une periode de grandes transformations physiques et emotionnelles. A La Reunion, la solidarite familiale est souvent un pilier important, mais toutes les femmes n'en beneficient pas de la meme maniere. Il est normal de ressentir de la fatigue, des sautes d'humeur ou un sentiment de decalage. Le baby blues, qui touche environ soixante a quatre-vingts pour cent des femmes, survient dans les jours suivant l'accouchement et se resout generalement en quelques semaines. Si les symptomes persistent au-dela de deux semaines (tristesse profonde, perte d'interet, difficultes a creer un lien avec le bebe), il peut s'agir d'une depression post-partum qui necessite un accompagnement professionnel. N'hesitez pas a en parler a votre sage-femme ou a votre medecin.",
      auteur: "Aissatou Madi, Psychologue perinatale",
      datePublication: "2026-02-01",
      etiquettes: [
        "post-partum",
        "sante mentale",
        "depression",
        "baby blues",
        "accompagnement",
      ],
      imageCouverture: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=400",
    },
    {
      identifiant: 4,
      titre: "L'allaitement maternel : conseils pratiques pour bien demarrer",
      categorie: "allaitement",
      contenu:
        "L'allaitement maternel est recommande par l'Organisation Mondiale de la Sante de maniere exclusive pendant les six premiers mois. A La Reunion, le taux d'allaitement a la maternite est eleve mais chute rapidement dans les semaines qui suivent. Les principales difficultes rencontrees sont les crevasses, les engorgements et le sentiment de ne pas produire assez de lait. Une consultante en lactation peut vous aider a surmonter ces obstacles. La mise au sein precoce, dans l'heure suivant la naissance, favorise un bon demarrage. La position du bebe est essentielle : son ventre doit etre contre le votre, sa bouche doit prendre une grande partie de l'areole et non uniquement le mamelon.",
      auteur: "Nathalie Dijoux, Consultante en lactation",
      datePublication: "2026-02-10",
      etiquettes: ["allaitement", "lait maternel", "nourrisson", "conseils pratiques"],
      imageCouverture: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400",
    },
    {
      identifiant: 5,
      titre: "La Securite Sociale et le parcours de grossesse : vos droits",
      categorie: "demarches_administratives",
      contenu:
        "La Securite Sociale prend en charge a cent pour cent les examens obligatoires de suivi de grossesse a partir du sixieme mois. Avant cela, la prise en charge s'effectue selon le tarif de convention. Les sept examens prenataux obligatoires, les trois echographies recommandees et la seance de preparation a la naissance sont couverts. A La Reunion, certaines consultations supplementaires peuvent etre proposees en raison de specificites epidemiologiques locales (depistage du diabete gestationnel plus precoce en raison des facteurs de risque plus eleves sur l'ile). Pensez a mettre a jour votre carte vitale et a transmettre votre declaration de grossesse dans les delais impartis.",
      auteur: "Equipe Coordinateur de Vie",
      datePublication: "2026-02-15",
      etiquettes: [
        "securite sociale",
        "droits",
        "prise en charge",
        "grossesse",
        "La Reunion",
      ],
      imageCouverture: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
    },
    {
      identifiant: 6,
      titre: "Preparer l'arrivee de bebe : la checklist reunionnaise",
      categorie: "preparation",
      contenu:
        "Preparer l'arrivee de votre bebe a La Reunion necessite de prendre en compte le climat tropical. Privilegiez des vetements legers en coton, une moustiquaire pour le lit et un ventilateur adapte. Pour le trousseau de naissance, l'essentiel comprend : des bodies manches courtes, des grenouilleres legeres, des chapeaux de soleil, une creme solaire haute protection adaptee aux nourrissons, un porte-bebe physiologique adapte a la chaleur. Cote administratif, preparez votre dossier de maternite, inscrivez-vous a la maternite de votre choix des le quatrieme mois et renseignez-vous sur les services de Protection Maternelle et Infantile de votre commune.",
      auteur: "Marie-Claire Hoarau, Sage-femme",
      datePublication: "2026-02-18",
      etiquettes: ["preparation", "naissance", "equipement", "La Reunion", "climat tropical"],
      imageCouverture: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400",
    },
  ],

  /* --------------------------------------------------------------------------
     Foire Aux Questions
     -------------------------------------------------------------------------- */
  foireAuxQuestions: [
    {
      identifiant: 1,
      question:
        "Ou puis-je trouver une sage-femme liberale dans les Hauts de La Reunion ?",
      reponse:
        "Plusieurs sage-femmes exercent dans les Hauts (Cilaos, Salazie, Plaine des Palmistes). Utilisez notre annuaire augmente avec la geolocalisation pour trouver celle qui est la plus proche de votre domicile. Marie-Claire Hoarau exerce notamment a Cilaos.",
      auteur: "Equipe Coordinateur de Vie",
      datePublication: "2026-01-15",
      categorie: "professionnels",
    },
    {
      identifiant: 2,
      question:
        "Quelles sont les aides financieres disponibles pour les jeunes parents a La Reunion ?",
      reponse:
        "A La Reunion, les jeunes parents peuvent beneficier de la prime a la naissance versee par la CAF (sous conditions de ressources), de l'allocation de base de la Prestation d'Accueil du Jeune Enfant, du complement de libre choix du mode de garde, et de l'allocation de soutien familial pour les parents isoles. Le Conseil Departemental propose egalement des aides specifiques. Rendez-vous sur le site de la CAF de La Reunion ou consultez notre section demarches administratives.",
      auteur: "Equipe Coordinateur de Vie",
      datePublication: "2026-01-20",
      categorie: "aides_financieres",
    },
    {
      identifiant: 3,
      question: "Comment savoir si mon bebe prend suffisamment de poids ?",
      reponse:
        "La prise de poids du nourrisson est surveillee lors des consultations regulieres avec votre pediatre ou votre medecin traitant. En moyenne, un nouveau-ne prend environ vingt-cinq a trente grammes par jour pendant les trois premiers mois. La courbe de poids dans le carnet de sante est l'outil de reference. Si vous avez des inquietudes entre deux consultations, n'hesitez pas a utiliser notre messagerie pour contacter votre professionnel de sante referent.",
      auteur: "Jean-Philippe Payet, Pediatre",
      datePublication: "2026-02-01",
      categorie: "sante_bebe",
    },
    {
      identifiant: 4,
      question:
        "Je me sens tres triste depuis mon accouchement, est-ce normal ?",
      reponse:
        "Les changements emotionnels apres l'accouchement sont tres frequents. Le baby blues touche la majorite des femmes et se manifeste par de la tristesse, de l'irritabilite et des pleurs dans les jours suivant la naissance. Il se resout generalement naturellement. Cependant, si ces sentiments persistent au-dela de deux semaines ou s'intensifient, il est important de consulter un professionnel. La depression post-partum est une condition medicale qui se traite tres bien avec un accompagnement adapte. Vous n'etes pas seule. Contactez Aissatou Madi, psychologue perinatale, via notre plateforme ou appelez le 3114 (numero national de prevention du suicide).",
      auteur: "Aissatou Madi, Psychologue perinatale",
      datePublication: "2026-02-05",
      categorie: "sante_mentale",
    },
    {
      identifiant: 5,
      question: "Puis-je manger du rougail saucisse pendant ma grossesse ?",
      reponse:
        "Le rougail saucisse est un plat emblematique de La Reunion. Pendant la grossesse, il convient d'etre vigilante sur la cuisson de la viande. Les saucisses doivent etre bien cuites a coeur (pas de saignant). Evitez les saucisses artisanales dont vous n'etes pas sure de la qualite sanitaire. Le piment peut provoquer des brulures d'estomac, frequentes pendant la grossesse. Si vous le tolerez bien, un rougail modere en piment avec des saucisses bien cuites reste tout a fait acceptable dans le cadre d'une alimentation equilibree.",
      auteur: "Equipe Coordinateur de Vie",
      datePublication: "2026-02-10",
      categorie: "nutrition",
    },
    {
      identifiant: 6,
      question: "A partir de quel mois peut-on faire de la preparation a la naissance ?",
      reponse:
        "La preparation a la naissance peut commencer des le quatrieme mois de grossesse. Elle est prise en charge a cent pour cent par l'Assurance Maladie a partir du septieme mois. Huit seances sont remboursees en totalite. A La Reunion, plusieurs methodes sont proposees : preparation classique, sophrologie, yoga prenatal, preparation en piscine, haptonomie. Choisissez celle qui vous correspond le mieux et n'hesitez pas a en discuter avec votre sage-femme.",
      auteur: "Marie-Claire Hoarau, Sage-femme",
      auteurReponse: "Marie-Claire Hoarau, Sage-femme",
      datePublication: "2026-02-12",
      categorie: "grossesse",
    },
    {
      identifiant: 7,
      question: "Comment bien choisir sa maternite a La Reunion ?",
      reponse:
        "La Reunion dispose de plusieurs maternites reparties sur l'ile : le CHU Nord et la clinique Sainte-Clotilde dans le Nord, le CHU Sud au Tampon, le GHER a Saint-Benoit dans l'Est. Le choix depend de votre lieu de residence, de votre suivi de grossesse (grossesse a risque ou non) et de vos preferences personnelles. Il est conseille de visiter les maternites et de discuter avec votre sage-femme ou gynecologue pour faire le meilleur choix. Pensez a vous preinscrire des le sixieme mois.",
      auteur: "Equipe Coordinateur de Vie",
      auteurReponse: "Equipe Coordinateur de Vie",
      datePublication: "2026-02-14",
      categorie: "grossesse",
    },
    {
      identifiant: 8,
      question: "Quels vaccins sont recommandes pour mon bebe a La Reunion ?",
      reponse:
        "Le calendrier vaccinal a La Reunion suit les recommandations nationales avec quelques specificites tropicales. Les vaccins obligatoires comprennent : DTP (diphterie, tetanos, polio), coqueluche, Haemophilus influenzae, hepatite B, pneumocoque, meningocoque C, ROR (rougeole, oreillons, rubeole). A La Reunion, il est egalement recommande de vacciner contre l'hepatite A en raison du contexte epidemiologique local. Votre pediatre etablira un calendrier adapte des la premiere consultation.",
      auteur: "Jean-Philippe Payet, Pediatre",
      auteurReponse: "Jean-Philippe Payet, Pediatre",
      datePublication: "2026-02-16",
      categorie: "sante_bebe",
    },
    {
      identifiant: 9,
      question: "L'osteopathie est-elle recommandee pendant la grossesse ?",
      reponse:
        "L'osteopathie peut etre benefique pendant la grossesse pour soulager les douleurs lombaires, les sciatiques, les troubles digestifs et les tensions liees aux modifications posturales. Les techniques utilisees sont douces et adaptees a chaque trimestre. Il est important de consulter un osteopathe forme a la prise en charge des femmes enceintes. Les seances ne sont pas remboursees par l'Assurance Maladie mais certaines mutuelles proposent un forfait.",
      auteur: "Romain Fontaine, Osteopathe",
      auteurReponse: "Romain Fontaine, Osteopathe",
      datePublication: "2026-02-18",
      categorie: "grossesse",
    },
    {
      identifiant: 10,
      question: "Comment gerer l'anxiete liee au desir d'enfant ?",
      reponse:
        "L'anxiete liee au desir d'enfant est tres frequente et peut affecter la qualite de vie et paradoxalement la fertilite. Quelques pistes : ne restez pas seule avec vos emotions, parlez-en a votre partenaire et a un professionnel de sante mentale. La sophrologie, la meditation et l'activite physique moderee peuvent aider. Un accompagnement par un psychologue specialise en perinatalite peut faire une reelle difference. N'hesitez pas a consulter une doula qui pourra vous accompagner dans cette attente.",
      auteur: "Aissatou Madi, Psychologue perinatale",
      auteurReponse: "Aissatou Madi, Psychologue perinatale",
      datePublication: "2026-02-20",
      categorie: "sante_mentale",
    },
    {
      identifiant: 11,
      question: "Quels sont les signes d'alerte pendant la grossesse qui necessitent une consultation urgente ?",
      reponse: null,
      auteur: "Camille F.",
      datePublication: "2026-02-22",
      categorie: "grossesse",
    },
    {
      identifiant: 12,
      question: "Existe-t-il des associations de parents a La Reunion pour les naissances prematurees ?",
      reponse: null,
      auteur: "Laura R.",
      datePublication: "2026-02-23",
      categorie: "sante_bebe",
    },
  ],

  /* --------------------------------------------------------------------------
     Messages (messagerie entre parents et professionnels)
     -------------------------------------------------------------------------- */
  messages: [
    {
      identifiant: 1,
      identifiantExpediteur: 1,
      typeExpediteur: "patient",
      identifiantDestinataire: 1,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Hoarau, j'aimerais savoir si vous proposez des seances de preparation a la naissance en piscine ?",
      dateEnvoi: "2026-02-20T10:30:00",
      lu: true,
    },
    {
      identifiant: 2,
      identifiantExpediteur: 1,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 1,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Camille, oui je propose des seances en piscine a la piscine municipale de Cilaos le mercredi matin. Souhaitez-vous vous inscrire ?",
      dateEnvoi: "2026-02-20T14:15:00",
      lu: true,
    },
    {
      identifiant: 3,
      identifiantExpediteur: 2,
      typeExpediteur: "patient",
      identifiantDestinataire: 6,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Madi, je ne me sens pas bien depuis l'accouchement. Mon mari s'inquiete aussi. Peut-on prendre rendez-vous rapidement ?",
      dateEnvoi: "2026-02-19T08:45:00",
      lu: true,
    },
    {
      identifiant: 4,
      identifiantExpediteur: 6,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 2,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Laura, je comprends votre situation et je suis la pour vous aider. J'ai un creneau disponible demain a quinze heures. Est-ce que cela vous convient ? N'hesitez pas a appeler directement si vous en ressentez le besoin.",
      dateEnvoi: "2026-02-19T09:30:00",
      lu: false,
    },
    {
      identifiant: 5,
      identifiantExpediteur: 1,
      typeExpediteur: "patient",
      identifiantDestinataire: 3,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Sophie, on m'a recommandee de vous contacter pour un accompagnement relaxation pendant ma grossesse. Proposez-vous des seances a Cilaos ?",
      dateEnvoi: "2026-02-21T09:00:00",
      lu: true,
    },
    {
      identifiant: 6,
      identifiantExpediteur: 3,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 1,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Camille ! Oui, je me deplace regulierement dans les Hauts. Je propose des seances de sophrologie prenatale et de yoga adapte. On peut planifier une premiere rencontre la semaine prochaine si vous le souhaitez.",
      dateEnvoi: "2026-02-21T11:00:00",
      lu: true,
    },
    {
      identifiant: 7,
      identifiantExpediteur: 1,
      typeExpediteur: "patient",
      identifiantDestinataire: 3,
      typeDestinataire: "professionnel",
      contenu:
        "Ce serait parfait ! Lundi prochain en fin de matinee, ca vous irait ?",
      dateEnvoi: "2026-02-21T14:30:00",
      lu: false,
    },
    {
      identifiant: 8,
      identifiantExpediteur: 3,
      typeExpediteur: "patient",
      identifiantDestinataire: 3,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Grondin, je suis en parcours de fertilite et j'ai besoin d'un accompagnement. On m'a dit que vous etiez specialisee dans ce domaine ?",
      dateEnvoi: "2026-02-20T16:00:00",
      lu: true,
    },
    {
      identifiant: 9,
      identifiantExpediteur: 3,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 3,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Anais, oui j'accompagne les femmes et les couples dans leur parcours de conception. C'est un chemin qui peut etre eprouvant et il est important de se sentir soutenue. Je vous propose une premiere consultation a mon cabinet de Saint-Paul, ou je peux me deplacer a Saint-Pierre.",
      dateEnvoi: "2026-02-20T17:30:00",
      lu: false,
    },
    {
      identifiant: 10,
      identifiantExpediteur: 2,
      typeExpediteur: "patient",
      identifiantDestinataire: 4,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Dijoux, j'ai des crevasses tres douloureuses depuis le debut de l'allaitement. Mon bebe a deux semaines. J'ai essaye la lanoline mais ca ne s'ameliore pas.",
      dateEnvoi: "2026-02-22T08:00:00",
      lu: true,
    },
    {
      identifiant: 11,
      identifiantExpediteur: 4,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 2,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Laura, les crevasses sont souvent liees a la position du bebe au sein. Je vous propose une consultation a domicile pour observer une tetee et corriger la prise du sein si necessaire. En attendant, appliquez du lait maternel en fin de tetee et laissez secher a l'air libre.",
      dateEnvoi: "2026-02-22T10:00:00",
      lu: true,
    },
    {
      identifiant: 12,
      identifiantExpediteur: 2,
      typeExpediteur: "patient",
      identifiantDestinataire: 4,
      typeDestinataire: "professionnel",
      contenu:
        "Merci beaucoup pour vos conseils. Quand seriez-vous disponible pour passer ? Le matin serait ideal car bebe est plus calme.",
      dateEnvoi: "2026-02-22T14:00:00",
      lu: false,
    },
    {
      identifiant: 13,
      identifiantExpediteur: 1,
      typeExpediteur: "patient",
      identifiantDestinataire: 5,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Docteur Fontaine, j'ai des douleurs ligamentaires assez fortes depuis quelques jours. Je suis enceinte de 22 semaines. Est-ce que l'osteopathie peut m'aider ?",
      dateEnvoi: "2026-02-23T09:00:00",
      lu: true,
    },
    {
      identifiant: 14,
      identifiantExpediteur: 5,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 1,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Camille, les douleurs ligamentaires sont tres frequentes au deuxieme trimestre. L'osteopathie peut effectivement soulager ces tensions. Je vous propose un rendez-vous jeudi matin a mon cabinet du Tampon. Les techniques utilisees sont douces et parfaitement adaptees a la grossesse.",
      dateEnvoi: "2026-02-23T10:30:00",
      lu: false,
    },
    {
      identifiant: 15,
      identifiantExpediteur: 2,
      typeExpediteur: "patient",
      identifiantDestinataire: 2,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Docteur Payet, mon bebe a de petits boutons sur le visage depuis hier. Il n'a pas de fievre et mange normalement. Est-ce que je dois m'inquieter ?",
      dateEnvoi: "2026-02-24T07:30:00",
      lu: true,
    },
    {
      identifiant: 16,
      identifiantExpediteur: 2,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 2,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Laura, pas d'inquietude, il s'agit probablement d'acne neonatale, tres courante chez les nourrissons. Si les boutons ne s'accompagnent pas de fievre, de pleurs inhabituels ou de difficultes a s'alimenter, ce n'est pas grave. On en reparlera lors de la visite de controle de mardi.",
      dateEnvoi: "2026-02-24T09:00:00",
      lu: false,
    },
    {
      identifiant: 17,
      identifiantExpediteur: 3,
      typeExpediteur: "patient",
      identifiantDestinataire: 6,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Madi, je ressens beaucoup d'anxiete liee a mon parcours de fertilite. J'ai du mal a dormir et je pleure souvent. Est-ce que vous pourriez m'aider ?",
      dateEnvoi: "2026-02-24T14:00:00",
      lu: true,
    },
    {
      identifiant: 18,
      identifiantExpediteur: 6,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 3,
      typeDestinataire: "patient",
      contenu:
        "Bonjour Anais, ce que vous vivez est tout a fait comprehensible. Le parcours de fertilite est une epreuve emotionnelle importante. Je vous propose de commencer par une premiere seance pour faire le point sur votre situation et mettre en place un accompagnement adapte. N'hesitez pas a me joindre par telephone si vous en ressentez le besoin avant notre rendez-vous.",
      dateEnvoi: "2026-02-24T15:30:00",
      lu: false,
    },
    {
      identifiant: 19,
      identifiantExpediteur: 2,
      typeExpediteur: "patient",
      identifiantDestinataire: 6,
      typeDestinataire: "professionnel",
      contenu:
        "Bonjour Madame Madi, suite a notre derniere seance, je me sens un peu mieux. Thomas est venu avec moi et ca nous a fait du bien de parler ensemble. Merci pour votre ecoute.",
      dateEnvoi: "2026-02-23T10:00:00",
      lu: true,
    },
    {
      identifiant: 20,
      identifiantExpediteur: 6,
      typeExpediteur: "professionnel",
      identifiantDestinataire: 2,
      typeDestinataire: "patient",
      contenu:
        "Je suis ravie que la seance en couple vous ait aide. C'est tres positif que Thomas soit implique dans la demarche. Continuons sur cette lancee lors de notre prochaine rencontre. En attendant, n'oubliez pas les exercices de respiration que nous avons vus ensemble.",
      dateEnvoi: "2026-02-23T11:45:00",
      lu: false,
    },
  ],

  /* --------------------------------------------------------------------------
     Messages communautaires (entre parents)
     -------------------------------------------------------------------------- */
  messagesCommunautaires: [
    {
      identifiant: 1,
      identifiantAuteur: 1,
      nomAuteur: "Camille F.",
      sujet: "Cours de preparation a la naissance dans les Hauts",
      contenu:
        "Bonjour a toutes ! Est-ce que l'une d'entre vous connait un bon cours de preparation a la naissance dans les Hauts ? Je suis a Cilaos et les deplacements sont compliques.",
      categorie: "grossesse",
      dateEnvoi: "2026-02-18T09:00:00",
      reponses: [
        {
          identifiantAuteur: 2,
          nomAuteur: "Laura R.",
          contenu:
            "Bonjour Camille ! Marie-Claire Hoarau a Cilaos est formidable. Elle propose des cours individuels et en groupe. Je te la recommande les yeux fermes !",
          dateEnvoi: "2026-02-18T10:30:00",
        },
      ],
    },
    {
      identifiant: 2,
      identifiantAuteur: 3,
      nomAuteur: "Anais B.",
      sujet: "Groupes de soutien fertilite a Saint-Pierre",
      contenu:
        "Coucou les mamans ! Est-ce qu'il y a des groupes de soutien pour les femmes en parcours de fertilite a Saint-Pierre ? Je me sens un peu seule dans cette etape.",
      categorie: "general",
      dateEnvoi: "2026-02-19T14:00:00",
      reponses: [
        {
          identifiantAuteur: 1,
          nomAuteur: "Camille F.",
          contenu:
            "Bonjour Anais, je ne connais pas de groupe specifique mais Sophie Grondin est une accompagnante formidable qui pourrait t'orienter. Courage a toi !",
          dateEnvoi: "2026-02-19T16:00:00",
        },
      ],
    },
    {
      identifiant: 3,
      identifiantAuteur: 2,
      nomAuteur: "Laura R.",
      sujet: "Allaitement et reprise du travail",
      contenu:
        "Les mamans qui allaitent, comment avez-vous gere la reprise du travail ? Je reprends dans un mois et je ne sais pas comment m'organiser avec le tire-lait au bureau.",
      categorie: "allaitement",
      dateEnvoi: "2026-02-20T11:00:00",
      reponses: [
        {
          identifiantAuteur: 1,
          nomAuteur: "Camille F.",
          contenu:
            "Ma collegue a allaite pendant un an en tirant son lait au travail. Elle avait un coin tranquille et un mini-frigo. Courage, c'est faisable !",
          dateEnvoi: "2026-02-20T13:00:00",
        },
        {
          identifiantAuteur: 3,
          nomAuteur: "Anais B.",
          contenu:
            "Je n'ai pas encore d'experience personnelle mais j'ai lu que certains employeurs a La Reunion commencent a amenager des salles d'allaitement. Renseigne-toi aupres de ton service RH !",
          dateEnvoi: "2026-02-20T14:30:00",
        },
      ],
    },
    {
      identifiant: 4,
      identifiantAuteur: 1,
      nomAuteur: "Camille F.",
      sujet: "Recettes saines pendant la grossesse",
      contenu:
        "Salut tout le monde ! Je cherche des idees de recettes saines et faciles avec des produits locaux pour le deuxieme trimestre. J'en ai un peu marre du riz-grains tous les jours ! Des suggestions ?",
      categorie: "grossesse",
      dateEnvoi: "2026-02-21T08:30:00",
      reponses: [
        {
          identifiantAuteur: 2,
          nomAuteur: "Laura R.",
          contenu:
            "Essaie le chouchou gratin avec du fromage et de la bechamel legere, c'est delicieux et super nutritif ! Les bredes mafane en bouillon sont aussi excellentes pour le fer.",
          dateEnvoi: "2026-02-21T10:00:00",
        },
        {
          identifiantAuteur: 3,
          nomAuteur: "Anais B.",
          contenu:
            "Le smoothie mangue-banane-lait de coco le matin c'est un regal et c'est plein de vitamines. Aussi, la salade de papaye verte rapee avec du citron vert, un classique !",
          dateEnvoi: "2026-02-21T11:15:00",
        },
      ],
    },
    {
      identifiant: 5,
      identifiantAuteur: 3,
      nomAuteur: "Anais B.",
      sujet: "Gerer le stress pendant le parcours PMA",
      contenu:
        "Pour celles qui sont passees par la PMA, comment avez-vous gere le stress et l'attente ? Les montagnes russes emotionnelles sont vraiment difficiles a vivre.",
      categorie: "general",
      dateEnvoi: "2026-02-22T09:30:00",
      reponses: [
        {
          identifiantAuteur: 1,
          nomAuteur: "Camille F.",
          contenu:
            "Je ne suis pas passee par la PMA mais je pense a toi Anais. La meditation et le yoga m'aident beaucoup avec mon anxiete de grossesse, ca pourrait aussi t'aider ?",
          dateEnvoi: "2026-02-22T11:00:00",
        },
      ],
    },
    {
      identifiant: 6,
      identifiantAuteur: 2,
      nomAuteur: "Laura R.",
      sujet: "Baby blues ou depression post-partum ?",
      contenu:
        "Comment distinguer le baby blues de la depression post-partum ? Ca fait trois semaines que je pleure souvent et je n'arrive pas a savoir si c'est normal ou si je dois vraiment consulter.",
      categorie: "post-partum",
      dateEnvoi: "2026-02-23T07:30:00",
      reponses: [
        {
          identifiantAuteur: 1,
          nomAuteur: "Camille F.",
          contenu:
            "Laura, au bout de trois semaines ca vaut le coup d'en parler a un professionnel. Le baby blues dure normalement une a deux semaines maximum. N'hesite pas a consulter, il n'y a aucune honte a demander de l'aide !",
          dateEnvoi: "2026-02-23T09:00:00",
        },
        {
          identifiantAuteur: 3,
          nomAuteur: "Anais B.",
          contenu:
            "Je suis d'accord avec Camille. Madame Madi est une psychologue formidable, elle est specialisee en perinatalite. Prends soin de toi !",
          dateEnvoi: "2026-02-23T10:30:00",
        },
      ],
    },
  ],

  /* --------------------------------------------------------------------------
     Rendez-vous
     -------------------------------------------------------------------------- */
  rendezVous: [
    {
      identifiant: 1,
      identifiantPatient: 1,
      identifiantProfessionnel: 1,
      date: "2026-02-25",
      heure: "10:00",
      motif: "Consultation de suivi de grossesse - Deuxieme trimestre",
      statut: "confirme",
    },
    {
      identifiant: 2,
      identifiantPatient: 2,
      identifiantProfessionnel: 4,
      date: "2026-02-26",
      heure: "09:00",
      motif: "Consultation allaitement - Difficultes crevasses",
      statut: "confirme",
    },
    {
      identifiant: 3,
      identifiantPatient: 2,
      identifiantProfessionnel: 6,
      date: "2026-02-25",
      heure: "15:00",
      motif: "Seance de suivi psychologique post-partum",
      statut: "en_attente",
    },
    {
      identifiant: 4,
      identifiantPatient: 1,
      identifiantProfessionnel: 1,
      date: "2026-02-25",
      heure: "08:30",
      motif: "Echographie de controle - 22 semaines",
      statut: "confirme",
    },
    {
      identifiant: 5,
      identifiantPatient: 3,
      identifiantProfessionnel: 1,
      date: "2026-02-25",
      heure: "14:00",
      motif: "Consultation pre-conceptionnelle",
      statut: "confirme",
    },
    {
      identifiant: 6,
      identifiantPatient: 1,
      identifiantProfessionnel: 1,
      date: "2026-03-04",
      heure: "10:00",
      motif: "Preparation a la naissance - Seance piscine",
      statut: "confirme",
    },
    {
      identifiant: 7,
      identifiantPatient: 2,
      identifiantProfessionnel: 2,
      date: "2026-02-25",
      heure: "11:00",
      motif: "Visite de controle nourrisson - 2 mois",
      statut: "confirme",
    },
    {
      identifiant: 8,
      identifiantPatient: 2,
      identifiantProfessionnel: 2,
      date: "2026-03-11",
      heure: "09:30",
      motif: "Suivi vaccinations nourrisson",
      statut: "en_attente",
    },
    {
      identifiant: 9,
      identifiantPatient: 3,
      identifiantProfessionnel: 3,
      date: "2026-02-26",
      heure: "14:30",
      motif: "Accompagnement parcours fertilite",
      statut: "confirme",
    },
    {
      identifiant: 10,
      identifiantPatient: 1,
      identifiantProfessionnel: 3,
      date: "2026-03-01",
      heure: "16:00",
      motif: "Seance de relaxation prenatale",
      statut: "en_attente",
    },
    {
      identifiant: 11,
      identifiantPatient: 1,
      identifiantProfessionnel: 5,
      date: "2026-02-27",
      heure: "10:30",
      motif: "Seance osteopathie - Douleurs ligamentaires grossesse",
      statut: "confirme",
    },
    {
      identifiant: 12,
      identifiantPatient: 2,
      identifiantProfessionnel: 6,
      date: "2026-02-25",
      heure: "16:30",
      motif: "Suivi psychologique post-partum - Seance 2",
      statut: "confirme",
    },
    {
      identifiant: 13,
      identifiantPatient: 3,
      identifiantProfessionnel: 6,
      date: "2026-03-05",
      heure: "11:00",
      motif: "Accompagnement anxiete liee a la conception",
      statut: "en_attente",
    },
  ],
};

export default donneesLocales;
