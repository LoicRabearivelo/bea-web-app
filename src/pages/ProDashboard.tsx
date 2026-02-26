import React, { useState } from 'react';
import { Calendar, Users, Star, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';

type TabKey = 'agenda' | 'demandes' | 'avis';

export default function ProDashboard() {
  const { utilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('agenda');

  if (!utilisateur) return null;

  const rdvs = (utilisateur as any).rendezvous || [];
  const avis = (utilisateur as any).avis || [];
  const rdvConfirmes = rdvs.filter((r: any) => r.statut === 'confirme');
  const rdvEnAttente = rdvs.filter((r: any) => r.statut === 'en_attente');
  const messagesCount = (utilisateur.messages || []).reduce((acc: number, conv: any) => acc + (conv.messages?.length || 0), 0);

  const kpis = [
    { label: "RDV aujourd'hui", value: rdvConfirmes.length, icon: <Calendar className="text-primary" size={20} />, color: 'text-primary' },
    { label: 'Demandes en attente', value: rdvEnAttente.length, icon: <Clock className="text-gold" size={20} />, color: 'text-gold' },
    { label: 'RDV à venir', value: rdvs.length, icon: <Users className="text-olive" size={20} />, color: 'text-olive' },
    { label: 'Messages', value: messagesCount, icon: <MessageSquare className="text-salmon" size={20} />, color: 'text-salmon' },
  ];

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'agenda', label: 'Agenda', icon: <Calendar size={16} /> },
    { key: 'demandes', label: 'Demandes', icon: <Clock size={16} /> },
    { key: 'avis', label: 'Avis', icon: <Star size={16} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">
          {utilisateur.prenom} {utilisateur.nom}
        </h1>
        <Badge variant="olive">{utilisateur.specialite}</Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} className="text-center">
            <div className="flex justify-center mb-2">{kpi.icon}</div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-dark/50 mt-1">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-light-blue/50 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-dark/60 hover:text-dark'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Agenda */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          {rdvs.length === 0 ? (
            <Card><p className="text-dark/60 text-center py-4">Aucun rendez-vous prévu</p></Card>
          ) : (
            rdvs.map((rdv: any) => (
              <Card key={rdv.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-dark truncate">{rdv.patientNom}</p>
                  <p className="text-sm text-dark/60">{rdv.motif}</p>
                  <p className="text-xs text-dark/40 mt-1">{rdv.date} à {rdv.heure}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={rdv.statut === 'confirme' ? 'olive' : 'gold'}>
                    {rdv.statut === 'confirme' ? 'Confirmé' : 'En attente'}
                  </Badge>
                  {rdv.statut === 'en_attente' && (
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-olive/10 hover:bg-olive/20 transition-colors">
                        <CheckCircle size={16} className="text-olive" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                        <XCircle size={16} className="text-primary" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Demandes */}
      {activeTab === 'demandes' && (
        <div className="space-y-4">
          {rdvEnAttente.length === 0 ? (
            <Card><p className="text-dark/60 text-center py-4">Aucune demande en attente</p></Card>
          ) : (
            rdvEnAttente.map((rdv: any) => (
              <Card key={rdv.id}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-dark truncate">{rdv.patientNom}</p>
                    <p className="text-sm text-dark/60">{rdv.motif}</p>
                    <p className="text-xs text-dark/40 mt-1">{rdv.date} à {rdv.heure}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="primary" size="sm">Confirmer</Button>
                    <Button variant="secondary" size="sm">Refuser</Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Avis */}
      {activeTab === 'avis' && (
        <div className="space-y-4">
          {avis.length === 0 ? (
            <Card><p className="text-dark/60 text-center py-4">Aucun avis pour le moment</p></Card>
          ) : (
            avis.map((a: any, i: number) => (
              <Card key={i}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-dark mb-1">{a.auteur}</p>
                    <StarRating note={a.note} size={14} />
                    <p className="text-sm text-dark/70 mt-2">{a.commentaire}</p>
                  </div>
                  <span className="text-xs text-dark/40">{a.date}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
