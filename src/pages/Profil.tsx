import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, CreditCard, LogOut, Save, Baby } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import data from '../data/data.json';

export default function Profil() {
  const { utilisateur, mettreAJourUtilisateur, deconnecter } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    prenom: utilisateur?.prenom || '',
    nom: utilisateur?.nom || '',
    email: utilisateur?.email || '',
    telephone: utilisateur?.telephone || '',
    commune: utilisateur?.commune || '',
    specialite: utilisateur?.specialite || '',
  });

  if (!utilisateur) return null;

  const isPro = utilisateur.type === 'professionnel';
  const zone = data.zonesGeographiques.find(z => z.communes.includes(form.commune));

  const handleSave = () => {
    mettreAJourUtilisateur({ ...form });
    setEditing(false);
  };

  const offres = isPro ? data.offres.btob : data.offres.btoc;
  const currentOffre = offres.find((o: any) => o.id === utilisateur.abonnement) || offres[0];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Mon profil</h1>
        <div className="flex gap-2 flex-shrink-0">
          {editing ? (
            <Button size="sm" onClick={handleSave}><Save size={14} /> Enregistrer</Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Modifier</Button>
          )}
          <Button size="sm" variant="ghost" onClick={deconnecter}>
            <LogOut size={14} /> Déconnexion
          </Button>
        </div>
      </div>

      {/* Avatar + nom */}
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={form.prenom}
                  onChange={e => setForm(prev => ({ ...prev, prenom: e.target.value }))}
                  className="flex-1 px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
                  placeholder="Prénom"
                />
                <input
                  value={form.nom}
                  onChange={e => setForm(prev => ({ ...prev, nom: e.target.value }))}
                  className="flex-1 px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
                  placeholder="Nom"
                />
              </div>
            ) : (
              <h2 className="text-lg font-bold text-dark">{utilisateur.prenom} {utilisateur.nom}</h2>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isPro ? 'blue' : 'primary'}>
                {isPro ? 'Professionnel' : 'Patient'}
              </Badge>
              {isPro && utilisateur.specialite && (
                <Badge variant="olive">{utilisateur.specialite}</Badge>
              )}
              {!isPro && utilisateur.stade && (
                <Badge variant="gold">{utilisateur.stade}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Coordonnées */}
      <Card className="mb-4">
        <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
          <Mail size={16} /> Coordonnées
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-dark/50">Email</label>
            {editing ? (
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm text-dark flex items-center gap-1"><Mail size={12} className="text-dark/30" /> {utilisateur.email}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">Téléphone</label>
            {editing ? (
              <input
                type="tel"
                value={form.telephone}
                onChange={e => setForm(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              />
            ) : (
              <p className="text-sm text-dark flex items-center gap-1"><Phone size={12} className="text-dark/30" /> {utilisateur.telephone || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-dark/50">Commune</label>
            {editing ? (
              <select
                value={form.commune}
                onChange={e => setForm(prev => ({ ...prev, commune: e.target.value }))}
                className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
              >
                <option value="">Non renseigné</option>
                {data.communes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-dark flex items-center gap-1">
                <MapPin size={12} className="text-dark/30" />
                {utilisateur.commune || '—'}
                {zone && <Badge variant="salmon" className="ml-2 text-[10px]">{zone.label}</Badge>}
              </p>
            )}
          </div>
          {isPro && (
            <div>
              <label className="text-xs text-dark/50">Spécialité</label>
              {editing ? (
                <select
                  value={form.specialite || ''}
                  onChange={e => setForm(prev => ({ ...prev, specialite: e.target.value }))}
                  className="w-full px-2 py-1 rounded-lg border border-light-blue text-sm bg-bg"
                >
                  <option value="">—</option>
                  <option>Sage-femme</option>
                  <option>Gynécologue</option>
                  <option>Pédiatre</option>
                  <option>Psychologue</option>
                  <option>Diététicien(ne)</option>
                  <option>Ostéopathe</option>
                  <option>Doula</option>
                </select>
              ) : (
                <p className="text-sm text-dark">{utilisateur.specialite || '—'}</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Abonnement */}
      <Card className="mb-4">
        <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
          <CreditCard size={16} /> Mon abonnement
        </h2>
        <div className="bg-bg rounded-xl p-4 border border-light-blue mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-dark">{currentOffre?.nom || 'Gratuit'}</h3>
            <span className="text-primary font-bold">{currentOffre?.prix || '0 €'}</span>
          </div>
          <ul className="space-y-1">
            {(currentOffre as any)?.avantages?.map((av: string, i: number) => (
              <li key={i} className="text-xs text-dark/60 flex items-center gap-1">
                <span className="text-olive">✓</span> {av}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {offres.filter(o => o.id !== utilisateur.abonnement).map(o => (
            <button
              key={o.id}
              onClick={() => mettreAJourUtilisateur({ abonnement: o.id })}
              className="p-3 rounded-xl border border-light-blue text-left hover:border-primary transition-all"
            >
              <p className="font-medium text-dark text-sm">{o.nom}</p>
              <p className="text-xs text-primary font-bold">{o.prix}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Info périnatalité (patient only) */}
      {!isPro && (
        <Card className="mb-4">
          <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
            <Baby size={16} /> Infos périnatalité
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs text-dark/50">Stade</label>
              <p className="text-dark">{utilisateur.stade || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-dark/50">Zone</label>
              <p className="text-dark">{utilisateur.zone || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-dark/50">SA (semaines d'aménorrhée)</label>
              <p className="text-dark">{utilisateur.grossesse?.saSemaines ? `${utilisateur.grossesse.saSemaines} SA` : '—'}</p>
            </div>
            <div>
              <label className="text-xs text-dark/50">Date prévue d'accouchement</label>
              <p className="text-dark">{utilisateur.grossesse?.dpa || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-dark/50">Rang de grossesse</label>
              <p className="text-dark">{utilisateur.grossesse?.rangGrossesse || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-dark/50">Type d'accouchement souhaité</label>
              <p className="text-dark">{utilisateur.grossesse?.typeAccouchement || '—'}</p>
            </div>
          </div>
          {utilisateur.besoins && utilisateur.besoins.length > 0 && (
            <div className="mt-4">
              <label className="text-xs text-dark/50">Besoins identifiés</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {utilisateur.besoins.map((b: string) => (
                  <Badge key={b} variant="salmon" className="text-xs">{b}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* RGPD */}
      <Card>
        <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
          <Shield size={16} /> Données personnelles
        </h2>
        <p className="text-xs text-dark/50 mb-3">
          Vos données sont stockées localement sur votre appareil. Aucune donnée sensible n'est transmise
          à des tiers sans votre consentement. RGPD conforme.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const blob = new Blob([JSON.stringify(utilisateur, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `mes-donnees-bea-${utilisateur.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Exporter mes données
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ?')) {
                localStorage.clear();
                deconnecter();
              }
            }}
            className="text-red-500 hover:text-red-700"
          >
            Supprimer mon compte
          </Button>
        </div>
      </Card>
    </div>
  );
}
