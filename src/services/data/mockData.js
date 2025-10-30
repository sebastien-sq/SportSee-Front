/**
 * Données de démonstration et service mock pour SportSee
 *
 * Ce module fournit des données simulées pour tous les types d'utilisateurs
 * et endpoints de l'application SportSee. Utilisé pour le développement
 * et les tests quand l'API backend n'est pas disponible.
 *
 * @module mockData
 * @author SportSee Team
 * @since 1.0.0
 *
 * @example
 * // Import des données mock
 * import { mockUserData, createMockService } from './mockData.js';
 *
 * @example
 * // Utilisation du service mock
 * const mockService = createMockService();
 * const userData = await mockService.getUserById();
 */

/**
 * Données d'activité simulées pour l'utilisateur par défaut (12)
 * @type {Object}
 * @property {Object} data - Conteneur des données
 * @property {number} data.userId - ID de l'utilisateur
 * @property {ActivitySession[]} data.sessions - Sessions d'activité quotidienne
 *
 * @example
 * console.log(mockActivityData.data.sessions[0]);
 * // { day: "2020-07-01", kilogram: 80, calories: 240 }
 */
// Données d'activité simulées
export const mockActivityData = {
  data: {
    userId: 12,
    sessions: [
      { day: "2020-07-01", kilogram: 80, calories: 240 },
      { day: "2020-07-02", kilogram: 80, calories: 220 },
      { day: "2020-07-03", kilogram: 81, calories: 280 },
      { day: "2020-07-04", kilogram: 81, calories: 290 },
      { day: "2020-07-05", kilogram: 80, calories: 160 },
      { day: "2020-07-06", kilogram: 78, calories: 162 },
      { day: "2020-07-07", kilogram: 76, calories: 390 },
    ],
  },
};

/**
 * Données de sessions moyennes simulées pour l'utilisateur par défaut (12)
 * @type {Object}
 * @property {Object} data - Conteneur des données
 * @property {number} data.userId - ID de l'utilisateur
 * @property {SessionLength[]} data.sessions - Durées de sessions par jour de la semaine
 *
 * @example
 * console.log(mockSessionsData.data.sessions[0]);
 * // { day: 1, sessionLength: 30 } // Lundi: 30 minutes
 */
// Données de sessions simulées
export const mockSessionsData = {
  data: {
    userId: 12,
    sessions: [
      { day: 1, sessionLength: 30 },
      { day: 2, sessionLength: 23 },
      { day: 3, sessionLength: 45 },
      { day: 4, sessionLength: 50 },
      { day: 5, sessionLength: 0 },
      { day: 6, sessionLength: 0 },
      { day: 7, sessionLength: 60 },
    ],
  },
};

/**
 * Données de performance simulées pour l'utilisateur par défaut (12)
 * @type {Object}
 * @property {Object} data - Conteneur des données
 * @property {number} data.userId - ID de l'utilisateur
 * @property {Object<number, string>} data.kind - Mapping des types de performance
 * @property {PerformanceValue[]} data.data - Valeurs de performance par type
 *
 * @example
 * console.log(mockPerformanceData.data.kind[1]); // "cardio"
 * console.log(mockPerformanceData.data.data[0]); // { value: 80, kind: 1 }
 */
// Données de performance simulées
export const mockPerformanceData = {
  data: {
    userId: 12,
    kind: {
      1: "cardio",
      2: "energy",
      3: "endurance",
      4: "strength",
      5: "speed",
      6: "intensity",
    },
    data: [
      { value: 80, kind: 1 },
      { value: 120, kind: 2 },
      { value: 140, kind: 3 },
      { value: 50, kind: 4 },
      { value: 200, kind: 5 },
      { value: 90, kind: 6 },
    ],
  },
};

/**
 * Données utilisateur simulées pour l'utilisateur par défaut (12)
 * @type {Object}
 * @property {Object} data - Conteneur des données
 * @property {number} data.id - ID de l'utilisateur
 * @property {Object} data.userInfos - Informations personnelles
 * @property {string} data.userInfos.firstName - Prénom
 * @property {string} data.userInfos.lastName - Nom de famille
 * @property {number} data.userInfos.age - Âge
 * @property {number} data.todayScore - Score du jour (0-1)
 * @property {Object} data.keyData - Statistiques nutritionnelles
 * @property {number} data.keyData.calorieCount - Calories totales
 * @property {number} data.keyData.proteinCount - Protéines en grammes
 * @property {number} data.keyData.carbohydrateCount - Glucides en grammes
 * @property {number} data.keyData.lipidCount - Lipides en grammes
 *
 * @example
 * console.log(mockUserData.data.userInfos.firstName); // "Karl"
 * console.log(mockUserData.data.todayScore); // 0.12 (12%)
 */
// Données utilisateur simulées
export const mockUserData = {
  data: {
    id: 12,
    userInfos: {
      firstName: "Karl",
      lastName: "Dovineau",
      age: 31,
    },
    todayScore: 0.12,
    keyData: {
      calorieCount: 1930,
      proteinCount: 155,
      carbohydrateCount: 290,
      lipidCount: 50,
    },
  },
};

/**
 * Crée un service mock avec des méthodes asynchrones simulées
 *
 * @function createMockService
 * @returns {Object} Service mock avec méthodes async pour tous les endpoints
 *
 * @example
 * // Utilisation en mode développement
 * const mockService = createMockService();
 * const user = await mockService.getUserById();
 * const activity = await mockService.getUserActivity();
 *
 * @example
 * // Remplacement temporaire de l'API
 * const apiService = import.meta.env.DEV ? createMockService() : realApiService;
 */
export const createMockService = () => ({
  /**
   * Récupère les données utilisateur mockées
   * @returns {Promise<Object>} Données utilisateur simulées
   */
  async getUserById() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUserData), 500);
    });
  },

  /**
   * Récupère les données d'activité mockées
   * @returns {Promise<Object>} Données d'activité simulées
   */
  async getUserActivity() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockActivityData), 500);
    });
  },

  /**
   * Récupère les données de sessions moyennes mockées
   * @returns {Promise<Object>} Données de sessions simulées
   */
  async getUserAverageSessions() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSessionsData), 500);
    });
  },

  /**
   * Récupère les données de performance mockées
   * @returns {Promise<Object>} Données de performance simulées
   */
  async getUserPerformance() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPerformanceData), 500);
    });
  },
});

/**
 * Données d'activité simulées pour l'utilisateur 18 (Cecilia)
 * @type {Object}
 * @see mockActivityData Structure identique mais valeurs spécifiques à l'utilisateur 18
 */
// Données spécifiques pour l'utilisateur 18
export const mockActivityDataUser18 = {
  data: {
    userId: 18,
    sessions: [
      { day: "2020-07-01", kilogram: 70, calories: 300 },
      { day: "2020-07-02", kilogram: 69, calories: 350 },
      { day: "2020-07-03", kilogram: 70, calories: 320 },
      { day: "2020-07-04", kilogram: 70, calories: 280 },
      { day: "2020-07-05", kilogram: 69, calories: 400 },
      { day: "2020-07-06", kilogram: 68, calories: 450 },
      { day: "2020-07-07", kilogram: 67, calories: 380 },
    ],
  },
};

/**
 * Données de sessions simulées pour l'utilisateur 18 (Cecilia)
 * @type {Object}
 * @see mockSessionsData Structure identique mais valeurs spécifiques à l'utilisateur 18
 */
export const mockSessionsDataUser18 = {
  data: {
    userId: 18,
    sessions: [
      { day: 1, sessionLength: 45 },
      { day: 2, sessionLength: 35 },
      { day: 3, sessionLength: 60 },
      { day: 4, sessionLength: 25 },
      { day: 5, sessionLength: 55 },
      { day: 6, sessionLength: 40 },
      { day: 7, sessionLength: 70 },
    ],
  },
};

/**
 * Données de performance simulées pour l'utilisateur 18 (Cecilia)
 * @type {Object}
 * @see mockPerformanceData Structure identique mais valeurs spécifiques à l'utilisateur 18
 */
export const mockPerformanceDataUser18 = {
  data: {
    userId: 18,
    kind: {
      1: "cardio",
      2: "energy",
      3: "endurance",
      4: "strength",
      5: "speed",
      6: "intensity",
    },
    data: [
      { value: 150, kind: 1 },
      { value: 180, kind: 2 },
      { value: 200, kind: 3 },
      { value: 90, kind: 4 },
      { value: 250, kind: 5 },
      { value: 160, kind: 6 },
    ],
  },
};

/**
 * Données utilisateur simulées pour l'utilisateur 18 (Cecilia)
 * @type {Object}
 * @see mockUserData Structure identique mais valeurs spécifiques à l'utilisateur 18
 */
export const mockUserDataUser18 = {
  data: {
    id: 18,
    userInfos: {
      firstName: "Cecilia",
      lastName: "Ratorez",
      age: 34,
    },
    todayScore: 0.3,
    keyData: {
      calorieCount: 2103,
      proteinCount: 132,
      carbohydrateCount: 271,
      lipidCount: 68,
    },
  },
};

/**
 * Centralisation des données mockées pour compatibilité avec UserModel
 *
 * @type {Object<string, Function>}
 * @description Mapping endpoint → fonction retournant les données mockées
 *
 * @example
 * // Récupération des données pour un endpoint
 * const userData = mockData["/user/18"]();
 * const activity = mockData["/user/18/activity"]();
 */
const mockData = {
  "/user/12": () => mockUserData.data,
  "/user/12/activity": () => mockActivityData.data,
  "/user/12/average-sessions": () => mockSessionsData.data,
  "/user/12/performance": () => mockPerformanceData.data,
  // Données spécifiques pour l'utilisateur 18
  "/user/18": () => mockUserDataUser18.data,
  "/user/18/activity": () => mockActivityDataUser18.data,
  "/user/18/average-sessions": () => mockSessionsDataUser18.data,
  "/user/18/performance": () => mockPerformanceDataUser18.data,
};

/**
 * Détermine si l'application doit utiliser les données mockées
 *
 * @function isDevelopmentMode
 * @returns {boolean} true si en mode développement sans API réelle activée
 *
 * @example
 * // Utilisation pour le choix du service
 * const service = isDevelopmentMode() ? createMockService() : realApiService;
 *
 * @example
 * // Vérification dans un composant
 * if (isDevelopmentMode()) {
 *   console.log('Mode développement: utilisation des données mockées');
 * }
 */
export const isDevelopmentMode = () => {
  return import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API;
};

/**
 * Export par défaut regroupant toutes les données et utilitaires mock
 *
 * @type {Object}
 * @property {Object} mockActivityData - Données d'activité utilisateur 12
 * @property {Object} mockSessionsData - Données de sessions utilisateur 12
 * @property {Object} mockPerformanceData - Données de performance utilisateur 12
 * @property {Object} mockUserData - Données utilisateur 12
 * @property {Object} mockActivityDataUser18 - Données d'activité utilisateur 18
 * @property {Object} mockSessionsDataUser18 - Données de sessions utilisateur 18
 * @property {Object} mockPerformanceDataUser18 - Données de performance utilisateur 18
 * @property {Object} mockUserDataUser18 - Données utilisateur 18
 * @property {Function} createMockService - Générateur de service mock
 * @property {Function} isDevelopmentMode - Détecteur de mode développement
 * @property {Object} mockData - Mapping centralisé des endpoints
 */
export default {
  mockActivityData,
  mockSessionsData,
  mockPerformanceData,
  mockUserData,
  mockActivityDataUser18,
  mockSessionsDataUser18,
  mockPerformanceDataUser18,
  mockUserDataUser18,
  createMockService,
  isDevelopmentMode,
  mockData,
};

/**
 * Export direct du mapping des données mockées pour faciliter l'import
 * @type {Object<string, Function>}
 */

export { mockData };
