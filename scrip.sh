#!/bin/bash
echo "🚀 Installation de l'application Saint-Valentin avec XAMPP..."
echo

# Vérifier XAMPP
if [ ! -d "/opt/lampp" ] && [ ! -d "/Applications/XAMPP" ]; then
    echo "❌ XAMPP non trouvé"
    echo "📥 Téléchargez XAMPP depuis: https://www.apachefriends.org/"
    exit 1
fi

echo "✅ XAMPP détecté"
echo

echo "1. Démarrage de XAMPP..."
# Pour Linux
if [ -d "/opt/lampp" ]; then
    sudo /opt/lampp/lampp start
elif [ -d "/Applications/XAMPP" ]; then
    # macOS
    open /Applications/XAMPP/XAMPP.app
fi

echo "2. Installation du backend..."
cd ~/valentin-backend
npm install

echo "3. Installation du frontend..."
cd ~/my-valentin-person
npm install

echo "4. Ouverture de phpMyAdmin..."
if which xdg-open > /dev/null; then
    xdg-open http://localhost/phpmyadmin
elif which open > /dev/null; then
    open http://localhost/phpmyadmin
fi

echo
echo "✅ Installation terminée !"
echo
echo "📋 Instructions:"
echo "   a. Vérifiez que MySQL est démarré dans XAMPP"
echo "   b. Créez la base de données 'valentin_app' dans phpMyAdmin"
echo "   c. Dans un terminal: cd ~/valentin-backend && npm run dev"
echo "   d. Dans un autre terminal: cd ~/my-valentin-person && npm run dev"
echo
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   phpMyAdmin: http://localhost/phpmyadmin"
