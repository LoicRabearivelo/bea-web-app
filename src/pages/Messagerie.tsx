import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Messagerie() {
  const { utilisateur } = useAuth();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = utilisateur?.messages || [];
  const currentConv = conversations.find((c: any) => c.id === selectedConv);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !currentConv) return;
    // In a real app, this would save to localStorage
    // For demo, just show the message
    const msg = {
      expediteurId: utilisateur?.id,
      contenu: newMessage,
      horodatage: new Date().toISOString(),
    };
    currentConv.messages.push(msg);
    setNewMessage('');
  };

  if (!utilisateur) return null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6">Messagerie</h1>

      <div className="grid lg:grid-cols-3 gap-6 min-h-[60vh]">
        {/* Conversations list */}
        <div className={`lg:block ${selectedConv ? 'hidden' : 'block'}`}>
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <Card>
                <p className="text-dark/60 text-center py-4">Aucune conversation</p>
                <p className="text-xs text-dark/40 text-center">
                  Trouvez un professionnel dans l'annuaire pour commencer à échanger.
                </p>
              </Card>
            ) : (
              conversations.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedConv === conv.id
                      ? 'border-primary bg-primary/5'
                      : 'border-light-blue bg-white/80 hover:border-salmon'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                      {conv.avecNom?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm truncate">{conv.avecNom}</p>
                      {conv.messages?.length > 0 && (
                        <p className="text-xs text-dark/50 truncate">
                          {conv.messages[conv.messages.length - 1].contenu}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`lg:col-span-2 ${!selectedConv ? 'hidden lg:flex' : 'flex'} flex-col`}>
          {!currentConv ? (
            <Card className="flex-1 flex items-center justify-center">
              <p className="text-dark/50">Sélectionnez une conversation</p>
            </Card>
          ) : (
            <div className="flex flex-col h-full bg-white/80 border border-light-blue rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-light-blue">
                <button
                  onClick={() => setSelectedConv(null)}
                  className="lg:hidden p-1 rounded-lg hover:bg-light-blue"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                  {currentConv.avecNom?.charAt(0)}
                </div>
                <p className="font-semibold text-dark">{currentConv.avecNom}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentConv.messages.map((msg: any, i: number) => {
                  const isMe = msg.expediteurId === utilisateur.id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-light-blue text-dark rounded-bl-md'
                        }`}
                      >
                        <p>{msg.contenu}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-dark/40'}`}>
                          {new Date(msg.horodatage).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-light-blue">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrire un message..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-light-blue bg-bg focus:outline-none focus:border-primary text-sm"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
