import React, { useState, useEffect } from 'react';
import './App.css';
import PersonalityForm from './components/PersonalityForm';
import SimpleRegister from './components/SimpleRegister';
import Results from './components/Results';
import { apiService } from './services/api';

function App() {
  const [userData, setUserData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [apiStatus, setApiStatus] = useState('loading');
  const [showFullRegistration, setShowFullRegistration] = useState(false);

  const checkApiHealth = async () => {
    try {
      await apiService.checkHealth();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('error');
      console.error('API non connectée:', error);
    }
  };

  // Vérifier la connexion à l'API au démarrage
  useEffect(() => {
    (async () => {
      await checkApiHealth();
    })();
  }, []);

  const handleFormSubmit = (data) => {
    setUserData(data);
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setUserData(null);
    setShowResults(false);
    setShowFullRegistration(false);
  };

  return (
    <div className="App">
      <header className="bg-danger text-white py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-3">
                💝 Trouve l'Amour pour la Saint-Valentin 💝
              </h1>
              <p className="lead mb-0">
                Découvre ton partenaire idéal en fonction de tes goûts et personnalité
              </p>

              {/* Indicateur de statut API */}
              <div className="mt-3">
                <span className={`badge ${apiStatus === 'connected' ? 'bg-success' : 'bg-warning'}`}>
                  <i className={`bi ${apiStatus === 'connected' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-1`}></i>
                  {apiStatus === 'connected' ? 'Connecté à la base de données' : 'Mode démo (API non connectée)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          {!showResults ? (
            showFullRegistration ? (
              <div className="position-relative">
                <button
                  className="btn btn-outline-secondary mb-3"
                  onClick={() => setShowFullRegistration(false)}
                >
                  &larr; Retour à l'inscription simple
                </button>
                <PersonalityForm onSubmit={handleFormSubmit} />
              </div>
            ) : (
              <SimpleRegister
                onSubmit={handleFormSubmit}
                onSwitchToFull={() => setShowFullRegistration(true)}
              />
            )
          ) : (
            <>
              <div className="text-center mb-4">
                <button
                  className="btn btn-outline-danger btn-lg"
                  onClick={handleReset}
                >
                  ↺ Faire une nouvelle recherche
                </button>
              </div>
              <Results userData={userData} />
            </>
          )}
        </div>
      </main>

      <footer className="bg-light py-4 mt-5 border-top">
        <div className="container text-center">
          <p className="mb-2 text-danger">
            ❤️ Fait avec amour pour la Saint-Valentin 2024 ❤️
          </p>
          <p className="text-muted small mb-0">
            Cette application utilise une base de données MySQL pour stocker vos préférences et trouver des matches pertinents.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;