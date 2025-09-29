# Configuration Airtable pour la page Clients

## 🎯 Objectif
Intégrer chaque bloc client de votre page dans un tableau Airtable pour une gestion dynamique et faciliter les mises à jour.

## ✅ État actuel
- [x] Données extraites de tous les clients
- [x] Structure de base de données définie
- [x] Fichier JSON temporaire créé
- [x] Code d'intégration Airtable développé
- [x] Page HTML modifiée pour utiliser les données dynamiques

## 📋 Prochaines étapes

### 1. Créer la base Airtable
1. Allez sur [Airtable](https://airtable.com) et connectez-vous
2. Créez une nouvelle base appelée "Reggenerate Clients"
3. Créez une table "Clients" avec ces champs :

| Nom du champ | Type | Configuration |
|--------------|------|---------------|
| `Nom_Entreprise` | Texte court | - |
| `Nom_Produit` | Texte court | - |
| `Emoji` | Texte court | - |
| `Couleur_Debut` | Texte court | Ex: #90EE90 |
| `Couleur_Fin` | Texte court | Ex: #98FB98 |
| `Galenique` | Liste déroulante | Options: Gélule, Barre, Poudre, Chai Latte, Gélules |
| `Indication` | Texte court | - |
| `Composition` | Texte long | - |
| `URL_Site` | URL | - |
| `Actif` | Case à cocher | Coché par défaut |

### 2. Importer les données
Copiez-collez ces données dans votre table Airtable :

```
VALEBIO | Collagène Articulaire | 💊 | #90EE90 | #98FB98 | Gélule | Articulations | Reggenerate™ + Acide hyaluronique + Curcuma + Vitamine C | https://www.valebio.com | ✓
NUTRIELEMENT | Hair Skin Nails | ✨ | #FFB6C1 | #FFC0CB | Gélule | Beauté globale | Reggenerate™ + Kératine + Sélénium + Zinc + Vitamine C + Biotine + MSM | https://www.nutrielement.com | ✓
SUPERNATURE | Barre Chocolat Noisette Collagène | 🍫 | #8B4513 | #D2691E | Barre | Beauté de la peau | Reggenerate™ | https://www.supernature.com | ✓
OEMINE | Collagène Végétarien | 🌹 | #FF69B4 | #FFB6C1 | Gélule | Anti-âge & Articulations | Reggenerate™ + Églantier | https://www.oemine.com | ✓
SIHO | Collagène Végétarien | ⚫ | #000000 | #333333 | Poudre | Peau & Articulations | Reggenerate™ + Kératine + Sélénium + Zinc + Vitamine C + Biotine + MSM | https://www.siho.com | ✓
SUPERNATURE | Chai Latte Collagène | ☕ | #8B4513 | #D2691E | Chai Latte | Beauté de la peau | Reggenerate™ | https://www.supernature.com | ✓
EPYCURE | Cure Peau Repulpée | 🎭 | #000000 | #FFFFFF | Gélule | Beauté de la peau | Reggenerate™ + Bourrache + Vitamine C + Sélénium + Vitamine E + Zinc + Biotine + Vitamine B6 | https://www.epycure.com | ✓
KOTOR PHARMA | Kotor Collagène | 🏺 | #8B4513 | #D2691E | Gélule | Peau & Articulations | Reggenerate™ + Silicium végétal + Vitamine C + Glucosamine + Chondroïtine + Kératine | https://www.kotorpharma.com | ✓
LEPIVITS | Dermavits | 🌿 | #90EE90 | #98FB98 | Gélules | Beauté de la peau | Reggenerate™ + Vitamine C + Vitamine E | https://www.lepivits.com | ✓
```

### 3. Récupérer les informations API

#### Base ID
1. Dans votre base Airtable, cliquez sur "Help" → "API documentation"
2. Votre Base ID ressemble à : `appXXXXXXXXXXXXXX`

#### Table ID
Le nom de votre table (par défaut : "Clients")

#### API Key
1. Allez sur [Airtable Account](https://airtable.com/account)
2. Générez une nouvelle API key
3. Gardez-la secrète !

### 4. Configurer l'intégration

Une fois que vous avez ces informations, ajoutez ce code dans votre fichier `clients-page.html` après le script `clients-manager.js` :

```html
<script>
// Configuration Airtable
clientsManager.configureAirtable(
    'votre_base_id_ici',     // Base ID
    'Clients',               // Table ID
    'votre_api_key_ici'      // API Key
);
</script>
```

## 🚀 Avantages de cette approche

### Actuellement (JSON local)
- ✅ Fonctionne immédiatement
- ✅ Pas de dépendance externe
- ✅ Facile à tester

### Avec Airtable (quand configuré)
- ✅ Interface utilisateur intuitive pour ajouter/modifier des clients
- ✅ Possibilité de collaborer avec l'équipe
- ✅ Historique des modifications
- ✅ Filtres et vues personnalisées
- ✅ API automatique pour d'autres intégrations

## 🔧 Code créé

1. **`clients-data.json`** : Données actuelles en format JSON
2. **`clients-manager.js`** : Gestionnaire intelligent qui peut utiliser JSON ou Airtable
3. **`clients-page.html`** : Page modifiée pour utiliser les données dynamiques
4. **`airtable-setup.md`** : Ce guide de configuration

## 📞 Prochaine étape

Testez d'abord que la page fonctionne avec le JSON local, puis quand vous serez prêt, suivez les étapes ci-dessus pour migrer vers Airtable !

---

**Note :** Le système est conçu pour basculer automatiquement vers le JSON local si Airtable n'est pas disponible, garantissant que votre site fonctionne toujours.
