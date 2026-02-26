import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-light-blue rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
