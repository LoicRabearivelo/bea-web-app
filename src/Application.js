/* Coordinateur de Vie - Composant principal de l'application */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurAuthentification, utiliserAuthentification } from './contextes/ContexteAuthentification';
import BarreNavigation from './composants/BarreNavigation';
import PageAccueil from './pages/PageAccueil';
import PageConnexion from './pages/PageConnexion';
import PageInscription from './pages/PageInscription';
import PageQuestionnaire from './pages/PageQuestionnaire';
import TableauDeBordPatient from './pages/TableauDeBordPatient';
import TableauDeBordProfessionnel from './pages/TableauDeBordProfessionnel';
import PageAnnuaire from './pages/PageAnnuaire';
import PageSuivi from './pages/PageSuivi';
import PageMessages from './pages/PageMessages';
import PageArticles from './pages/PageArticles';
import PageCommunaute from './pages/PageCommunaute';
import PageProfil from './pages/PageProfil';
import PageFicheEnfant from './pages/PageFicheEnfant';
import ChatBea from './composants/ChatBea';

/* Route protegee pour les utilisateurs connectes */
function RouteProtegee({ children, typeAutorise }) {
  const { estConnecte, utilisateur } = utiliserAuthentification();

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  if (typeAutorise && utilisateur.typeProfil !== typeAutorise) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* Route publique qui redirige les utilisateurs deja connectes */
function RoutePublique({ children }) {
  const { estConnecte, utilisateur } = utiliserAuthentification();

  if (estConnecte) {
    if (utilisateur.typeProfil === 'professionnel') {
      return <Navigate to="/professionnel/tableau-de-bord" replace />;
    }
    return <Navigate to="/patient/tableau-de-bord" replace />;
  }

  return children;
}

/* Contenu principal de l'application avec les routes */
function ContenuApplication() {
  return (
    <div className="application">
      <BarreNavigation />
      <main className="contenu-principal">
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/"
            element={
              <RoutePublique>
                <PageAccueil />
              </RoutePublique>
            }
          />
          <Route
            path="/connexion"
            element={
              <RoutePublique>
                <PageConnexion />
              </RoutePublique>
            }
          />
          <Route
            path="/inscription"
            element={
              <RoutePublique>
                <PageInscription />
              </RoutePublique>
            }
          />

          {/* Routes accessibles a tous */}
          <Route path="/articles" element={<PageArticles />} />
          <Route path="/communaute" element={<PageCommunaute />} />
          <Route path="/annuaire" element={<PageAnnuaire />} />

          {/* Routes patient */}
          <Route
            path="/patient/questionnaire"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageQuestionnaire />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/tableau-de-bord"
            element={
              <RouteProtegee typeAutorise="patient">
                <TableauDeBordPatient />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/annuaire"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageAnnuaire />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/suivi"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageSuivi />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/messagerie"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageMessages />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/fiche-enfant"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageFicheEnfant />
              </RouteProtegee>
            }
          />
          <Route
            path="/patient/profil"
            element={
              <RouteProtegee typeAutorise="patient">
                <PageProfil />
              </RouteProtegee>
            }
          />

          {/* Routes professionnel */}
          <Route
            path="/professionnel/tableau-de-bord"
            element={
              <RouteProtegee typeAutorise="professionnel">
                <TableauDeBordProfessionnel />
              </RouteProtegee>
            }
          />
          <Route
            path="/professionnel/rendez-vous"
            element={
              <RouteProtegee typeAutorise="professionnel">
                <TableauDeBordProfessionnel />
              </RouteProtegee>
            }
          />
          <Route
            path="/professionnel/messagerie"
            element={
              <RouteProtegee typeAutorise="professionnel">
                <PageMessages />
              </RouteProtegee>
            }
          />
          <Route
            path="/professionnel/avis"
            element={
              <RouteProtegee typeAutorise="professionnel">
                <TableauDeBordProfessionnel />
              </RouteProtegee>
            }
          />
          <Route
            path="/professionnel/profil"
            element={
              <RouteProtegee typeAutorise="professionnel">
                <PageProfil />
              </RouteProtegee>
            }
          />

          {/* Route de redirection par defaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatBea />
    </div>
  );
}

/* Composant racine de l'application */
function Application() {
  return (
    <BrowserRouter>
      <FournisseurAuthentification>
        <ContenuApplication />
      </FournisseurAuthentification>
    </BrowserRouter>
  );
}

export default Application;
