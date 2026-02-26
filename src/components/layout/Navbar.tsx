import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Search, Mail, Users, BookOpen, User, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { utilisateur, deconnecter } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    deconnecter();
    navigate('/');
  };

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path) ? 'text-primary bg-primary/10' : 'text-dark hover:text-primary hover:bg-primary/5'
    }`;

  const visitorLinks = (
    <>
      <Link to="/" className={linkClass('/')}>Accueil</Link>
      <Link to="/annuaire" className={linkClass('/annuaire')}>Annuaire</Link>
      <Link to="/articles" className={linkClass('/articles')}>Blog</Link>
      <Link to="/connexion" className={linkClass('/connexion')}>Connexion</Link>
      <Link to="/inscription" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
        Inscription
      </Link>
    </>
  );

  const patientLinks = (
    <>
      <Link to="/tableau-de-bord" className={linkClass('/tableau-de-bord')}>
        <Home size={18} /> Tableau de bord
      </Link>
      <Link to="/suivi" className={linkClass('/suivi')}>
        <Calendar size={18} /> Mon suivi
      </Link>
      <Link to="/annuaire" className={linkClass('/annuaire')}>
        <Search size={18} /> Annuaire
      </Link>
      <Link to="/messagerie" className={linkClass('/messagerie')}>
        <Mail size={18} /> Messages
      </Link>
      <Link to="/communaute" className={linkClass('/communaute')}>
        <Users size={18} /> Communauté
      </Link>
      <Link to="/articles" className={linkClass('/articles')}>
        <BookOpen size={18} /> Articles
      </Link>
      <Link to="/profil" className={linkClass('/profil')}>
        <User size={18} /> Profil
      </Link>
    </>
  );

  const proLinks = (
    <>
      <Link to="/pro/tableau-de-bord" className={linkClass('/pro/tableau-de-bord')}>
        <BarChart3 size={18} /> Mon tableau de bord
      </Link>
      <Link to="/articles" className={linkClass('/articles')}>
        <BookOpen size={18} /> Articles
      </Link>
      <Link to="/profil" className={linkClass('/profil')}>
        <User size={18} /> Mon profil
      </Link>
    </>
  );

  const links = !utilisateur ? visitorLinks : utilisateur.type === 'professionnel' ? proLinks : patientLinks;

  return (
    <nav className="bg-bg shadow-sm sticky top-0 z-40 border-b border-light-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={utilisateur?.type === 'patient' ? '/tableau-de-bord' : utilisateur?.type === 'professionnel' ? '/pro/tableau-de-bord' : '/'} className="flex items-center gap-2">
            <img src="/logo.png" alt="Béa" className="h-10" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links}
            {utilisateur && (
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-dark hover:text-primary hover:bg-primary/5 transition-colors ml-2">
                <LogOut size={18} /> Déconnexion
              </button>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-light-blue transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={menuRef} className="lg:hidden bg-bg border-t border-light-blue px-4 py-3 space-y-1 shadow-lg">
          {links}
          {utilisateur && (
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-dark hover:text-primary w-full text-left">
              <LogOut size={18} /> Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
