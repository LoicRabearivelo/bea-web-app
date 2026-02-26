import React, { useState } from 'react';
import { Calendar, Baby, Moon, Utensils, Brain, Heart, Scale, AlertTriangle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import data from '../data/data.json';

type TabKey = 'calendrier' | 'nutrition' | 'sommeil' | 'repas' | 'croissance' | 'sante_mentale' | 'notes';

export default function Suivi() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('calendrier');
  const [newNote, setNewNote] = useState({ titre: '', contenu: '' });

  if (!utilisateur) return null;

  const profil = utilisateur.profil;
  const enfants = utilisateur.enfants || [];
  const enfant = enfants[0];
  const portefeuille = utilisateur.portefeuille || { notes: [], documents: [] };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'calendrier', label: 'Calendrier', icon: <Calendar size={16} /> },
    { key: 'nutrition', label: 'Nutrition', icon: <Utensils size={16} /> },
    { key: 'sommeil', label: 'Sommeil', icon: <Moon size={16} /> },
    { key: 'repas', label: 'Repas', icon: <Baby size={16} /> },
    { key: 'croissance', label: 'Croissance', icon: <Scale size={16} /> },
    { key: 'sante_mentale', label: 'Santé mentale', icon: <Brain size={16} /> },
    { key: 'notes', label: 'Notes', icon: <Heart size={16} /> },
  ];

  const stadeAlimentaire = profil?.stade && (profil.stade in data.programmeAlimentaire)
    ? data.programmeAlimentaire[profil.stade as keyof typeof data.programmeAlimentaire]
    : null;

  const addNote = () => {
    if (!newNote.titre) return;
    const note = {
      id: `note-${Date.now()}`,
      titre: newNote.titre,
      contenu: newNote.contenu,
      date: new Date().toISOString().split('T')[0],
    };
    const updatedPortefeuille = {
      ...portefeuille,
      notes: [...portefeuille.notes, note],
    };
    mettreAJourUtilisateur({ portefeuille: updatedPortefeuille });
    setNewNote({ titre: '', contenu: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Mon suivi</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 bg-light-blue/50 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-dark/60 hover:text-dark'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Calendrier */}
      {activeTab === 'calendrier' && (
        <div className="space-y-6">
          <Card>
            <h2 className="font-bold text-dark mb-4">Calendrier de grossesse</h2>
            {profil?.semainesAmenorrhee ? (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary text-white rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold">{profil.semainesAmenorrhee}</p>
                    <p className="text-xs">SA</p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">
                      {data.stadesPerinataux.find(s => s.id === profil.stade)?.label}
                    </p>
                    {profil.dpa && <p className="text-sm text-dark/60">DPA : {profil.dpa}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-7 sm:grid-cols-14 gap-1">
                  {Array.from({ length: 41 }, (_, i) => {
                    const week = i + 1;
                    const isCurrent = week === profil.semainesAmenorrhee;
                    const isPast = week < (profil.semainesAmenorrhee || 0);
                    return (
                      <div
                        key={week}
                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                          isCurrent
                            ? 'bg-primary text-white shadow-md'
                            : isPast
                            ? 'bg-olive/20 text-dark/60'
                            : 'bg-light-blue/50 text-dark/40'
                        }`}
                      >
                        {week}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs text-dark/50">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-olive/20" /> Passé</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary" /> En cours</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-light-blue/50" /> À venir</span>
                </div>
              </div>
            ) : (
              <p className="text-dark/60">Complétez votre profil pour voir votre calendrier.</p>
            )}
          </Card>
        </div>
      )}

      {/* Nutrition */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          {stadeAlimentaire ? (
            <Card>
              <h2 className="font-bold text-dark mb-2">Programme nutritionnel local</h2>
              <p className="text-sm text-dark/60 mb-4">{stadeAlimentaire.objectif}</p>
              <div className="space-y-3">
                {stadeAlimentaire.aliments.map((aliment: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-bg border border-light-blue">
                    <span className="text-2xl">{aliment.emoji}</span>
                    <div>
                      <p className="font-medium text-dark">{aliment.nom}</p>
                      <p className="text-sm text-dark/60">{aliment.apport}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-dark/60 text-center py-4">
                Complétez votre profil pour voir le programme nutritionnel adapté.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Sommeil (bébé) */}
      {activeTab === 'sommeil' && (
        <div className="space-y-6">
          {enfant?.suivi?.sommeil ? (
            <Card>
              <h2 className="font-bold text-dark mb-4">Suivi du sommeil — {enfant.prenom}</h2>
              {enfant.suivi.sommeil.map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-light-blue last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark">{entry.date}</p>
                    <p className="text-xs text-dark/50">{entry.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark">{entry.dureeHeures}h</p>
                    <Badge variant={entry.qualite === 'bon' ? 'olive' : entry.qualite === 'moyen' ? 'gold' : 'salmon'}>
                      {entry.qualite}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card><p className="text-dark/60 text-center py-4">Aucune donnée de sommeil disponible.</p></Card>
          )}
        </div>
      )}

      {/* Repas (bébé) */}
      {activeTab === 'repas' && (
        <div className="space-y-6">
          {enfant?.suivi?.repas ? (
            <Card>
              <h2 className="font-bold text-dark mb-4">Suivi des repas — {enfant.prenom}</h2>
              {enfant.suivi.repas.map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-light-blue last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dark">{entry.type}</p>
                    <p className="text-xs text-dark/50">{entry.date} — {entry.heure}</p>
                  </div>
                  {entry.quantite && <Badge variant="blue">{entry.quantite}</Badge>}
                </div>
              ))}
            </Card>
          ) : (
            <Card><p className="text-dark/60 text-center py-4">Aucune donnée de repas disponible.</p></Card>
          )}
        </div>
      )}

      {/* Croissance */}
      {activeTab === 'croissance' && (
        <div className="space-y-6">
          {enfant?.suivi?.croissance ? (
            <Card>
              <h2 className="font-bold text-dark mb-4">Courbe de croissance — {enfant.prenom}</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-bg rounded-xl">
                  <p className="text-xs text-dark/50">Naissance</p>
                  <p className="font-bold text-dark">{enfant.poidsNaissance}g</p>
                </div>
                <div className="text-center p-3 bg-bg rounded-xl">
                  <p className="text-xs text-dark/50">Taille</p>
                  <p className="font-bold text-dark">{enfant.tailleNaissance}cm</p>
                </div>
                <div className="text-center p-3 bg-bg rounded-xl">
                  <p className="text-xs text-dark/50">PC</p>
                  <p className="font-bold text-dark">{enfant.perimCreNaissance}cm</p>
                </div>
              </div>
              {enfant.suivi.croissance.map((entry: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-light-blue last:border-0">
                  <span className="text-sm text-dark/60">{entry.date}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium text-dark">{entry.poids}g</span>
                    <span className="text-dark/60">{entry.taille}cm</span>
                    <span className="text-dark/60">PC {entry.perimCre}cm</span>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card><p className="text-dark/60 text-center py-4">Aucune donnée de croissance disponible.</p></Card>
          )}
        </div>
      )}

      {/* Santé mentale */}
      {activeTab === 'sante_mentale' && (
        <div className="space-y-6">
          <Card className="border-primary/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <h2 className="font-bold text-dark mb-2">Besoin d'aide ?</h2>
                <p className="text-sm text-dark/70 mb-3">
                  Si vous ressentez une détresse émotionnelle, n'hésitez pas à en parler.
                </p>
                <div className="space-y-2">
                  <a href="tel:3114" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone size={16} /> 3114 — Numéro national de prévention du suicide
                  </a>
                  <a href="tel:0262405060" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone size={16} /> 0262 40 50 60 — Réseau REPERE La Réunion
                  </a>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-dark mb-4">Évaluation de votre bien-être</h2>
            <p className="text-sm text-dark/60 mb-4">
              Comment vous sentez-vous aujourd'hui ? Notez votre humeur pour suivre votre bien-être émotionnel.
            </p>
            <div className="flex gap-3 justify-center">
              {['😢', '😔', '😐', '🙂', '😊'].map((emoji, i) => (
                <button
                  key={i}
                  className="text-3xl p-3 rounded-xl hover:bg-light-blue transition-all hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Notes / Portefeuille */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <Card>
            <h2 className="font-bold text-dark mb-4">Mes notes</h2>
            <div className="space-y-3 mb-6">
              {portefeuille.notes.map((note: any) => (
                <div key={note.id} className="p-3 bg-bg rounded-xl border border-light-blue">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-dark text-sm">{note.titre}</h3>
                    <span className="text-xs text-dark/40">{note.date}</span>
                  </div>
                  <p className="text-sm text-dark/60 mt-1">{note.contenu}</p>
                </div>
              ))}
              {portefeuille.notes.length === 0 && (
                <p className="text-sm text-dark/50 text-center py-2">Aucune note pour le moment</p>
              )}
            </div>
            <div className="space-y-3 border-t border-light-blue pt-4">
              <input
                type="text"
                value={newNote.titre}
                onChange={e => setNewNote(prev => ({ ...prev, titre: e.target.value }))}
                placeholder="Titre de la note..."
                className="w-full px-4 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
              />
              <textarea
                value={newNote.contenu}
                onChange={e => setNewNote(prev => ({ ...prev, contenu: e.target.value }))}
                placeholder="Contenu..."
                className="w-full px-4 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm resize-none h-20"
              />
              <Button onClick={addNote} size="sm">Ajouter une note</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
