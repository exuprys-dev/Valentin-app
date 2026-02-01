import React, { useState } from "react";
import { apiService } from "../services/api";

const PersonalityForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        city: "",
        email: "",
        password: "",
        selectedTraits: [],
        selectedHobbies: [],
        description: "",
        searchPreferences: {
            minAge: 18,
            maxAge: 35,
            preferredCity: "",
            mustHaveTraits: [],
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Enregistrer l'utilisateur dans la base de données
            const userResponse = await apiService.registerUser({
                name: formData.name,
                age: formData.age,
                city: formData.city,
                personalityTraits: formData.selectedTraits,
                selectedHobbies: formData.selectedHobbies,
                description: formData.description,
                email: formData.email,
                password: formData.password,
            });

            const userId = userResponse.data.userId;

            // 2. Passer les données au parent avec l'ID utilisateur
            onSubmit({
                ...formData,
                userId,
            });
        } catch (err) {
            setError(err.response?.data?.error || "Une erreur est survenue");
            console.error("Erreur lors de l'enregistrement:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-danger text-white py-4">
                <h2 className="h3 mb-0 text-center">
                    ❤️ Trouve ton Partenaire de Saint-Valentin ❤️
                </h2>
            </div>

            <div className="card-body p-4">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Section À propos de toi */}
                    <div className="mb-5">
                        <h3 className="h4 text-danger mb-4 border-bottom pb-2">
                            <i className="bi bi-person-circle me-2"></i>À propos de toi
                        </h3>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Ton nom *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Comment tu t'appelles ?"
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Ton âge</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    min="18"
                                    max="99"
                                    placeholder="Âge"
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Ta ville</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Ville"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control border-danger"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="ton@email.com"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Mot de passe *</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control border-danger"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Minimum 6 caractères"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">
                                    Décris-toi en quelques mots
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control border-danger"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Parle-nous un peu de toi..."
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ... Le reste du formulaire reste identique ... */}
                    {/* (Personnalité, Hobbies, Préférences) */}

                    {/* Bouton de soumission */}
                    <div className="text-center mt-5">
                        <button
                            type="submit"
                            className="btn btn-danger btn-lg px-5 py-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Enregistrement en cours...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-heart-fill me-2"></i>
                                    Trouver mon partenaire idéal !
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalityForm;
