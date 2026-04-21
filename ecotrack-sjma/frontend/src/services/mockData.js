// ==================== CITIZEN MOCK DATA ====================

export const citizenUser = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@email.com',
  role: 'CITOYEN',
  avatar: null,
  points: 1250,
  niveau: 'Eco-Acteur (Argent)',
  niveauSuivant: 'Or',
  pointsNiveauSuivant: 1500,
  progressionNiveau: 83,
};

export const prochainescollectes = [
  {
    id: 1,
    type: 'Ordures menageres',
    icon: 'fa-trash',
    iconColor: '#3F51B5',
    iconBg: '#e8eaf6',
    jour: 'Mardi 15 Jan',
    horaire: '7h-12h',
    countdown: 'Demain',
    countdownColor: '#4CAF50',
  },
  {
    id: 2,
    type: 'Recyclage',
    icon: 'fa-recycle',
    iconColor: '#4CAF50',
    iconBg: '#e8f5e9',
    jour: 'Mercredi 16 Jan',
    horaire: '7h-12h',
    countdown: '2 jours',
    countdownColor: '#FF9800',
  },
];

export const impactStats = [
  { id: 1, icon: 'fa-cloud', color: '#4CAF50', value: '12.5 kg', label: 'CO2 evite' },
  { id: 2, icon: 'fa-dumpster', color: '#FF9800', value: '45 kg', label: 'Dechets tries' },
  { id: 3, icon: 'fa-flag', color: '#2196F3', value: '23', label: 'Signalements' },
];

export const recentSignalements = [
  {
    id: 'SIG-2026-001234',
    type: 'Conteneur debordant',
    adresse: 'Rue Victor Hugo',
    status: 'Nouveau',
    statusType: 'new',
    statusColor: 'blue',
    date: '14 Jan 2026',
  },
  {
    id: 'SIG-2026-001210',
    type: 'Conteneur endommage',
    adresse: 'Place Bellecour',
    status: 'En cours',
    statusType: 'progress',
    statusColor: 'yellow',
    date: '12 Jan 2026',
  },
  {
    id: 'SIG-2026-001198',
    type: 'Debordement',
    adresse: 'Rue de la Republique',
    status: 'Resolu',
    statusType: 'resolved',
    statusColor: 'green',
    date: '10 Jan 2026',
  },
];

export const quickActions = [
  { id: 'signaler', label: 'Signaler', icon: 'fa-exclamation-triangle', color: '#ff5252' },
  { id: 'carte', label: 'Carte', icon: 'fa-map-marked-alt', color: '#2196F3' },
  { id: 'tri', label: 'Guide Tri', icon: 'fa-recycle', color: '#4CAF50' },
  { id: 'defis', label: 'Defis', icon: 'fa-trophy', color: '#FF9800' },
];

export const notifications = [
  { id: 1, title: 'Collecte en approche', message: 'Ordures menageres demain matin 7h-12h', type: 'info', icon: 'fa-truck', iconBg: '#e3f2fd', iconColor: '#2196F3', read: false, date: '14 Jan 2026 - 08:30' },
  { id: 2, title: 'Signalement mis a jour', message: 'Votre signalement #SIG-2026-001210 est en cours de traitement', type: 'success', icon: 'fa-check-circle', iconBg: '#e8f5e9', iconColor: '#4CAF50', read: false, date: '13 Jan 2026 - 14:15' },
  { id: 3, title: 'Defi complete !', message: 'Vous avez termine le defi "Tri Parfait" (+100 pts)', type: 'reward', icon: 'fa-trophy', iconBg: '#fff3e0', iconColor: '#FF9800', read: true, date: '12 Jan 2026 - 10:00' },
  { id: 4, title: 'Rappel collecte', message: 'Recyclage prevu mercredi - Sortez vos bacs !', type: 'info', icon: 'fa-bell', iconBg: '#f3e5f5', iconColor: '#9c27b0', read: true, date: '11 Jan 2026 - 18:00' },
];

// ==================== SIGNALEMENTS COMPLETS ====================
export const allSignalements = [
  { id: 'SIG-2026-001234', type: 'Conteneur debordant', typeIcon: 'fa-dumpster-fire', adresse: 'Rue Victor Hugo', conteneur: 'CONT-2026-00456', status: 'Nouveau', statusType: 'new', statusColor: 'blue', date: '14 Jan 2026 - 09:30', urgence: 'Moyenne', description: 'Le conteneur vert a l\'angle de la rue Victor Hugo est plein depuis 3 jours.', photo: true,
    timeline: [{ step: 'Soumis', date: '14 Jan 2026 - 09:30', done: true }, { step: 'En cours', date: null, done: false }, { step: 'Resolu', date: null, done: false }]
  },
  { id: 'SIG-2026-001210', type: 'Conteneur endommage', typeIcon: 'fa-tools', adresse: 'Place Bellecour', conteneur: 'CONT-2026-00312', status: 'En cours', statusType: 'progress', statusColor: 'yellow', date: '12 Jan 2026 - 14:20', urgence: 'Haute', description: 'Couvercle casse, le conteneur ne ferme plus correctement.', photo: true,
    agentNote: { agent: 'Marc D.', message: 'Intervention prevue pour demain matin.' },
    timeline: [{ step: 'Soumis', date: '12 Jan 2026 - 14:20', done: true }, { step: 'En cours', date: '13 Jan 2026 - 08:00', done: true }, { step: 'Resolu', date: null, done: false }]
  },
  { id: 'SIG-2026-001198', type: 'Debordement', typeIcon: 'fa-dumpster-fire', adresse: 'Rue de la Republique', conteneur: 'CONT-2026-00289', status: 'Resolu', statusType: 'resolved', statusColor: 'green', date: '10 Jan 2026 - 11:45', urgence: 'Basse', description: 'Debordement autour du conteneur a verre.', photo: false,
    agentNote: { agent: 'Sophie L.', message: 'Conteneur vide et zone nettoyee.' },
    timeline: [{ step: 'Soumis', date: '10 Jan 2026 - 11:45', done: true }, { step: 'En cours', date: '10 Jan 2026 - 16:00', done: true }, { step: 'Resolu', date: '11 Jan 2026 - 09:30', done: true }]
  },
  { id: 'SIG-2026-001185', type: 'Depot sauvage', typeIcon: 'fa-trash', adresse: 'Avenue Jean Jaures', conteneur: 'CONT-2026-00178', status: 'En cours', statusType: 'progress', statusColor: 'yellow', date: '9 Jan 2026 - 16:10', urgence: 'Haute', description: 'Depot de meubles abandonnes autour du conteneur.', photo: true,
    timeline: [{ step: 'Soumis', date: '9 Jan 2026 - 16:10', done: true }, { step: 'En cours', date: '10 Jan 2026 - 10:00', done: true }, { step: 'Resolu', date: null, done: false }]
  },
  { id: 'SIG-2026-001170', type: 'Conteneur debordant', typeIcon: 'fa-dumpster-fire', adresse: 'Rue Garibaldi', conteneur: 'CONT-2026-00534', status: 'Resolu', statusType: 'resolved', statusColor: 'green', date: '8 Jan 2026 - 08:00', urgence: 'Basse', description: 'Poubelle jaune pleine.', photo: false,
    timeline: [{ step: 'Soumis', date: '8 Jan 2026 - 08:00', done: true }, { step: 'En cours', date: '8 Jan 2026 - 14:00', done: true }, { step: 'Resolu', date: '9 Jan 2026 - 07:30', done: true }]
  },
  { id: 'SIG-2026-001155', type: 'Degradation', typeIcon: 'fa-tools', adresse: 'Cours Lafayette', conteneur: 'CONT-2026-00601', status: 'Rejete', statusType: 'rejected', statusColor: 'red', date: '7 Jan 2026 - 13:25', urgence: 'Basse', description: 'Graffiti sur le conteneur.', photo: true,
    agentNote: { agent: 'Admin', message: 'Ne releve pas du service collecte.' },
    timeline: [{ step: 'Soumis', date: '7 Jan 2026 - 13:25', done: true }, { step: 'Rejete', date: '7 Jan 2026 - 17:00', done: true }]
  },
];

// ==================== DEFIS & BADGES ====================
export const defis = [
  { id: 1, tag: 'Quotidien', tagClass: 'daily', title: 'Signalement Express', description: 'Faites 3 signalements aujourd\'hui', reward: '+50 pts', progress: 2, total: 3 },
  { id: 2, tag: 'Hebdo', tagClass: 'weekly', title: 'Tri Parfait', description: 'Triez correctement vos dechets pendant 7 jours', reward: '+100 pts + Badge', progress: 3, total: 7 },
  { id: 3, tag: 'Mensuel', tagClass: 'monthly', title: 'Eco-Quartier', description: 'Participez a 20 actions eco-responsables ce mois', reward: '+500 pts + Badge Or', progress: 5, total: 20 },
];

export const badges = [
  { id: 1, name: 'Eco-Debutant', icon: 'fa-medal', color: '#cd7f32', earned: true, points: '100 pts' },
  { id: 2, name: 'Eco-Acteur', icon: 'fa-medal', color: '#c0c0c0', earned: true, points: '500 pts' },
  { id: 3, name: 'Eco-Champion', icon: 'fa-medal', color: '#ffd700', earned: false, points: '1000 pts' },
  { id: 4, name: 'Eco-Leader', icon: 'fa-star', color: '#9c27b0', earned: false, points: '2500 pts' },
];

// ==================== GUIDE TRI ====================
export const triCategories = [
  { id: 1, name: 'Emballages recyclables', color: '#FFC107', icon: 'fa-box-open', items: ['Bouteilles plastique', 'Canettes aluminium', 'Briques alimentaires', 'Boites de conserve', 'Cartons'] },
  { id: 2, name: 'Verre', color: '#4CAF50', icon: 'fa-wine-bottle', items: ['Bouteilles en verre', 'Pots en verre', 'Bocaux', 'Flacons en verre'] },
  { id: 3, name: 'Papier', color: '#2196F3', icon: 'fa-newspaper', items: ['Journaux', 'Magazines', 'Prospectus', 'Enveloppes', 'Cahiers'] },
  { id: 4, name: 'Compost / Biodechets', color: '#795548', icon: 'fa-leaf', items: ['Epluchures', 'Restes de repas', 'Marc de cafe', 'Coquilles d\'oeufs', 'Fleurs fanees'] },
  { id: 5, name: 'Ordures menageres', color: '#607D8B', icon: 'fa-trash', items: ['Couches', 'Mouchoirs usages', 'Vaisselle cassee', 'Stylos', 'Eponges'] },
  { id: 6, name: 'Dechets speciaux', color: '#f44336', icon: 'fa-exclamation-triangle', items: ['Piles', 'Ampoules', 'Medicaments', 'Peintures', 'Electronique'] },
];

// ==================== BOUTIQUE RECOMPENSES ====================
export const boutique = [
  { id: 1, name: 'Bon de reduction 5EUR', description: 'Valable dans les commerces partenaires', cost: 500, icon: 'fa-tag', iconBg: '#e3f2fd', iconColor: '#2196F3', available: true },
  { id: 2, name: 'Planter un arbre', description: 'Un arbre plante en votre nom', cost: 800, icon: 'fa-tree', iconBg: '#e8f5e9', iconColor: '#4CAF50', available: true },
  { id: 3, name: 'Super Eco-Citoyen', description: 'Badge exclusif sur votre profil', cost: 1500, icon: 'fa-award', iconBg: '#fff3e0', iconColor: '#FF9800', available: false },
  { id: 4, name: 'Entree piscine', description: 'Entree gratuite piscine municipale', cost: 2000, icon: 'fa-swimming-pool', iconBg: '#f3e5f5', iconColor: '#9c27b0', available: false },
];

// ==================== HISTORIQUE POINTS ====================
export const pointsHistory = [
  { id: 1, label: 'Signalement valide', icon: 'fa-flag', iconBg: '#e3f2fd', iconColor: '#2196F3', value: '+10', type: 'gain', date: '14 Jan 2026' },
  { id: 2, label: 'Defi "Tri Parfait" complete', icon: 'fa-trophy', iconBg: '#fff3e0', iconColor: '#FF9800', value: '+100', type: 'gain', date: '12 Jan 2026' },
  { id: 3, label: 'Bon reduction 5EUR', icon: 'fa-tag', iconBg: '#ffebee', iconColor: '#f44336', value: '-500', type: 'depense', date: '10 Jan 2026' },
  { id: 4, label: 'Collecte validee', icon: 'fa-check-circle', iconBg: '#e8f5e9', iconColor: '#4CAF50', value: '+20', type: 'gain', date: '9 Jan 2026' },
  { id: 5, label: 'Badge debloque', icon: 'fa-medal', iconBg: '#f3e5f5', iconColor: '#9c27b0', value: '+50', type: 'gain', date: '8 Jan 2026' },
];

// ==================== HORAIRES COLLECTE ====================
export const horairesCollecte = [
  { id: 1, type: 'Ordures menageres', icon: 'fa-trash', iconColor: '#3F51B5', jours: 'Mardi & Vendredi', horaire: '7h - 12h' },
  { id: 2, type: 'Recyclage', icon: 'fa-recycle', iconColor: '#4CAF50', jours: 'Mercredi', horaire: '7h - 12h' },
  { id: 3, type: 'Compost', icon: 'fa-leaf', iconColor: '#795548', jours: 'Jeudi', horaire: '7h - 12h' },
];

// ==================== STATISTIQUES ====================
export const statsMetropole = [
  { id: 1, label: 'Taux de collecte', value: '94.2%', icon: 'fa-chart-line', iconBg: '#e8f5e9', iconColor: '#4CAF50' },
  { id: 2, label: 'Collecte ce mois', value: '1,240 T', icon: 'fa-truck', iconBg: '#e3f2fd', iconColor: '#2196F3' },
  { id: 3, label: 'Taux recyclage', value: '67%', icon: 'fa-recycle', iconBg: '#fff3e0', iconColor: '#FF9800' },
  { id: 4, label: 'Classement quartier', value: '#3', icon: 'fa-map-marker-alt', iconBg: '#f3e5f5', iconColor: '#9c27b0' },
];

export const classementQuartiers = [
  { rank: 1, name: 'Presqu\'ile', pct: '96%' },
  { rank: 2, name: 'Part-Dieu', pct: '93%' },
  { rank: 3, name: 'Confluence', pct: '91%' },
  { rank: 4, name: 'Croix-Rousse', pct: '88%' },
  { rank: 5, name: 'Vieux Lyon', pct: '85%' },
];

// ==================== MAP MARKERS ====================
export const mapContainers = [
  { id: 'CONT-2026-00456', lat: 45.764, lng: 4.8357, type: 'Ordures menageres', fillLevel: 85, address: '15 Rue Victor Hugo' },
  { id: 'CONT-2026-00312', lat: 45.758, lng: 4.832, type: 'Recyclage', fillLevel: 45, address: '3 Place Bellecour' },
  { id: 'CONT-2026-00289', lat: 45.762, lng: 4.838, type: 'Verre', fillLevel: 20, address: '8 Rue de la Republique' },
  { id: 'CONT-2026-00178', lat: 45.766, lng: 4.842, type: 'Ordures menageres', fillLevel: 72, address: '22 Avenue Jean Jaures' },
];
