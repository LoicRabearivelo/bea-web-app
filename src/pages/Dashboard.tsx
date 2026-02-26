import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Mail, Users, BookOpen, Briefcase, Clock, Apple } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import data from '../data/data.json';

function scorerProfessionnel(pro: any, profil: any) {
  let score = 0;
  if (pro.zone === profil?.zone) score += 3;
  if (profil?.besoins) {
    profil.besoins.forEach((b: string) => {
      if (pro.besoinsAssocies?.includes(b)) score += 2;
    });
  }
  score += pro.note || 0;
  return score;
}

function getStadeLabel(stade: string) {
  const s = data.stadesPerinataux.find(sp => sp.id === stade);
  return s ? s.label : stade;
}

export default function Dashboard() {
  const { utilisateur } = useAuth();
  if (!utilisateur) return null;

  const profil = utilisateur.profil;
  const stadeLabel = profil ? getStadeLabel(profil.stade) : '';
  const sa = profil?.semainesAmenorrhee;

  // Recommended pros
  const scoredPros = data.professionnels
    .map(pro => ({ ...pro, score: scorerProfessionnel(pro, { zone: utilisateur.zone, besoins: profil?.besoins }) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Recent articles
  const recentArticles = data.articles.slice(0, 4);

  // Programme alimentaire
  const stadeAlimentaire = profil?.stade && (profil.stade in data.programmeAlimentaire)
    ? data.programmeAlimentaire[profil.stade as keyof typeof data.programmeAlimentaire]
    : null;

  const raccourcis = [
    { icon: <Calendar className="text-primary" size={22} />, label: 'Mon suivi', to: '/suivi' },
    { icon: <Search className="text-olive" size={22} />, label: 'Annuaire', to: '/annuaire' },
    { icon: <Mail className="text-gold" size={22} />, label: 'Messages', to: '/messagerie' },
    { icon: <Users className="text-salmon" size={22} />, label: 'Communauté', to: '/communaute' },
    { icon: <BookOpen className="text-primary" size={22} />, label: 'Articles', to: '/articles' },
    { icon: <Briefcase className="text-olive" size={22} />, label: 'Portefeuille', to: '/suivi' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">
          Bonjour {utilisateur.prenom} 👋
        </h1>
        {profil && (
          <p className="text-dark/60 mt-1">
            {sa ? `Vous êtes à ${sa} SA — ${stadeLabel}` : stadeLabel}
          </p>
        )}
        {profil?.besoins && profil.besoins.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profil.besoins.map((b: string) => {
              const besoin = data.besoins.find(bs => bs.id === b);
              return besoin ? (
                <Badge key={b} variant="blue">
                  {besoin.icone} {besoin.label}
                </Badge>
              ) : null;
            })}
          </div>
        )}
        {utilisateur.abonnement && (
          <Badge variant={utilisateur.abonnement === 'gratuit' ? 'blue' : 'gold'} className="mt-3">
            {utilisateur.abonnement === 'gratuit' ? 'Compte Gratuit' : `Pack ${utilisateur.pack || utilisateur.abonnement}`}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Raccourcis */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {raccourcis.map((r, i) => (
              <Link key={i} to={r.to}>
                <Card className="text-center !p-3 sm:!p-4 hover:border-primary">
                  <div className="flex justify-center mb-1 sm:mb-2">{r.icon}</div>
                  <p className="text-[10px] sm:text-xs font-medium text-dark leading-tight">{r.label}</p>
                </Card>
              </Link>
            ))}
          </div>

          {/* Calendrier de suivi */}
          {sa && (
            <Card>
              <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Votre semaine
              </h2>
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 -mx-1 px-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const week = Math.max(1, sa - 3 + i);
                  if (week > 41) return null;
                  return (
                    <div
                      key={week}
                      className={`flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                        week === sa
                          ? 'bg-primary text-white shadow-lg scale-110'
                          : week < sa
                          ? 'bg-light-blue text-dark/50'
                          : 'bg-bg border border-light-blue text-dark/70'
                      }`}
                    >
                      <span className="text-xs">SA</span>
                      <span className="font-bold">{week}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Professionnels recommandés */}
          <div>
            <h2 className="font-bold text-dark mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Search size={18} className="text-olive flex-shrink-0" /> Professionnels recommandés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {scoredPros.map(pro => (
                <Card key={pro.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                      {pro.prenom.charAt(0)}{pro.nom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">{pro.prenom} {pro.nom}</p>
                      <Badge variant="olive" className="text-[10px]">{pro.specialite}</Badge>
                    </div>
                  </div>
                  <StarRating note={pro.note} size={12} />
                  <p className="text-xs text-dark/50 mt-2">{pro.ville} — {pro.zone}</p>
                  <Link
                    to="/annuaire"
                    className="mt-3 block text-center text-xs font-semibold text-primary hover:underline"
                  >
                    Voir le profil →
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <h2 className="font-bold text-dark mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <BookOpen size={18} className="text-primary flex-shrink-0" /> Articles récents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {recentArticles.map(article => (
                <Card key={article.id}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{article.icone}</span>
                    <div className="min-w-0">
                      <Badge variant="olive" className="text-[10px] mb-1">{article.categorie}</Badge>
                      <h3 className="font-semibold text-dark text-sm leading-snug">{article.titre}</h3>
                      <p className="text-xs text-dark/50 mt-1">
                        <Clock size={12} className="inline mr-1" />{article.tempsLecture} min
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Prochain RDV */}
          <Card className="border-primary/30">
            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Prochain rendez-vous
            </h3>
            {utilisateur.messages && utilisateur.messages.length > 0 ? (
              <div className="text-sm text-dark/70">
                <p className="font-medium">Aucun rendez-vous prévu</p>
                <Link to="/annuaire" className="text-primary text-xs font-semibold hover:underline mt-2 block">
                  Prendre rendez-vous →
                </Link>
              </div>
            ) : (
              <div className="text-sm text-dark/60">
                <p>Aucun rendez-vous prévu</p>
                <Link to="/annuaire" className="text-primary text-xs font-semibold hover:underline mt-2 block">
                  Prendre rendez-vous →
                </Link>
              </div>
            )}
          </Card>

          {/* Programme alimentaire */}
          {stadeAlimentaire && (
            <Card>
              <h3 className="font-bold text-dark mb-2 flex items-center gap-2">
                <Apple size={18} className="text-olive" /> Nutrition locale
              </h3>
              <p className="text-xs text-dark/60 mb-3">{stadeAlimentaire.objectif}</p>
              <div className="space-y-2">
                {stadeAlimentaire.aliments.map((aliment: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-bg">
                    <span className="text-lg">{aliment.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-dark">{aliment.nom}</p>
                      <p className="text-xs text-dark/50">{aliment.apport}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Liens rapides */}
          <Card>
            <h3 className="font-bold text-dark mb-3">Liens rapides</h3>
            <div className="space-y-2">
              <Link to="/suivi" className="block text-sm text-primary hover:underline">📅 Mon suivi de grossesse</Link>
              <Link to="/communaute" className="block text-sm text-primary hover:underline">👥 Questions fréquentes</Link>
              <Link to="/articles" className="block text-sm text-primary hover:underline">📖 Tous les articles</Link>
              {utilisateur.enfants && utilisateur.enfants.length > 0 && (
                <Link to="/fiche-enfant" className="block text-sm text-primary hover:underline">👶 Fiche de mon enfant</Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
