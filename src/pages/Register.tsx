import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import data from '../data/data.json';

export default function Register() {
  const { inscrire } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'patient' as 'patient' | 'professionnel',
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    specialite: '',
    zone: '',
    ville: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await inscrire(formData);
    setLoading(false);
    if (success) {
      if (formData.type === 'patient') navigate('/onboarding');
      else navigate('/profil');
    } else {
      setError('Cet email est déjà utilisé');
    }
  };

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Béa" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark">Créer un compte</h1>
          <p className="text-dark/60 mt-2">Rejoignez la communauté Béa</p>
        </div>

        <div className="bg-white/80 border border-light-blue rounded-xl shadow-sm p-5 sm:p-8">
          {/* Type selector */}
          <div className="flex gap-2 mb-6">
            {(['patient', 'professionnel'] as const).map(type => (
              <button
                key={type}
                onClick={() => update('type', type)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  formData.type === type
                    ? 'bg-primary text-white'
                    : 'bg-light-blue/50 text-dark/60 hover:bg-light-blue'
                }`}
              >
                {type === 'patient' ? '👩 Parent' : '👨‍⚕️ Professionnel'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={e => update('prenom', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={e => update('nom', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                <input
                  type="password"
                  value={formData.motDePasse}
                  onChange={e => update('motDePasse', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={e => update('telephone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            {formData.type === 'professionnel' && (
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Spécialité</label>
                <select
                  value={formData.specialite}
                  onChange={e => update('specialite', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="Sage-femme">Sage-femme</option>
                  <option value="Gynécologue-obstétricien">Gynécologue-obstétricien</option>
                  <option value="Pédiatre">Pédiatre</option>
                  <option value="Psychologue">Psychologue</option>
                  <option value="Ostéopathe">Ostéopathe</option>
                  <option value="Diététicienne-nutritionniste">Diététicienne-nutritionniste</option>
                  <option value="Doula">Doula</option>
                  <option value="Kinésithérapeute">Kinésithérapeute</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Commune</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={16} />
                <select
                  value={formData.ville}
                  onChange={e => {
                    update('ville', e.target.value);
                    const zone = data.zonesGeographiques.find(z => z.communes.includes(e.target.value));
                    if (zone) update('zone', zone.label);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">Choisir votre commune...</option>
                  {data.communes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-dark/60">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
