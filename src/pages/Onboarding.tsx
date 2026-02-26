import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import data from '../data/data.json';

const ETAPES = ['Situation', 'Localisation', 'Grossesse', 'Besoins', 'Validation'];

export default function Onboarding() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth();
  const navigate = useNavigate();
  const [etape, setEtape] = useState(0);
  const [profil, setProfil] = useState({
    stade: '',
    commune: '',
    zone: '',
    semainesAmenorrhee: 12,
    dpa: '',
    rangGrossesse: 1,
    typeAccouchement: '',
    antecedents: [] as string[],
    besoins: [] as string[],
    partenaire: null as any,
    partenaireNom: '',
    partenaireType: '',
    rgpd: false,
  });

  const updateProfil = (field: string, value: any) => {
    setProfil(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    if (etape === 0 && !['T1', 'T2', 'T3', 'post_natal'].includes(profil.stade) && etape < 2) {
      setEtape(prev => Math.min(prev + 1, ETAPES.length - 1));
      if (etape + 1 === 2) setEtape(3); // skip grossesse step
    } else {
      setEtape(prev => Math.min(prev + 1, ETAPES.length - 1));
    }
  };

  const prev = () => setEtape(prev => Math.max(prev - 1, 0));

  const skip = () => next();

  const finish = () => {
    mettreAJourUtilisateur({
      onboardingComplete: true,
      profil: {
        stade: profil.stade,
        semainesAmenorrhee: profil.semainesAmenorrhee,
        dpa: profil.dpa,
        rangGrossesse: profil.rangGrossesse,
        typeAccouchement: profil.typeAccouchement,
        antecedents: profil.antecedents,
        besoins: profil.besoins,
        partenaire: profil.partenaireNom ? { nom: profil.partenaireNom, type: profil.partenaireType } : null,
      },
      zone: profil.zone,
      ville: profil.commune,
    });
    navigate('/tableau-de-bord');
  };

  const stadeOptions = [
    { id: 'projet_bebe', icon: '🌱', label: 'Projet bébé (naturel)' },
    { id: 'pma_fiv', icon: '🔬', label: 'Parcours PMA / FIV' },
    { id: 'T1', icon: '🤰', label: 'Je suis enceinte — 1er trimestre' },
    { id: 'T2', icon: '🤰', label: 'Je suis enceinte — 2ème trimestre' },
    { id: 'T3', icon: '🤰', label: 'Je suis enceinte — 3ème trimestre' },
    { id: 'post_natal', icon: '👶', label: "J'ai déjà accouché" },
  ];

  const needsGrossesseStep = ['T1', 'T2', 'T3', 'post_natal'].includes(profil.stade);

  const progress = ((etape + 1) / ETAPES.length) * 100;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-dark/50 mb-2">
            <span>Étape {etape + 1} / {ETAPES.length}</span>
            <span>{ETAPES[etape]}</span>
          </div>
          <div className="h-2 bg-light-blue rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white/80 border border-light-blue rounded-xl shadow-sm p-8">
          {/* ÉTAPE 1 — Situation */}
          {etape === 0 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-2">Où en êtes-vous ?</h2>
              <p className="text-sm text-dark/60 mb-6">Cela nous permettra de personnaliser votre expérience.</p>
              <div className="space-y-3">
                {stadeOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateProfil('stade', opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      profil.stade === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-light-blue hover:border-salmon'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-medium text-dark">{opt.label}</span>
                    {profil.stade === opt.id && <Check className="ml-auto text-primary" size={20} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 — Localisation */}
          {etape === 1 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-2">Votre localisation</h2>
              <p className="text-sm text-dark/60 mb-6">Pour vous recommander des professionnels près de chez vous.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">Zone géographique</label>
                <div className="grid grid-cols-3 gap-2">
                  {data.zonesGeographiques.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => updateProfil('zone', zone.label)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        profil.zone === zone.label
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-light-blue text-dark/70 hover:border-salmon'
                      }`}
                    >
                      {zone.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">Commune</label>
                <select
                  value={profil.commune}
                  onChange={e => {
                    updateProfil('commune', e.target.value);
                    const zone = data.zonesGeographiques.find(z => z.communes.includes(e.target.value));
                    if (zone) updateProfil('zone', zone.label);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary"
                >
                  <option value="">Choisir votre commune...</option>
                  {data.communes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Grossesse */}
          {etape === 2 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-2">Votre grossesse</h2>
              <p className="text-sm text-dark/60 mb-6">Ces informations restent confidentielles.</p>
              
              {!needsGrossesseStep ? (
                <p className="text-dark/60 text-center py-8">
                  Cette étape ne s'applique pas à votre situation. 
                  <button onClick={skip} className="text-primary font-semibold ml-1">Passer →</button>
                </p>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Semaines d'aménorrhée : <span className="text-primary font-bold">{profil.semainesAmenorrhee} SA</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={41}
                      value={profil.semainesAmenorrhee}
                      onChange={e => updateProfil('semainesAmenorrhee', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-dark/40 mt-1">
                      <span>1 SA</span>
                      <span>14 SA</span>
                      <span>27 SA</span>
                      <span>41 SA</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Date Prévue d'Accouchement</label>
                    <input
                      type="date"
                      value={profil.dpa}
                      onChange={e => updateProfil('dpa', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Rang de grossesse</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(n => (
                        <button
                          key={n}
                          onClick={() => updateProfil('rangGrossesse', n)}
                          className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                            profil.rangGrossesse === n
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-light-blue text-dark/60'
                          }`}
                        >
                          {n === 3 ? '3ème+' : n === 1 ? '1ère' : '2ème'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Type d'accouchement souhaité</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'voie_basse', label: 'Voie basse' },
                        { id: 'cesarienne', label: 'Césarienne' },
                        { id: 'physiologique', label: 'Physiologique' },
                        { id: 'pas_decide', label: 'Pas encore décidé' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateProfil('typeAccouchement', opt.id)}
                          className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            profil.typeAccouchement === opt.id
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-light-blue text-dark/60'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Partenaire</label>
                    <input
                      type="text"
                      value={profil.partenaireNom}
                      onChange={e => updateProfil('partenaireNom', e.target.value)}
                      placeholder="Nom du/de la partenaire (optionnel)"
                      className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      {['Conjoint·e', 'Coparental', 'Solo'].map(type => (
                        <button
                          key={type}
                          onClick={() => updateProfil('partenaireType', type)}
                          className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                            profil.partenaireType === type
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-light-blue text-dark/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={skip} className="text-sm text-dark/50 hover:text-primary transition-colors">
                    Passer cette étape →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 4 — Besoins */}
          {etape === 3 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-2">Vos besoins prioritaires</h2>
              <p className="text-sm text-dark/60 mb-6">Sélectionnez entre 1 et 5 besoins (nous adapterons votre expérience).</p>
              <div className="grid grid-cols-2 gap-3">
                {data.besoins.map(besoin => {
                  const selected = profil.besoins.includes(besoin.id);
                  return (
                    <button
                      key={besoin.id}
                      onClick={() => {
                        if (selected) {
                          updateProfil('besoins', profil.besoins.filter(b => b !== besoin.id));
                        } else if (profil.besoins.length < 5) {
                          updateProfil('besoins', [...profil.besoins, besoin.id]);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-light-blue hover:border-salmon'
                      }`}
                    >
                      <span className="text-xl">{besoin.icone}</span>
                      <span className="text-sm font-medium text-dark">{besoin.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-dark/40 mt-3">{profil.besoins.length}/5 sélectionnés</p>
            </div>
          )}

          {/* ÉTAPE 5 — RGPD + Récap */}
          {etape === 4 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-2">Récapitulatif</h2>
              <p className="text-sm text-dark/60 mb-6">Vérifiez vos informations avant de commencer.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-light-blue">
                  <span className="text-sm text-dark/60">Situation</span>
                  <span className="text-sm font-medium text-dark">
                    {data.stadesPerinataux.find(s => s.id === profil.stade)?.label || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-light-blue">
                  <span className="text-sm text-dark/60">Commune</span>
                  <span className="text-sm font-medium text-dark">{profil.commune || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-light-blue">
                  <span className="text-sm text-dark/60">Zone</span>
                  <span className="text-sm font-medium text-dark">{profil.zone || '-'}</span>
                </div>
                {needsGrossesseStep && (
                  <>
                    <div className="flex justify-between py-2 border-b border-light-blue">
                      <span className="text-sm text-dark/60">SA</span>
                      <span className="text-sm font-medium text-dark">{profil.semainesAmenorrhee} SA</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-light-blue">
                      <span className="text-sm text-dark/60">DPA</span>
                      <span className="text-sm font-medium text-dark">{profil.dpa || '-'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-2 border-b border-light-blue">
                  <span className="text-sm text-dark/60">Besoins</span>
                  <span className="text-sm font-medium text-dark">{profil.besoins.length} sélectionnés</span>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-light-blue bg-bg cursor-pointer">
                <input
                  type="checkbox"
                  checked={profil.rgpd}
                  onChange={e => updateProfil('rgpd', e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-dark flex items-center gap-2">
                    <Shield size={16} className="text-olive" /> Protection de vos données
                  </p>
                  <p className="text-xs text-dark/60 mt-1">
                    J'accepte le traitement de mes données de santé conformément au RGPD. 
                    Mes informations ne seront jamais partagées sans mon consentement.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {etape > 0 ? (
              <Button variant="ghost" onClick={prev} size="sm">
                <ChevronLeft size={18} /> Retour
              </Button>
            ) : (
              <div />
            )}

            {etape < ETAPES.length - 1 ? (
              <Button onClick={next} size="sm" disabled={etape === 0 && !profil.stade}>
                Suivant <ChevronRight size={18} />
              </Button>
            ) : (
              <Button onClick={finish} size="sm" disabled={!profil.rgpd}>
                Commencer mon parcours <Check size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
