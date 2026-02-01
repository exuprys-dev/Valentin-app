import React, { useState } from "react";
import { apiService } from "../services/api";

const SimpleRegister = ({ onSubmit, onSwitchToFull }) => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        city: "",
        email: "",
        password: "",
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
            // Send data with empty defaults for missing fields
            const userResponse = await apiService.registerUser({
                name: formData.name,
                age: formData.age,
                city: formData.city,
                email: formData.email,
                password: formData.password,
                // Defaults for simplified flow
                personalityTraits: [],
                selectedHobbies: [],
                description: "",
                searchPreferences: {
                    minAge: 18,
                    maxAge: 99,
                    preferredCity: "",
                    mustHaveTraits: []
                }
            });

            const userId = userResponse.data.userId;

            // Pass data to parent
            onSubmit({
                ...formData,
                userId,
                // Add defaults to local state too
                selectedTraits: [],
                selectedHobbies: [],
                description: "",
                searchPreferences: {
                    minAge: 18,
                    maxAge: 99,
                    preferredCity: "",
                    mustHaveTraits: []
                }
            });
        } catch (err) {
            setError(err.response?.data?.error || "Une erreur est survenue");
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-danger text-white py-4">
                <h2 className="h3 mb-0 text-center">
                    ❤️ Inscription Rapide ❤️
                </h2>
            </div>

            <div className="card-body p-4">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Nom *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Votre nom"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Âge *</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required
                                    min="18"
                                    max="99"
                                    placeholder="Votre âge"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Ville *</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Votre ville"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="exemple@email.com"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Mot de passe *</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg border-danger"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Mot de passe sécurisé"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            type="submit"
                            className="btn btn-danger btn-lg px-5 py-3 w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Inscription...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </div>

                    {onSwitchToFull && (
                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className="btn btn-link text-muted"
                                onClick={onSwitchToFull}
                            >
                                Je veux remplir mon profil complet maintenant
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SimpleRegister;
