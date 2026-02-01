const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Pool de connexions MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Routes API

// 1. Route pour vérifier la connexion à la base de données
app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ status: 'OK', message: 'Base de données connectée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Récupérer tous les partenaires
app.get('/api/partners', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM partners WHERE is_active = TRUE'
        );
        
        // Transformer les données
        const partners = rows.map(partner => ({
            ...partner,
            hobbies: partner.hobbies ? partner.hobbies.split(',') : [],
            personality: partner.personality ? partner.personality.split(',') : []
        }));
        
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Enregistrer un nouvel utilisateur
app.post('/api/users', async (req, res) => {
    try {
        const { name, age, city, personalityTraits, selectedHobbies, description, email, password } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO users (name, age, city, personality_traits, hobbies, description, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, age, city, personalityTraits.join(','), selectedHobbies.join(','), description, email, password]
        );
        
        res.json({ 
            success: true, 
            userId: result.insertId,
            message: 'Utilisateur créé avec succès' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Calculer les compatibilités
app.post('/api/calculate-compatibility', async (req, res) => {
    try {
        const { userId, userData } = req.body;
        
        // Récupérer tous les partenaires
        const [partnersRows] = await pool.query(
            'SELECT * FROM partners WHERE is_active = TRUE'
        );
        
        // Calculer la compatibilité pour chaque partenaire
        const partnersWithCompatibility = partnersRows.map(partner => {
            let score = 50;
            
            // Compatibilité d'âge
            if (userData.age && partner.age) {
                const ageDiff = Math.abs(userData.age - partner.age);
                if (ageDiff <= 5) score += 15;
                else if (ageDiff <= 10) score += 5;
            }
            
            // Ville
            if (userData.city && partner.city && 
                userData.city.toLowerCase() === partner.city.toLowerCase()) {
                score += 20;
            }
            
            // Hobbies communs
            const partnerHobbies = partner.hobbies ? partner.hobbies.split(',') : [];
            const commonHobbies = userData.selectedHobbies?.filter(hobby => 
                partnerHobbies.includes(hobby)
            ).length || 0;
            score += commonHobbies * 5;
            
            // Traits de personnalité communs
            const partnerPersonality = partner.personality ? partner.personality.split(',') : [];
            const commonTraits = userData.selectedTraits?.filter(trait => 
                partnerPersonality.includes(trait)
            ).length || 0;
            score += commonTraits * 3;
            
            const finalScore = Math.min(score, 100);
            
            // Enregistrer le match dans la base de données
            pool.query(
                'INSERT INTO matches (user_id, partner_id, compatibility_score) VALUES (?, ?, ?)',
                [userId, partner.id, finalScore]
            ).catch(console.error);
            
            return {
                ...partner,
                hobbies: partnerHobbies,
                personality: partnerPersonality,
                compatibilityScore: finalScore
            };
        });
        
        // Trier par compatibilité
        partnersWithCompatibility.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        
        res.json(partnersWithCompatibility);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Envoyer un message
app.post('/api/messages', async (req, res) => {
    try {
        const { matchId, senderId, content } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO messages (match_id, sender_id, content) VALUES (?, ?, ?)',
            [matchId, senderId, content]
        );
        
        res.json({ 
            success: true, 
            messageId: result.insertId,
            message: 'Message envoyé avec succès' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Récupérer les messages d'un match
app.get('/api/messages/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        
        const [rows] = await pool.query(
            'SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC',
            [matchId]
        );
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Récupérer les matches d'un utilisateur
app.get('/api/users/:userId/matches', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const [rows] = await pool.query(`
            SELECT m.*, p.name as partner_name, p.image_url 
            FROM matches m
            JOIN partners p ON m.partner_id = p.id
            WHERE m.user_id = ?
            ORDER BY m.compatibility_score DESC
        `, [userId]);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});