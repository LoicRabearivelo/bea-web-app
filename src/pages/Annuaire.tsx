import React, { useState } from 'react';
import { Search, MapPin, Phone, Mail as MailIcon, Clock, ChevronDown, ChevronUp, RotateCcw, CalendarPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import data from '../data/data.json';

export default function Annuaire() {
  const { utilisateur } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rdvModal, setRdvModal] = useState<string | null>(null);
  const [rdvData, setRdvData] = useState({ date: '', heure: '', motif: '' });

  const specialites = Array.from(new Set(data.professionnels.map(p => p.specialite)));

  const filteredPros = data.professionnels.filter(pro => {
    const matchSearch = !searchText || 
      `${pro.prenom} ${pro.nom} ${pro.specialite} ${pro.description}`.toLowerCase().includes(searchText.toLowerCase());
    const matchSpecialite = !filterSpecialite || pro.specialite === filterSpecialite;
    const matchZone = !filterZone || pro.zone === filterZone;
    return matchSearch && matchSpecialite && matchZone;
  });

  const resetFilters = () => {
    setSearchText('');
    setFilterSpecialite('');
    setFilterZone('');
  };

  const handleRdv = (proId: string) => {
    // Save to localStorage
    const rdvsKey = `rdv_${utilisateur?.id}`;
    const existing = JSON.parse(localStorage.getItem(rdvsKey) || '[]');
    existing.push({
      id: `rdv-${Date.now()}`,
      proId,
      ...rdvData,
      statut: 'en_attente',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(rdvsKey, JSON.stringify(existing));
    setRdvModal(null);
    setRdvData({ date: '', heure: '', motif: '' });
    alert('Demande de rendez-vous envoyée !');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Annuaire des professionnels</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={18} />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Rechercher un professionnel..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <select
          value={filterSpecialite}
          onChange={e => setFilterSpecialite(e.target.value)}
          className="px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
        >
          <option value="">Toutes spécialités</option>
          {specialites.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterZone}
          onChange={e => setFilterZone(e.target.value)}
          className="px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
        >
          <option value="">Toutes zones</option>
          {data.zonesGeographiques.map(z => <option key={z.id} value={z.label}>{z.label}</option>)}
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-3 rounded-xl border border-light-blue text-dark/60 hover:bg-light-blue transition-colors text-sm flex items-center gap-2"
        >
          <RotateCcw size={16} /> Réinitialiser
        </button>
      </div>

      <p className="text-sm text-dark/50 mb-4">{filteredPros.length} professionnel{filteredPros.length > 1 ? 's' : ''} trouvé{filteredPros.length > 1 ? 's' : ''}</p>

      {/* Results */}
      <div className="space-y-4">
        {filteredPros.map(pro => (
          <Card key={pro.id} className="p-0 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                    {pro.prenom.charAt(0)}{pro.nom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{pro.prenom} {pro.nom}</h3>
                    <Badge variant="olive">{pro.specialite}</Badge>
                    <div className="flex items-center gap-3 mt-1">
                      <StarRating note={pro.note} size={14} />
                      <span className="text-xs text-dark/50">({pro.nombreAvis} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">
                    <MapPin size={12} className="mr-1" />{pro.zone}
                  </Badge>
                  <button
                    onClick={() => setExpandedId(expandedId === pro.id ? null : pro.id)}
                    className="p-2 rounded-lg hover:bg-light-blue transition-colors"
                  >
                    {expandedId === pro.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-dark/60 mt-3">{pro.description}</p>
            </div>

            {/* Expanded details */}
            {expandedId === pro.id && (
              <div className="px-6 pb-6 pt-0 border-t border-light-blue mt-0 pt-4 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-dark/50 uppercase mb-2">Contact</p>
                    <div className="space-y-1.5">
                      <p className="text-sm text-dark/70 flex items-center gap-2">
                        <Phone size={14} className="text-primary" /> {pro.telephone}
                      </p>
                      <p className="text-sm text-dark/70 flex items-center gap-2">
                        <MailIcon size={14} className="text-primary" /> {pro.email}
                      </p>
                      <p className="text-sm text-dark/70 flex items-center gap-2">
                        <MapPin size={14} className="text-primary" /> {pro.ville}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-dark/50 uppercase mb-2">Spécialisations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pro.specialisations.map((s, i) => (
                        <Badge key={i} variant="salmon">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-dark/50 uppercase mb-2">Disponibilités</p>
                  <div className="flex flex-wrap gap-2">
                    {pro.disponibilites.map((d, i) => (
                      <span key={i} className="text-xs bg-bg px-3 py-1.5 rounded-lg border border-light-blue flex items-center gap-1">
                        <Clock size={12} className="text-olive" /> {d}
                      </span>
                    ))}
                  </div>
                </div>

                {pro.avis.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-dark/50 uppercase mb-2">Avis récents</p>
                    <div className="space-y-2">
                      {pro.avis.map((a, i) => (
                        <div key={i} className="bg-bg rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-dark">{a.auteur}</span>
                            <span className="text-xs text-dark/40">{a.date}</span>
                          </div>
                          <StarRating note={a.note} size={12} />
                          <p className="text-sm text-dark/70 mt-1">{a.commentaire}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {utilisateur?.type === 'patient' && (
                  <Button onClick={() => setRdvModal(pro.id)} className="w-full sm:w-auto">
                    <CalendarPlus size={16} /> Prendre rendez-vous
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* RDV Modal */}
      <Modal
        isOpen={!!rdvModal}
        onClose={() => setRdvModal(null)}
        title="Prendre rendez-vous"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Date</label>
            <input
              type="date"
              value={rdvData.date}
              onChange={e => setRdvData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Heure</label>
            <input
              type="time"
              value={rdvData.heure}
              onChange={e => setRdvData(prev => ({ ...prev, heure: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Motif</label>
            <textarea
              value={rdvData.motif}
              onChange={e => setRdvData(prev => ({ ...prev, motif: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary resize-none h-24"
              placeholder="Motif de la consultation..."
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => rdvModal && handleRdv(rdvModal)} className="flex-1">
              Confirmer
            </Button>
            <Button variant="secondary" onClick={() => setRdvModal(null)} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
