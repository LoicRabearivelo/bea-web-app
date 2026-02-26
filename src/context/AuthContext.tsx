import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import data from '../data/data.json';

export interface Utilisateur {
  id: string;
  type: 'patient' | 'professionnel';
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone?: string;
  zone?: string;
  ville?: string;
  commune?: string;
  abonnement?: string;
  pack?: string;
  specialite?: string;
  rpps?: string;
  description?: string;
  disponibilites?: string[];
  note?: number;
  avis?: any[];
  rendezvous?: any[];
  messages?: any[];
  onboardingComplete?: boolean;
  age?: number;
  stade?: string;
  besoins?: string[];
  grossesse?: {
    saSemaines: number | null;
    dpa: string;
    rangGrossesse: number;
    typeAccouchement: string;
    partenaire: any;
  };
  enfant?: any;
  profil?: {
    stade: string;
    semainesAmenorrhee: number | null;
    dpa: string;
    rangGrossesse: number;
    typeAccouchement: string;
    antecedents: string[];
    besoins: string[];
    partenaire: any;
  };
  enfants?: any[];
  portefeuille?: any;
  [key: string]: any;
}

interface InscriptionData {
  type: 'patient' | 'professionnel';
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone?: string;
  specialite?: string;
  zone?: string;
  ville?: string;
}

interface AuthContextType {
  utilisateur: Utilisateur | null;
  connecter: (email: string, motDePasse: string) => Promise<boolean>;
  inscrire: (data: InscriptionData) => Promise<boolean>;
  deconnecter: () => void;
  mettreAJourUtilisateur: (data: Partial<Utilisateur>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setUtilisateur(JSON.parse(saved));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const connecter = async (email: string, motDePasse: string): Promise<boolean> => {
    const user = data.utilisateurs.find(
      (u: any) => u.email === email && u.motDePasse === motDePasse
    );
    if (user) {
      // Check for onboarding profile from localStorage
      const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
      const mergedUser = savedProfile ? { ...user, ...JSON.parse(savedProfile) } : user;
      setUtilisateur(mergedUser as Utilisateur);
      localStorage.setItem('currentUser', JSON.stringify(mergedUser));
      return true;
    }
    return false;
  };

  const inscrire = async (inscriptionData: InscriptionData): Promise<boolean> => {
    const exists = data.utilisateurs.find((u: any) => u.email === inscriptionData.email);
    if (exists) return false;
    
    const newUser: Utilisateur = {
      id: `${inscriptionData.type === 'patient' ? 'pat' : 'pro'}-${Date.now()}`,
      ...inscriptionData,
      onboardingComplete: false,
      abonnement: inscriptionData.type === 'patient' ? 'gratuit' : undefined,
      profil: inscriptionData.type === 'patient' ? {
        stade: '',
        semainesAmenorrhee: null,
        dpa: '',
        rangGrossesse: 1,
        typeAccouchement: '',
        antecedents: [],
        besoins: [],
        partenaire: null,
      } : undefined,
      enfants: inscriptionData.type === 'patient' ? [] : undefined,
      portefeuille: inscriptionData.type === 'patient' ? { notes: [], documents: [] } : undefined,
      messages: [],
    };
    
    setUtilisateur(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const deconnecter = () => {
    setUtilisateur(null);
    localStorage.removeItem('currentUser');
  };

  const mettreAJourUtilisateur = (updates: Partial<Utilisateur>) => {
    if (!utilisateur) return;
    const updated = { ...utilisateur, ...updates };
    setUtilisateur(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    localStorage.setItem(`userProfile_${utilisateur.id}`, JSON.stringify(updates));
  };

  return (
    <AuthContext.Provider value={{ utilisateur, connecter, inscrire, deconnecter, mettreAJourUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
}
