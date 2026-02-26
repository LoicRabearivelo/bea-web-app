import React, { useState } from 'react';
import { Clock, User, ArrowLeft, Tag } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import data from '../data/data.json';

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Toutes');

  const categories = ['Toutes', ...Array.from(new Set(data.articles.map(a => a.categorie)))];
  const filtered = categoryFilter === 'Toutes'
    ? data.articles
    : data.articles.filter(a => a.categorie === categoryFilter);

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-primary text-sm mb-6 hover:underline"
        >
          <ArrowLeft size={16} /> Retour aux articles
        </button>
        <article>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="olive">{selectedArticle.categorie}</Badge>
            <span className="text-xs text-dark/40">{selectedArticle.tempsLecture}</span>
          </div>
          <div className="text-4xl mb-4">{selectedArticle.icone}</div>
          <h1 className="text-2xl font-bold text-dark mb-3">{selectedArticle.titre}</h1>
          <div className="flex items-center gap-3 text-sm text-dark/50 mb-6">
            <span className="flex items-center gap-1"><User size={14} /> {selectedArticle.auteur}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {selectedArticle.tempsLecture}</span>
          </div>
          <Card className="prose max-w-none">
            <p className="text-dark/70 leading-relaxed whitespace-pre-line">{selectedArticle.contenu}</p>
          </Card>
          <div className="flex gap-2 mt-4 flex-wrap">
            {selectedArticle.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-light-blue/50 text-dark/60 px-2 py-1 rounded-full">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-dark mb-2">Articles & Ressources</h1>
      <p className="text-dark/60 text-sm mb-6">Informations validées par des professionnels de la périnatalité</p>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              categoryFilter === cat
                ? 'bg-primary text-white'
                : 'bg-light-blue/50 text-dark/60 hover:bg-light-blue'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(article => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="text-3xl mb-3">{article.icone}</div>
            <Badge variant="olive" className="text-[10px] mb-2">{article.categorie}</Badge>
            <h2 className="font-bold text-dark mb-2 group-hover:text-primary transition-colors">
              {article.titre}
            </h2>
            <p className="text-xs text-dark/60 mb-3 line-clamp-2">{article.extrait}</p>
            <div className="flex items-center justify-between text-xs text-dark/40">
              <span className="flex items-center gap-1"><User size={12} /> {article.auteur}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.tempsLecture}</span>
            </div>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {article.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-[10px] bg-bg text-dark/50 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
