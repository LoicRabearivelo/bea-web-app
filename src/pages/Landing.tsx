import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Mail, Users, BookOpen, Briefcase, MapPin, Star, Check, ArrowRight } from 'lucide-react';
import data from '../data/data.json';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Landing() {
  const offresBtoC = data.offres.btoc;
  const offresBtoB = data.offres.btob;
  const zones = data.zonesGeographiques;

  return (
    <div className="bg-bg">
      {/* HERO */}
      <section className="py-10 sm:py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <img src="/logo.png" alt="Béa" className="h-20 mx-auto mb-8" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-4 sm:mb-6">
            Votre parcours périnatal à La Réunion,<br />
            <span className="text-primary">enfin centralisé</span>
          </h1>
          <p className="text-base sm:text-lg text-dark/70 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            De la préparation à la naissance jusqu'aux 12 premiers mois de bébé. 
            Béa connecte les futures familles réunionnaises à l'écosystème périnatal local.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
            <a href="#offres">
              <Button variant="secondary" size="lg">Voir les offres</Button>
            </a>
          </div>
        </div>
      </section>

      {/* LE PROBLÈME */}
      <section className="py-10 sm:py-16 px-4 bg-light-blue">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark text-center mb-4">
            « Je suis perdue. Je vais où ? »
          </h2>
          <p className="text-center text-dark/60 mb-12 max-w-2xl mx-auto">
            Cette question, des centaines de futures mamans réunionnaises se la posent chaque jour.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <Card>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">👩‍👧 Pour les parents</h3>
              <ul className="space-y-3 text-dark/70">
                <li>• Pas d'information centralisée sur les soins périnataux</li>
                <li>• Difficulté à trouver le bon professionnel</li>
                <li>• Isolement géographique dans les Hauts</li>
                <li>• Charge mentale administrative immense</li>
                <li>• Manque de suivi post-partum coordonné</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">👨‍⚕️ Pour les professionnels</h3>
              <ul className="space-y-3 text-dark/70">
                <li>• Visibilité limitée auprès des familles</li>
                <li>• Pas d'outil de coordination interprofessionnelle</li>
                <li>• Gestion administrative chronophage</li>
                <li>• Difficulté à atteindre les populations isolées</li>
                <li>• Manque de plateforme dédiée à la périnatalité</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* LA SOLUTION */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
            Le Coordinateur de Vie
          </h2>
          <p className="text-dark/60 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Un tiers de confiance numérique qui vous accompagne à chaque étape
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-olive/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-bold text-dark mb-2">Avant</h3>
              <p className="text-dark/60 text-sm">Projet bébé, fertilité, préparation. Nous vous orientons vers les bons professionnels.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤰</span>
              </div>
              <h3 className="font-bold text-dark mb-2">Pendant</h3>
              <p className="text-dark/60 text-sm">Suivi de grossesse, préparation naissance, nutrition locale, santé mentale.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👶</span>
              </div>
              <h3 className="font-bold text-dark mb-2">Après</h3>
              <p className="text-dark/60 text-sm">Post-partum, allaitement, suivi bébé, rééducation, soutien parental.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="py-10 sm:py-16 px-4 bg-light-blue/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark text-center mb-8 sm:mb-12">Tout ce dont vous avez besoin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <Calendar className="text-primary" size={28} />, title: 'Calendrier de suivi', desc: 'Suivez votre grossesse semaine par semaine avec des contenus personnalisés.' },
              { icon: <Search className="text-olive" size={28} />, title: 'Annuaire des pros', desc: 'Trouvez sage-femmes, gynécologues, doulas près de chez vous.' },
              { icon: <Mail className="text-gold" size={28} />, title: 'Messagerie directe', desc: 'Échangez avec vos professionnels de santé en toute sécurité.' },
              { icon: <Users className="text-salmon" size={28} />, title: 'Forum communautaire', desc: 'Partagez vos expériences avec d\'autres mamans réunionnaises.' },
              { icon: <BookOpen className="text-primary" size={28} />, title: 'Articles & podcasts', desc: 'Des contenus fiables rédigés par des professionnels de santé.' },
              { icon: <Briefcase className="text-olive" size={28} />, title: 'Portefeuille numérique', desc: 'Notes, documents, checklist maternité — tout au même endroit.' },
            ].map((f, i) => (
              <Card key={i}>
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-bold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-dark/60">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES B2C */}
      <section id="offres" className="py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-dark text-center mb-4">Nos offres familles</h2>
          <p className="text-center text-dark/60 mb-12">Choisissez le pack adapté à votre situation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {offresBtoC.map((offre: any) => (
              <div
                key={offre.id}
                className={`relative rounded-2xl border-2 p-4 sm:p-6 transition-all duration-200 hover:shadow-lg ${
                  (offre as any).populaire ? 'border-primary bg-primary/5 sm:scale-105' : 'border-light-blue bg-white/80'
                }`}
              >
                {(offre as any).populaire && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                {offre.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark text-xs font-bold px-4 py-1 rounded-full">
                    {offre.badge}
                  </div>
                )}
                <div className="text-center mb-4">
                  <span className="text-3xl">{offre.icone}</span>
                  <h3 className="font-bold text-dark mt-2">{offre.nom}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-dark">{offre.prix}€</span>
                    <span className="text-dark/50 text-sm">/{offre.periodicite}</span>
                  </div>
                </div>
                <p className="text-xs text-dark/60 mb-4 text-center">{offre.description}</p>
                <ul className="space-y-2 mb-6">
                  {offre.avantages.map((a: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-dark/70">
                      <Check size={14} className="text-olive mt-0.5 flex-shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/inscription" className="block">
                  <Button variant={(offre as any).populaire ? 'primary' : 'secondary'} className="w-full" size="sm">
                    Choisir ce pack
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES B2B */}
      <section className="py-10 sm:py-16 px-4 bg-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Offres Professionnels</h2>
          <p className="text-white/60 text-center mb-12">Rejoignez le réseau périnatal de La Réunion</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {offresBtoB.map((offre: any) => (
              <div key={offre.id} className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-6 border border-white/20">
                <div className="text-center mb-4">
                  <span className="text-3xl">{offre.icone}</span>
                  <h3 className="font-bold text-white mt-2">{offre.nom}</h3>
                  <p className="text-white/60 text-sm mt-1">{offre.description}</p>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-gold">{offre.prix}€</span>
                  <span className="text-white/50 text-sm">/{offre.periodicite}</span>
                </div>
                <Link to="/inscription">
                  <Button variant="secondary" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white" size="sm">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LA RÉUNION */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
            <MapPin className="inline text-primary mr-2" size={28} />
            La Réunion au cœur
          </h2>
          <p className="text-dark/60 mb-12">Plus de 24 communes couvertes sur toute l'île</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {zones.map((zone: any) => (
              <Card key={zone.id} className="text-center p-4">
                <h3 className="font-bold text-primary mb-2">{zone.label}</h3>
                <p className="text-xs text-dark/60">{zone.communes.length} communes</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-10 sm:py-16 px-4 bg-light-blue/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark text-center mb-8 sm:mb-12">Ce que disent nos utilisatrices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { nom: 'Aurélie M.', ville: 'Saint-Denis', texte: 'Béa m\'a permis de trouver une sage-femme formidable à 5 minutes de chez moi. Le suivi personnalisé est top !', note: 5 },
              { nom: 'Nadia K.', ville: 'Saint-Pierre', texte: 'En post-partum, j\'étais perdue. Grâce au chatbot Béa, j\'ai pu avoir des réponses rapides et trouver une psy spécialisée.', note: 5 },
              { nom: 'Christelle V.', ville: 'Cilaos', texte: 'Dans les Hauts, on est isolées. Cette appli est une vraie bouffée d\'air — je ne me sens plus seule dans ma grossesse.', note: 4 },
            ].map((t, i) => (
              <Card key={i}>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} size={14} className={j < t.note ? 'text-gold fill-gold' : 'text-light-blue'} />
                  ))}
                </div>
                <p className="text-sm text-dark/70 italic mb-4">« {t.texte} »</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-salmon/30 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                    {t.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{t.nom}</p>
                    <p className="text-xs text-dark/50">{t.ville}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 sm:py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">Prête à commencer ?</h2>
          <p className="text-dark/60 mb-8">
            Rejoignez des centaines de familles réunionnaises qui font confiance à Béa.
          </p>
          <Link to="/inscription">
            <Button size="lg">
              Créer mon compte gratuitement <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
