import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Send, RotateCcw, Flower2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useResponsive } from '../hooks/useResponsive';
import Button from '../components/ui/Button';
import data from '../data/data.json';

/** Lightweight markdown renderer for chat messages */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) elements.push(<br key={`br-${lineIdx}`} />);

    // Numbered list: "1. text"
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      elements.push(
        <span key={`ol-${lineIdx}`} className="flex gap-1.5 mt-1">
          <span className="text-primary font-bold shrink-0">{olMatch[1]}.</span>
          <span>{inlineMarkdown(olMatch[2], lineIdx)}</span>
        </span>
      );
      return;
    }

    // Bullet list: "- text"
    const ulMatch = line.match(/^[-•]\s+(.*)$/);
    if (ulMatch) {
      elements.push(
        <span key={`ul-${lineIdx}`} className="flex gap-1.5 mt-0.5 items-start">
          <span className="shrink-0 mt-0.5">•</span>
          <span>{inlineMarkdown(ulMatch[1], lineIdx)}</span>
        </span>
      );
      return;
    }

    elements.push(<span key={`line-${lineIdx}`}>{inlineMarkdown(line, lineIdx)}</span>);
  });

  return elements;
}

/** Parse inline markdown: **bold**, [text](url) */
function inlineMarkdown(text: string, lineIdx: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex: **bold** or [link text](url)
  const regex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // **bold**
      parts.push(<strong key={`b-${lineIdx}-${partIdx}`} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      // [text](url)
      parts.push(
        <a
          key={`a-${lineIdx}-${partIdx}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary break-all"
        >
          {match[4]}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
    partIdx++;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function QualificationForm({ onSubmit }: { onSubmit: (profile: { age: number; stade: string; commune: string }) => void }) {
  const { utilisateur } = useAuth();
  const [age, setAge] = useState(utilisateur?.age || 28);
  const [stade, setStade] = useState(utilisateur?.stade || '');
  const [commune, setCommune] = useState(utilisateur?.commune || '');

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-2">
        <p className="text-3xl mb-1">🌺</p>
        <h3 className="font-bold text-dark">Bienvenue !</h3>
        <p className="text-xs text-dark/50">Pour personnaliser mes réponses, dites-moi en un peu plus sur vous</p>
      </div>

      <div>
        <label className="text-xs text-dark/50 block mb-1">Votre âge : {age} ans</label>
        <input
          type="range"
          min={14}
          max={55}
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs text-dark/50 block mb-1">Stade périnatal</label>
        <div className="grid grid-cols-2 gap-1.5">
          {data.stadesPerinataux.map(s => (
            <button
              key={s.id}
              onClick={() => setStade(s.id)}
              className={`text-xs p-2 rounded-lg border transition-all ${
                stade === s.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-light-blue text-dark/60 hover:border-primary/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-dark/50 block mb-1">Votre commune</label>
        <select
          value={commune}
          onChange={e => setCommune(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm"
        >
          <option value="">Choisir...</option>
          {data.communes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Button
        onClick={() => stade && commune && onSubmit({ age, stade, commune })}
        className="w-full"
        disabled={!stade || !commune}
      >
        C'est parti ! 🌺
      </Button>
    </div>
  );
}

export default function BeaChatbot() {
  const { utilisateur } = useAuth();
  const { messages, beaProfile, isOpen, isLoading, setIsOpen, setBeaProfile, sendMessage, resetChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  const isPatient = utilisateur?.type === 'patient';

  useEffect(() => {
    if (isPatient) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isPatient]);

  if (!isPatient) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await sendMessage(text, utilisateur?.prenom || '');
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
          aria-label="Ouvrir Béa"
        >
          <Flower2 size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bg-white shadow-2xl flex flex-col z-50 border border-light-blue overflow-hidden ${
          isMobile
            ? 'inset-0 rounded-none'
            : 'bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl'
        }`}>
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Flower2 size={20} />
              <div>
                <h3 className="font-bold text-sm">Béa</h3>
                <p className="text-[10px] opacity-80">Votre assistante périnatale</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
                title="Réinitialiser"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Qualification form or messages */}
          {!beaProfile ? (
            <div className="flex-1 overflow-y-auto">
              <QualificationForm onSubmit={setBeaProfile} />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-3">🌺</p>
                    <p className="text-sm text-dark/50">
                      Bonjour {utilisateur?.prenom} ! Je suis Béa, votre assistante. Posez-moi vos questions sur la grossesse, la maternité ou la parentalité.
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-light-blue/50 text-dark rounded-bl-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                      </div>
                      <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-dark/30'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-light-blue/50 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-dark/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-dark/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-dark/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-light-blue p-3 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Posez votre question..."
                    className="flex-1 px-3 py-2 rounded-xl border border-light-blue bg-bg text-sm focus:outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[9px] text-dark/30 text-center mt-1">
                  Béa ne remplace pas un professionnel de santé
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
