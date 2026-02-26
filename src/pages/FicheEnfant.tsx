import React, { useState, useEffect } from 'react';
import { Baby, Ruler, Weight, Activity, Plus, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Mesure {
  date: string;
  poids?: number;
  taille?: number;
  pc?: number;
}

interface Jalon {
  label: string;
  dateAtteint?: string;
  fait: boolean;
}

interface Enfant {
  prenom: string;
  dateNaissance: string;
  sexe?: string;
  poidsNaissance?: number;
  tailleNaissance?: number;
  pcNaissance?: number;
  alimentation?: string;
  mesures: Mesure[];
  jalons: Jalon[];
  notes: string[];
}

const JALONS_DEFAULT: Jalon[] = [
  { label: 'Premier sourire', fait: false },
  { label: 'Tient sa tête', fait: false },
  { label: 'Se retourne', fait: false },
  { label: 'Premiers babillages', fait: false },
  { label: 'Position assise', fait: false },
  { label: 'Premiers pas à 4 pattes', fait: false },
  { label: 'Premiers mots', fait: false },
  { label: 'Se met debout', fait: false },
  { label: 'Premiers pas', fait: false },
  { label: 'Mange seul à la cuillère', fait: false },
];

export default function FicheEnfant() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth();
  const storageKey = `enfant_${utilisateur?.id}`;

  const [enfant, setEnfant] = useState<Enfant>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    // Init from user data if available
    return {
      prenom: utilisateur?.enfant?.prenom || '',
      dateNaissance: utilisateur?.enfant?.dateNaissance || '',
      sexe: utilisateur?.enfant?.sexe || '',
      poidsNaissance: utilisateur?.enfant?.poidsNaissance || undefined,
      tailleNaissance: utilisateur?.enfant?.tailleNaissance || undefined,
      pcNaissance: utilisateur?.enfant?.pcNaissance || undefined,
      alimentation: utilisateur?.enfant?.alimentation || 'allaitement',
      mesures: utilisateur?.enfant?.mesures || [],
      jalons: utilisateur?.enfant?.jalons || JALONS_DEFAULT,
      notes: utilisateur?.enfant?.notes || [],
    };
  });

  const [showAddMesure, setShowAddMesure] = useState(false);
  const [newMesure, setNewMesure] = useState<Mesure>({ date: new Date().toISOString().split('T')[0] });
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(enfant));
  }, [enfant, storageKey]);

  const ageEnMois = () => {
    if (!enfant.dateNaissance) return null;
    const naissance = new Date(enfant.dateNaissance);
    const maintenant = new Date();
    const mois = (maintenant.getFullYear() - naissance.getFullYear()) * 12 + (maintenant.getMonth() - naissance.getMonth());
    return mois;
  };

  const ageMois = ageEnMois();

  const handleAddMesure = () => {
    if (!newMesure.date) return;
    setEnfant(prev => ({
      ...prev,
      mesures: [...prev.mesures, newMesure].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setNewMesure({ date: new Date().toISOString().split('T')[0] });
    setShowAddMesure(false);
  };

  const handleToggleJalon = (index: number) => {
    setEnfant(prev => ({
      ...prev,
      jalons: prev.jalons.map((j, i) =>
        i === index ? { ...j, fait: !j.fait, dateAtteint: !j.fait ? new Date().toISOString().split('T')[0] : undefined } : j
      ),
    }));
  };

  const handleAddNote = () => {
    if (!newNote) return;
    setEnfant(prev => ({ ...prev, notes: [`${new Date().toLocaleDateString('fr-FR')} — ${newNote}`, ...prev.notes] }));
    setNewNote('');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Baby className="text-primary" /> Fiche de {enfant.prenom || 'mon enfant'}
          </h1>
          {ageMois !== null && ageMois >= 0 && (
            <p className="text-sm text-dark/50 mt-1">
              {ageMois < 1 ? 'Nouveau-né' : `${ageMois} mois`}
            </p>
          )}
        </div>
        <Button variant={editing ? 'primary' : 'secondary'} size="sm" onClick={() => setEditing(!editing)}>
          {editing ? 'Enregistrer' : 'Modifier'}
        </Button>
      </div>

      {/* Info de base */}
      <Card className="mb-4">
        <h2 className="font-bold text-dark mb-3">Informations de naissance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-dark/50">Prénom</label>
            {editing ? (
              <input
                value={enfant.prenom}
                onChange={e => setEnfant(prev => ({ ...prev, prenom: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm font-medium text-dark">{enfant.prenom || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">Date de naissance</label>
            {editing ? (
              <input
                type="date"
                value={enfant.dateNaissance}
                onChange={e => setEnfant(prev => ({ ...prev, dateNaissance: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm font-medium text-dark">
                {enfant.dateNaissance ? new Date(enfant.dateNaissance).toLocaleDateString('fr-FR') : '—'}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">Sexe</label>
            {editing ? (
              <select
                value={enfant.sexe}
                onChange={e => setEnfant(prev => ({ ...prev, sexe: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              >
                <option value="">—</option>
                <option value="F">Fille</option>
                <option value="M">Garçon</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-dark">{enfant.sexe === 'F' ? 'Fille' : enfant.sexe === 'M' ? 'Garçon' : '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50 flex items-center gap-1"><Weight size={12} /> Poids naissance (g)</label>
            {editing ? (
              <input
                type="number"
                value={enfant.poidsNaissance || ''}
                onChange={e => setEnfant(prev => ({ ...prev, poidsNaissance: Number(e.target.value) }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm font-medium text-dark">{enfant.poidsNaissance ? `${enfant.poidsNaissance} g` : '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50 flex items-center gap-1"><Ruler size={12} /> Taille naissance (cm)</label>
            {editing ? (
              <input
                type="number"
                value={enfant.tailleNaissance || ''}
                onChange={e => setEnfant(prev => ({ ...prev, tailleNaissance: Number(e.target.value) }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm font-medium text-dark">{enfant.tailleNaissance ? `${enfant.tailleNaissance} cm` : '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">PC naissance (cm)</label>
            {editing ? (
              <input
                type="number"
                value={enfant.pcNaissance || ''}
                onChange={e => setEnfant(prev => ({ ...prev, pcNaissance: Number(e.target.value) }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm font-medium text-dark">{enfant.pcNaissance ? `${enfant.pcNaissance} cm` : '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">Alimentation</label>
            {editing ? (
              <select
                value={enfant.alimentation}
                onChange={e => setEnfant(prev => ({ ...prev, alimentation: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              >
                <option value="allaitement">Allaitement</option>
                <option value="biberon">Biberon</option>
                <option value="mixte">Mixte</option>
                <option value="diversification">Diversification</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-dark capitalize">{enfant.alimentation || '—'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Courbe de croissance / mesures */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-dark flex items-center gap-2">
            <Activity size={18} className="text-olive" /> Suivi des mesures
          </h2>
          <Button size="sm" variant="secondary" onClick={() => setShowAddMesure(!showAddMesure)}>
            <Plus size={14} /> Ajouter
          </Button>
        </div>

        {showAddMesure && (
          <div className="bg-bg rounded-xl p-3 mb-4 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-dark/50">Date</label>
                <input
                  type="date"
                  value={newMesure.date}
                  onChange={e => setNewMesure(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-dark/50">Poids (g)</label>
                <input
                  type="number"
                  value={newMesure.poids || ''}
                  onChange={e => setNewMesure(prev => ({ ...prev, poids: Number(e.target.value) || undefined }))}
                  className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-dark/50">Taille (cm)</label>
                <input
                  type="number"
                  value={newMesure.taille || ''}
                  onChange={e => setNewMesure(prev => ({ ...prev, taille: Number(e.target.value) || undefined }))}
                  className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-dark/50">PC (cm)</label>
                <input
                  type="number"
                  value={newMesure.pc || ''}
                  onChange={e => setNewMesure(prev => ({ ...prev, pc: Number(e.target.value) || undefined }))}
                  className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddMesure}>Enregistrer</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddMesure(false)}>Annuler</Button>
            </div>
          </div>
        )}

        {enfant.mesures.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-blue text-left text-xs text-dark/50">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Poids (g)</th>
                  <th className="py-2 pr-4">Taille (cm)</th>
                  <th className="py-2">PC (cm)</th>
                </tr>
              </thead>
              <tbody>
                {enfant.mesures.map((m, i) => (
                  <tr key={i} className="border-b border-light-blue/50">
                    <td className="py-2 pr-4 flex items-center gap-1"><Calendar size={12} className="text-dark/30" /> {new Date(m.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-2 pr-4">{m.poids || '—'}</td>
                    <td className="py-2 pr-4">{m.taille || '—'}</td>
                    <td className="py-2">{m.pc || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-dark/40 text-center py-4">Aucune mesure enregistrée</p>
        )}
      </Card>

      {/* Jalons */}
      <Card className="mb-4">
        <h2 className="font-bold text-dark mb-3">🎯 Jalons du développement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {enfant.jalons.map((j, i) => (
            <button
              key={i}
              onClick={() => handleToggleJalon(i)}
              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                j.fait
                  ? 'bg-olive/10 border border-olive/30'
                  : 'bg-bg border border-light-blue hover:border-primary/30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                j.fait ? 'bg-olive border-olive text-white' : 'border-dark/20'
              }`}>
                {j.fait && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${j.fait ? 'line-through text-dark/50' : 'text-dark'}`}>
                  {j.label}
                </span>
                {j.dateAtteint && (
                  <span className="text-xs text-dark/40 ml-2">{new Date(j.dateAtteint).toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-dark/40 mt-3">
          {enfant.jalons.filter(j => j.fait).length}/{enfant.jalons.length} jalons atteints
        </p>
      </Card>

      {/* Notes */}
      <Card>
        <h2 className="font-bold text-dark mb-3">📝 Notes</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            placeholder="Ajouter une note..."
            className="flex-1 px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm"
          />
          <Button size="sm" onClick={handleAddNote}><Plus size={14} /></Button>
        </div>
        {enfant.notes.length > 0 ? (
          <div className="space-y-2">
            {enfant.notes.map((note, i) => (
              <div key={i} className="flex items-start justify-between bg-bg rounded-lg p-3 text-sm text-dark/70">
                <span>{note}</span>
                <button
                  onClick={() => setEnfant(prev => ({ ...prev, notes: prev.notes.filter((_, idx) => idx !== i) }))}
                  className="text-dark/30 hover:text-primary ml-2 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dark/40 text-center py-2">Aucune note</p>
        )}
      </Card>
    </div>
  );
}
