import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface BeaProfile {
  age: number;
  stade: string;
  commune: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  beaProfile: BeaProfile | null;
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  setBeaProfile: (profile: BeaProfile) => void;
  sendMessage: (message: string, prenom: string) => Promise<void>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [beaProfile, setBeaProfileState] = useState<BeaProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('beaProfile');
    if (savedProfile) {
      try { setBeaProfileState(JSON.parse(savedProfile)); } catch {}
    }
    const savedHistory = localStorage.getItem('beaHistory');
    if (savedHistory) {
      try { setMessages(JSON.parse(savedHistory)); } catch {}
    }
  }, []);

  const setBeaProfile = (profile: BeaProfile) => {
    setBeaProfileState(profile);
    localStorage.setItem('beaProfile', JSON.stringify(profile));
  };

  const sendMessage = async (message: string, prenom: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    localStorage.setItem('beaHistory', JSON.stringify(newMessages));
    setIsLoading(true);

    try {
      const response = await fetch('https://bea-chatbot.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          age: beaProfile?.age ?? 25,
          stade: beaProfile?.stade ?? '',
          localisation: beaProfile?.commune ? `${beaProfile.commune}, 974` : 'La Réunion, 974',
        }),
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.response || data.message || data.reply || 'Merci pour votre message.',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, assistantMsg];
      setMessages(updatedMessages);
      localStorage.setItem('beaHistory', JSON.stringify(updatedMessages));
    } catch {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Je suis momentanément indisponible. Pour une aide immédiate, contactez REPERE au 0262 40 50 60',
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);
      localStorage.setItem('beaHistory', JSON.stringify(updatedMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    localStorage.removeItem('beaHistory');
  };

  return (
    <ChatContext.Provider value={{ messages, beaProfile, isOpen, isLoading, setIsOpen, setBeaProfile, sendMessage, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
}
