import React, { useState, useEffect } from "react";
import PartnerCard from "./PartnerCard";
import { apiService } from "../services/api";

const Results = ({ userData }) => {
  const [sortBy, setSortBy] = useState("compatibility");
  const [filterCity, setFilterCity] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPartners = React.useCallback(async () => {
    try {
      setLoading(true);

      // Calculer les compatibilités via l'API
      const response = await apiService.calculateCompatibility(
        userData.userId,
        userData,
      );

      setPartners(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur de chargement des partenaires",
      );
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const filteredPartners = partners
    .filter((partner) => {
      if (
        filterCity &&
        !partner.city.toLowerCase().includes(filterCity.toLowerCase())
      ) {
        return false;
      }
      if (partner.age < minAge || partner.age > maxAge) {
        return false;
      }
      if (
        userData.searchPreferences.preferredCity &&
        !partner.city
          .toLowerCase()
          .includes(userData.searchPreferences.preferredCity.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "compatibility") {
        return b.compatibilityScore - a.compatibilityScore;
      } else if (sortBy === "age") {
        return a.age - b.age;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div className="results-container">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Recherche de ton partenaire idéal...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          {/* En-tête des résultats */}
          <div className="card shadow-sm mb-5 border-0">
            <div className="card-body p-4">
              <h2 className="text-center text-danger mb-4">
                🎉 {userData.name}, voici tes partenaires potentiels !
              </h2>

              <div className="row align-items-center mb-3">
                <div className="col-md-6">
                  <p className="lead mb-0">
                    <span className="badge bg-danger">
                      {filteredPartners.length}
                    </span>{" "}
                    résultat(s) trouvé(s)
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={fetchPartners}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualiser
                  </button>
                </div>
              </div>

              {/* Filtres */}
              <div className="bg-light p-4 rounded-3">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Trier par</label>
                    <select
                      className="form-select border-danger"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="compatibility">
                        Compatibilité (haut en bas)
                      </option>
                      <option value="age">Âge croissant</option>
                      <option value="name">Nom A-Z</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">
                      Filtrer par ville
                    </label>
                    <input
                      type="text"
                      className="form-control border-danger"
                      placeholder="Entrez une ville..."
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">
                      Âge : {minAge} - {maxAge} ans
                    </label>
                    <div className="row g-2">
                      <div className="col">
                        <input
                          type="range"
                          className="form-range"
                          min="18"
                          max="50"
                          value={minAge}
                          onChange={(e) => setMinAge(parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="range"
                          className="form-range"
                          min="18"
                          max="50"
                          value={maxAge}
                          onChange={(e) => setMaxAge(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          {filteredPartners.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 text-danger mb-3">😔</div>
              <h3 className="mb-3">
                Aucun partenaire ne correspond à tes critères
              </h3>
              <p className="text-muted mb-4">
                Essaie d'élargir tes filtres ou de modifier tes préférences
              </p>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  setFilterCity("");
                  setMinAge(18);
                  setMaxAge(50);
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {filteredPartners.map((partner) => (
                  <div key={partner.id} className="col-12 col-md-6 col-lg-4">
                    <PartnerCard partner={partner} userData={userData} />
                  </div>
                ))}
              </div>

              {/* Meilleur match */}
              <div className="card shadow-lg border-danger mt-5">
                <div className="card-header bg-danger text-white py-3">
                  <h3 className="h4 mb-0 text-center">
                    <i className="bi bi-trophy me-2"></i>💖 Ton meilleur match !
                    💖
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <div className="card bg-light border-0">
                        <div className="card-body p-4">
                          <PartnerCard
                            partner={filteredPartners[0]}
                            userData={userData}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-success mb-0">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Compatibilité exceptionnelle de{" "}
                      {filteredPartners[0].compatibilityScore}% !
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Results;
