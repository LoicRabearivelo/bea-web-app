import React, { useState } from 'react';
import { Flower2, MapPin, Baby, Calendar } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import Button from './ui/Button';
import data from '../data/data.json';

export default function WelcomeForm() {
  const { beaProfile, setBeaProfile } = useChat();
  const [dismissed, setDismissed] = useState(false);
  const [age, setAge] = useState(28);
  const [stade, setStade] = useState('');
  const [commune, setCommune] = useState('');
  const [step, setStep] = useState(1);

  // Don't show if profile already exists or user dismissed
  if (beaProfile || dismissed) return null;

  const handleSubmit = () => {
    if (!stade || !commune) return;
    setBeaProfile({ age, stade, commune });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl shadow-2xl border border-light-blue overflow-hidden animate-in">
        {/* Header */}
        <div className="bg-primary px-6 py-5 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white" />
          </div>
          <div className="relative">
            <Flower2 size={36} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Bienvenue sur Béa 🌺</h2>
            <p className="text-sm text-white/80 mt-1">
              Votre compagnon périnatal à La Réunion
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                s === step ? 'bg-primary w-6' : s < step ? 'bg-primary' : 'bg-light-blue'
              }`}
            />
          ))}
        </div>

        <div className="p-6">
          {/* Step 1 - Age */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-salmon/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark text-lg">Quel est votre âge ?</h3>
                <p className="text-sm text-dark/50 mt-1">Pour personnaliser votre expérience</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-light-blue">
                <div className="text-center mb-3">
                  <span className="text-3xl font-bold text-primary">{age}</span>
                  <span className="text-dark/50 ml-1">ans</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={55}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-dark/30 mt-1">
                  <span>14</span>
                  <span>55</span>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2 - Stade périnatal */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-salmon/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Baby size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark text-lg">Votre situation</h3>
                <p className="text-sm text-dark/50 mt-1">Où en êtes-vous dans votre parcours ?</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.stadesPerinataux.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStade(s.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      stade === s.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-white border-light-blue hover:border-primary/30'
                    }`}
                  >
                    <p className={`text-sm font-medium ${stade === s.id ? 'text-primary' : 'text-dark'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-dark/40 mt-0.5">{s.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => stade && setStep(3)} className="flex-1" disabled={!stade}>
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 - Commune */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-salmon/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark text-lg">Votre commune</h3>
                <p className="text-sm text-dark/50 mt-1">Pour trouver les professionnels près de chez vous</p>
              </div>
              <select
                value={commune}
                onChange={e => setCommune(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-light-blue bg-white text-sm focus:border-primary focus:outline-none transition-all"
              >
                <option value="">Sélectionnez votre commune...</option>
                {data.zonesGeographiques.map(zone => (
                  <optgroup key={zone.id} label={`── ${zone.label} ──`}>
                    {zone.communes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {commune && (
                <div className="bg-olive/10 border border-olive/30 rounded-xl p-3 text-center">
                  <p className="text-xs text-dark/60">
                    📍 {commune} — {data.zonesGeographiques.find(z => z.communes.includes(commune))?.label || 'La Réunion'}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={!commune}>
                  C'est parti ! 🌺
                </Button>
              </div>
            </div>
          )}

          {/* Skip */}
          <button
            onClick={() => setDismissed(true)}
            className="w-full text-center text-xs text-dark/30 mt-4 hover:text-dark/50 transition-colors"
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
}
