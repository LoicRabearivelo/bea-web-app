import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await connecter(email, password);
    setLoading(false);
    if (success) {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        const user = JSON.parse(saved);
        if (user.type === 'professionnel') navigate('/pro/tableau-de-bord');
        else if (user.type === 'patient' && !user.onboardingComplete) navigate('/onboarding');
        else navigate('/tableau-de-bord');
      }
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
    setLoading(true);
    const success = await connecter(email, password);
    setLoading(false);
    if (success) {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        const user = JSON.parse(saved);
        if (user.type === 'professionnel') navigate('/pro/tableau-de-bord');
        else if (user.type === 'patient' && !user.onboardingComplete) navigate('/onboarding');
        else navigate('/tableau-de-bord');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Béa" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark">Connexion</h1>
          <p className="text-dark/60 mt-2">Accédez à votre espace Béa</p>
        </div>

        <div className="bg-white/80 border border-light-blue rounded-xl shadow-sm p-8">
          {error && (
            <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary transition-colors"
                  placeholder="votre@email.re"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-light-blue">
            <p className="text-xs text-dark/50 text-center mb-3">Comptes de démonstration</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('patient.free@reunion.re', 'demo1234')}
                className="w-full py-2 px-4 rounded-lg border border-light-blue text-sm text-dark/70 hover:bg-light-blue/50 transition-colors text-left"
              >
                👩 Patient Free — patient.free@reunion.re
              </button>
              <button
                onClick={() => quickLogin('patient.pro@reunion.re', 'demo1234')}
                className="w-full py-2 px-4 rounded-lg border border-gold/50 text-sm text-dark/70 hover:bg-gold/10 transition-colors text-left"
              >
                👑 Patient Pro — patient.pro@reunion.re
              </button>
              <button
                onClick={() => quickLogin('sage.femme@reunion.re', 'demo1234')}
                className="w-full py-2 px-4 rounded-lg border border-olive/50 text-sm text-dark/70 hover:bg-olive/10 transition-colors text-left"
              >
                👨‍⚕️ Professionnel — sage.femme@reunion.re
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-dark/60">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-primary font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
