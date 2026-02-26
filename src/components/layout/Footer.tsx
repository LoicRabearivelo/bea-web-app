import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60 text-center text-xs py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-white/40">
          <span>Mentions légales</span>
          <span>RGPD</span>
          <span>Contact</span>
        </div>
        <p className="text-white/50">Coordinateur de Vie — La Réunion | © 2025</p>
        <p className="font-semibold text-white/70">
          ⚠️ Nous ne remplaçons pas un vrai professionnel de santé
        </p>
      </div>
    </footer>
  );
}
