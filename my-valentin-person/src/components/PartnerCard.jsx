import React from 'react';

const PartnerCard = ({ partner, userData }) => {
    const calculateCompatibility = (partner, user) => {
        let score = 50;

        if (user.age && partner.age) {
            const ageDiff = Math.abs(user.age - partner.age);
            if (ageDiff <= 5) score += 15;
            else if (ageDiff <= 10) score += 5;
        }

        if (user.city && partner.city && user.city.toLowerCase() === partner.city.toLowerCase()) {
            score += 20;
        }

        const commonHobbies = user.selectedHobbies?.filter(hobby =>
            partner.hobbies.includes(hobby)
        ).length || 0;
        score += commonHobbies * 5;

        const commonTraits = user.selectedTraits?.filter(trait =>
            partner.personality.includes(trait)
        ).length || 0;
        score += commonTraits * 3;

        return Math.min(score, 100);
    };

    const compatibility = userData ? calculateCompatibility(partner, userData) : partner.compatibilityScore;

    const getCompatibilityColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'primary';
        if (score >= 40) return 'warning';
        return 'danger';
    };

    const getBadgeVariant = (score) => {
        if (score >= 80) return 'bg-success';
        if (score >= 60) return 'bg-primary';
        if (score >= 40) return 'bg-warning';
        return 'bg-danger';
    };

    return (
        <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
            <div className="card-body p-0">
                {/* En-tête de la carte */}
                <div className="bg-light p-4 border-bottom">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <img
                                src={partner.image}
                                alt={partner.name}
                                className="rounded-circle border border-3 border-danger"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="col">
                            <h3 className="h5 mb-1 text-danger">{partner.name}, {partner.age} ans</h3>
                            <p className="text-muted mb-2">
                                <i className="bi bi-geo-alt me-1"></i>{partner.city}
                            </p>
                            <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-3" style={{ height: '8px' }}>
                                    <div
                                        className={`progress-bar bg-${getCompatibilityColor(compatibility)}`}
                                        style={{ width: `${compatibility}%` }}
                                    ></div>
                                </div>
                                <span className={`badge ${getBadgeVariant(compatibility)}`}>
                                    {compatibility}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Détails */}
                <div className="p-4">
                    <p className="text-muted mb-4 fst-italic">"{partner.description}"</p>

                    <div className="mb-4">
                        <h5 className="h6 text-danger mb-2">
                            <i className="bi bi-person-badge me-2"></i>Personnalité
                        </h5>
                        <div className="d-flex flex-wrap gap-1">
                            {partner.personality.map(trait => (
                                <span key={trait} className="badge bg-danger bg-opacity-10 text-danger">
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="h6 text-danger mb-2">
                            <i className="bi bi-heart me-2"></i>Passions
                        </h5>
                        <div className="d-flex flex-wrap gap-1">
                            {partner.hobbies.map(hobby => (
                                <span key={hobby} className="badge bg-secondary bg-opacity-10 text-secondary">
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="btn btn-danger w-100">
                            <i className="bi bi-envelope me-2"></i>Envoyer un message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerCard;