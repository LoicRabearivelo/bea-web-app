/* Coordinateur de Vie - Page des articles d information */
import React, { useState, useEffect, useCallback } from 'react';
import { serviceArticles } from '../services/serviceApi';
import './PageArticles.css';

function PageArticles() {
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [articleDetailId, setArticleDetailId] = useState(null);

  const chargerArticles = useCallback(async () => {
    try {
      setChargement(true);
      const parametres = {};
      if (filtreCategorie) parametres.categorie = filtreCategorie;
      const donnees = await serviceArticles.listerTous(parametres);
      setArticles(donnees);
    } catch (erreur) {
      console.error('Erreur lors du chargement des articles :', erreur);
    } finally {
      setChargement(false);
    }
  }, [filtreCategorie]);

  useEffect(() => {
    chargerArticles();
  }, [chargerArticles]);

  const categoriesArticles = [
    { valeur: 'grossesse', libelle: 'Grossesse', icone: 'fa-solid fa-person-pregnant' },
    { valeur: 'nutrition', libelle: 'Nutrition', icone: 'fa-solid fa-apple-whole' },
    { valeur: 'sante-mentale', libelle: 'Sante mentale', icone: 'fa-solid fa-brain' },
    { valeur: 'accouchement', libelle: 'Accouchement', icone: 'fa-solid fa-house-medical' },
    { valeur: 'post-partum', libelle: 'Post-partum', icone: 'fa-solid fa-baby' },
    { valeur: 'allaitement', libelle: 'Allaitement', icone: 'fa-solid fa-hand-holding-heart' }
  ];

  const obtenirIconeCategorie = (categorie) => {
    const categorieCorrespondante = categoriesArticles.find((element) => element.valeur === categorie);
    return categorieCorrespondante ? categorieCorrespondante.icone : 'fa-solid fa-file-lines';
  };

  const formaterDate = (chaineDate) => {
    return new Date(chaineDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const articleDetail = articleDetailId
    ? articles.find((article) => article.identifiant === articleDetailId)
    : null;

  if (chargement) {
    return (
      <div className="page-articles">
        <div className="conteneur">
          <div className="indicateur-chargement">
            <div className="animation-chargement"></div>
            <p>Chargement des articles...</p>
          </div>
        </div>
      </div>
    );
  }

  /* Vue detail d un article */
  if (articleDetail) {
    return (
      <div className="page-articles">
        <div className="conteneur">
          <button className="bouton bouton-secondaire bouton-retour" onClick={() => setArticleDetailId(null)}>
            <i className="fa-solid fa-arrow-left"></i> Retour aux articles
          </button>

          <article className="carte article-complet">
            <div className="en-tete-article-complet">
              <span className="badge badge-primaire">
                <i className={obtenirIconeCategorie(articleDetail.categorie)}></i> {articleDetail.categorie}
              </span>
              <span className="date-article">{formaterDate(articleDetail.date)}</span>
            </div>
            <h1>{articleDetail.titre}</h1>
            <div className="meta-article">
              <span><i className="fa-solid fa-user-pen"></i> {articleDetail.auteur}</span>
              {articleDetail.tempsLecture && (
                <span><i className="fa-solid fa-clock"></i> {articleDetail.tempsLecture} min de lecture</span>
              )}
            </div>
            <div className="contenu-article-complet">
              {articleDetail.contenu.split('\n').map((paragraphe, index) => (
                <p key={index}>{paragraphe}</p>
              ))}
            </div>
            {articleDetail.tags && articleDetail.tags.length > 0 && (
              <div className="tags-article">
                {articleDetail.tags.map((tag) => (
                  <span key={tag} className="badge badge-secondaire">{tag}</span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  /* Vue liste des articles */
  return (
    <div className="page-articles">
      <div className="conteneur">
        <h1><i className="fa-solid fa-newspaper"></i> Articles et ressources</h1>
        <p className="sous-titre-page">
          Des informations fiables et bienveillantes pour vous accompagner au quotidien
        </p>

        {/* Filtres par categorie */}
        <div className="filtres-categories">
          <button
            className={`bouton-filtre ${filtreCategorie === '' ? 'actif' : ''}`}
            onClick={() => setFiltreCategorie('')}
          >
            <i className="fa-solid fa-layer-group"></i> Tous
          </button>
          {categoriesArticles.map((categorie) => (
            <button
              key={categorie.valeur}
              className={`bouton-filtre ${filtreCategorie === categorie.valeur ? 'actif' : ''}`}
              onClick={() => setFiltreCategorie(categorie.valeur)}
            >
              <i className={categorie.icone}></i> {categorie.libelle}
            </button>
          ))}
        </div>

        {/* Grille d articles */}
        {articles.length === 0 ? (
          <div className="carte message-vide">
            <i className="fa-solid fa-newspaper"></i>
            <h3>Aucun article dans cette categorie</h3>
            <p>Explorez les autres categories pour trouver du contenu qui vous interesse.</p>
          </div>
        ) : (
          <div className="grille-articles">
            {articles.map((article) => (
              <div key={article.identifiant} className="carte carte-article">
                <div className="icone-categorie-article">
                  <i className={obtenirIconeCategorie(article.categorie)}></i>
                </div>
                <div className="en-tete-carte-article">
                  <span className="badge badge-primaire">{article.categorie}</span>
                  <span className="date-article-carte">{formaterDate(article.date)}</span>
                </div>
                <h3 className="titre-article">{article.titre}</h3>
                <p className="extrait-article">{article.resume || article.contenu.substring(0, 150) + '...'}</p>
                <div className="pied-carte-article">
                  <span className="auteur-article">
                    <i className="fa-solid fa-user-pen"></i> {article.auteur}
                  </span>
                  <button
                    className="bouton bouton-primaire bouton-petit"
                    onClick={() => setArticleDetailId(article.identifiant)}
                  >
                    Lire <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageArticles;
