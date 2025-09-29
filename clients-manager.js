class ClientsManager {
    constructor() {
        this.clients = [];
        this.airtableConfig = {
            baseId: '', // À remplir plus tard
            tableId: '', // À remplir plus tard
            apiKey: '', // À remplir plus tard
            useAirtable: false
        };
    }

    // Configuration pour Airtable (à appeler quand vous aurez les infos)
    configureAirtable(baseId, tableId, apiKey) {
        this.airtableConfig = {
            baseId,
            tableId,
            apiKey,
            useAirtable: true
        };
    }

    // Charger les données (JSON local ou Airtable)
    async loadClients() {
        // Priorité: proxy PHP Airtable
        try {
            const proxyRes = await fetch('./airtable-proxy.php', { cache: 'no-store' });
            if (proxyRes.ok) {
                const payload = await proxyRes.json();
                if (Array.isArray(payload.records)) {
                    this.clients = payload.records;
                    console.log('✅ Données chargées depuis Airtable via PHP');
                    return this.clients;
                }
            }
        } catch (error) {
            console.log('⚠️ Proxy PHP non disponible, fallback vers JSON');
        }

        // Fallback: JSON local
        console.log('📄 Chargement depuis JSON local');
        return await this.loadFromJSON();
    }

    // Charger depuis le fichier JSON local
    async loadFromJSON() {
        try {
            const response = await fetch('./clients-data.json');
            const data = await response.json();
            this.clients = data.clients.filter(client => client.actif === true);
            return this.clients;
        } catch (error) {
            console.error('Erreur lors du chargement du JSON:', error);
            return [];
        }
    }

    // Charger depuis Airtable
    async loadFromAirtable() {
        try {
            // Construire l'URL en utilisant soit l'ID de table (commence par 'tbl'), soit le nom encodé
            const tableIdentifier = this.airtableConfig.tableId;
            const isTableId = typeof tableIdentifier === 'string' && tableIdentifier.startsWith('tbl');
            const encodedTable = isTableId ? tableIdentifier : encodeURIComponent(tableIdentifier);
            const finalUrl = `https://api.airtable.com/v0/${this.airtableConfig.baseId}/${encodedTable}`;
            console.log('🔍 URL Airtable utilisée:', finalUrl);
            console.log('🔑 API Key (premiers caractères):', this.airtableConfig.apiKey.substring(0, 20) + '...');
            
            const response = await fetch(finalUrl, {
                headers: {
                    'Authorization': `Bearer ${this.airtableConfig.apiKey}`
                },
                cache: 'no-cache'  // Forcer le rechargement sans cache
            });
            
            console.log('📡 Status réponse:', response.status);
            const data = await response.json();
            console.log('📊 Données reçues:', data);
            
            if (data.error) {
                throw new Error(`Erreur Airtable: ${data.error.type || data.error}`);
            }
            
            this.clients = data.records
                .filter(record => {
                    console.log(`🔍 Client: ${record.fields.Nom_Entreprise}, Actif: ${record.fields.Actif}`);
                    return record.fields.Actif === true;
                })
                .map(record => ({
                    id: record.id,
                    nom_entreprise: record.fields.Nom_Entreprise,
                    nom_produit: record.fields.Nom_Produit,
                    emoji: record.fields.Emoji,
                    couleur_debut: record.fields.Couleur_Debut,
                    couleur_fin: record.fields.Couleur_Fin,
                    galenique: record.fields.Galenique,
                    indication: record.fields.Indication,
                    composition: record.fields.Composition,
                    url_site: record.fields.URL_Site,
                    actif: record.fields.Actif
                }));
            
            return this.clients;
        } catch (error) {
            console.error('Erreur lors du chargement depuis Airtable:', error);
            // Fallback vers JSON en cas d'erreur
            return await this.loadFromJSON();
        }
    }

    // Générer le HTML pour un client
    generateClientHTML(client) {
        return `
            <div class="client-card" style="background: white; border-radius: 20px; padding: 2rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="width: 120px; height: 120px; background: linear-gradient(135deg, ${client.couleur_debut} 0%, ${client.couleur_fin} 100%); border-radius: 12px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">${client.emoji}</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem;">${client.nom_entreprise}</h3>
                    <p style="color: #2eb2a4; font-weight: 600; margin-bottom: 1rem;">${client.nom_produit}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: 500; color: #1a1a1a;">Galenique:</span>
                        <span style="color: #666;">${client.galenique}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: 500; color: #1a1a1a;">Indication:</span>
                        <span style="color: #666;">${client.indication}</span>
                    </div>
                    <div style="margin-top: 1rem;">
                        <span style="font-weight: 500; color: #1a1a1a;">Composition:</span>
                        <p style="color: #666; margin-top: 0.5rem; font-size: 0.9rem;">${client.composition}</p>
                    </div>
                </div>
                <a href="${client.url_site}" target="_blank" class="btn client-cta" style="display: block; text-align: center;">Visiter le site</a>
            </div>
        `;
    }

    // Générer le HTML pour tous les clients
    generateAllClientsHTML() {
        return this.clients.map(client => this.generateClientHTML(client)).join('');
    }

    // Injecter les clients dans la page
    async renderClients(containerId = 'clients-grid-container') {
        await this.loadClients();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateAllClientsHTML();
        }
    }

    // Ajouter un nouveau client (pour Airtable)
    async addClient(clientData) {
        if (!this.airtableConfig.useAirtable) {
            console.warn('Ajout de client disponible uniquement avec Airtable');
            return false;
        }

        try {
            const url = `https://api.airtable.com/v0/${this.airtableConfig.baseId}/${this.airtableConfig.tableId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.airtableConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        Nom_Entreprise: clientData.nom_entreprise,
                        Nom_Produit: clientData.nom_produit,
                        Emoji: clientData.emoji,
                        Couleur_Debut: clientData.couleur_debut,
                        Couleur_Fin: clientData.couleur_fin,
                        Galenique: clientData.galenique,
                        Indication: clientData.indication,
                        Composition: clientData.composition,
                        URL_Site: clientData.url_site,
                        Actif: true
                    }
                })
            });

            if (response.ok) {
                await this.loadClients(); // Recharger les données
                return true;
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du client:', error);
        }
        return false;
    }

    // Mettre à jour les statistiques
    updateStats() {
        const stats = {
            totalClients: this.clients.length,
            totalProduits: this.clients.length, // Peut être différent si multi-produits par client
            galeniques: [...new Set(this.clients.map(c => c.galenique))],
            indications: [...new Set(this.clients.map(c => c.indication))]
        };

        // Mettre à jour les chiffres sur la page
        const brandCounter = document.querySelector('.brands-counter');
        if (brandCounter) {
            brandCounter.textContent = `${stats.totalClients}+`;
        }

        const productCounter = document.querySelector('.products-counter');
        if (productCounter) {
            productCounter.textContent = `${stats.totalProduits}+`;
        }

        return stats;
    }
}

// Instance globale
const clientsManager = new ClientsManager();

// Auto-initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.clients-grid')) {
        initializeClientsPage();
    }
});

async function initializeClientsPage() {
    // Charger et afficher les clients
    await clientsManager.renderClients('clients-grid-container');
    
    // Mettre à jour les statistiques
    clientsManager.updateStats();
    
    console.log('✅ Clients chargés avec succès!');
}
