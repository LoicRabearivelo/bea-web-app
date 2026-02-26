import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Lock, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import data from '../data/data.json';

type TabKey = 'faq' | 'forum';

export default function Communaute() {
  const { utilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('faq');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ titre: '', contenu: '', categorie: 'Grossesse' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [forumPosts, setForumPosts] = useState(data.forum);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const isPremium = utilisateur?.abonnement && utilisateur.abonnement !== 'gratuit';
  const isPatient = utilisateur?.type === 'patient';

  const handleNewPost = () => {
    if (!newPost.titre || !newPost.contenu) return;
    const post = {
      id: `post-${Date.now()}`,
      auteurId: utilisateur?.id || '',
      auteurNom: `${utilisateur?.prenom} ${utilisateur?.nom?.charAt(0)}.`,
      categorie: newPost.categorie,
      titre: newPost.titre,
      contenu: newPost.contenu,
      date: new Date().toISOString().split('T')[0],
      reponses: [],
    };
    setForumPosts(prev => [post, ...prev]);
    setNewPost({ titre: '', contenu: '', categorie: 'Grossesse' });
    setShowNewPost(false);
  };

  const handleReply = (postId: string) => {
    const text = replyText[postId];
    if (!text) return;
    setForumPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              reponses: [
                ...p.reponses,
                {
                  auteurId: utilisateur?.id || '',
                  auteurNom: `${utilisateur?.prenom} ${utilisateur?.nom?.charAt(0)}.${utilisateur?.type === 'professionnel' ? ` (${utilisateur.specialite})` : ''}`,
                  contenu: text,
                  date: new Date().toISOString().split('T')[0],
                },
              ],
            }
          : p
      )
    );
    setReplyText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6">Communauté</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-light-blue/50 p-1 rounded-xl">
        {([
          { key: 'faq' as TabKey, label: 'Questions fréquentes' },
          { key: 'forum' as TabKey, label: 'Forum' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-dark/60 hover:text-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {data.faq.map(faq => (
            <Card key={faq.id} className="p-0 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${faq.repondue ? 'bg-olive' : 'bg-gold'}`} />
                  <h3 className="font-medium text-dark text-sm">{faq.question}</h3>
                </div>
                {expandedFaq === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 border-t border-light-blue pt-3">
                  {faq.repondue && faq.reponse ? (
                    <div>
                      <p className="text-sm text-dark/70">{faq.reponse}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-dark/40">
                        <span className="font-medium">{faq.auteur}</span>
                        <span>•</span>
                        <span>{faq.dateReponse}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-dark/50 italic">Cette question n'a pas encore reçu de réponse.</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Forum */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* Premium banner for free users */}
          {isPatient && !isPremium && (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center gap-3">
              <Lock size={20} className="text-gold" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-dark">Contenu réservé aux abonnés</p>
                <p className="text-xs text-dark/60">Passez à une offre payante pour participer au forum</p>
              </div>
              <Badge variant="gold">Premium</Badge>
            </div>
          )}

          {/* New post button */}
          {(isPremium || utilisateur?.type === 'professionnel') && (
            <div>
              {!showNewPost ? (
                <Button onClick={() => setShowNewPost(true)} variant="secondary" size="sm">
                  <MessageCircle size={16} /> Nouveau sujet
                </Button>
              ) : (
                <Card>
                  <h3 className="font-bold text-dark mb-3">Nouveau sujet</h3>
                  <div className="space-y-3">
                    <select
                      value={newPost.categorie}
                      onChange={e => setNewPost(prev => ({ ...prev, categorie: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm"
                    >
                      <option>Grossesse</option>
                      <option>Post-partum</option>
                      <option>Allaitement</option>
                      <option>Santé mentale</option>
                      <option>Nutrition</option>
                      <option>Général</option>
                    </select>
                    <input
                      type="text"
                      value={newPost.titre}
                      onChange={e => setNewPost(prev => ({ ...prev, titre: e.target.value }))}
                      placeholder="Titre du sujet..."
                      className="w-full px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm"
                    />
                    <textarea
                      value={newPost.contenu}
                      onChange={e => setNewPost(prev => ({ ...prev, contenu: e.target.value }))}
                      placeholder="Votre message..."
                      className="w-full px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm resize-none h-24"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleNewPost} size="sm">Publier</Button>
                      <Button variant="ghost" onClick={() => setShowNewPost(false)} size="sm">Annuler</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Posts */}
          {forumPosts.map(post => (
            <Card key={post.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="olive" className="text-[10px] mb-1">{post.categorie}</Badge>
                  <h3 className="font-bold text-dark">{post.titre}</h3>
                </div>
                <span className="text-xs text-dark/40">{post.date}</span>
              </div>
              <p className="text-sm text-dark/70 mb-4">{post.contenu}</p>
              <p className="text-xs text-dark/50 mb-4">Par {post.auteurNom}</p>

              {/* Replies */}
              {post.reponses.length > 0 && (
                <div className="space-y-3 border-t border-light-blue pt-3">
                  {post.reponses.map((rep: any, i: number) => (
                    <div key={i} className="bg-bg rounded-lg p-3 ml-4 border-l-2 border-primary/30">
                      <p className="text-sm text-dark/70">{rep.contenu}</p>
                      <div className="flex gap-2 mt-2 text-xs text-dark/40">
                        <span className="font-medium">{rep.auteurNom}</span>
                        <span>•</span>
                        <span>{rep.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {(isPremium || utilisateur?.type === 'professionnel') && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-light-blue">
                  <input
                    type="text"
                    value={replyText[post.id] || ''}
                    onChange={e => setReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleReply(post.id)}
                    placeholder="Répondre..."
                    className="flex-1 px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm"
                  />
                  <button
                    onClick={() => handleReply(post.id)}
                    className="p-2 rounded-xl bg-primary text-white hover:opacity-90 transition-all"
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
