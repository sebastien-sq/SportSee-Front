/**
 * Service de données principal pour l'application SportSee
 *
 * Cette classe fournit une interface unifiée pour récupérer les données utilisateur
 * depuis l'API ou depuis des données mockées pour le développement.
 *
 * @class DataService
 * @author SportSee Team
 * @since 1.0.0
 * @example
 * // Utilisation en mode API
 * DataService.setMockMode(false);
 * const userData = await DataService.getUserById(18);
 *
 * // Utilisation en mode mock
 * DataService.setMockMode(true);
 * const activity = await DataService.getUserActivity(18);
 */

import {
  mockUserData,
  mockActivityData,
  mockSessionsData,
  mockPerformanceData,
  mockUserDataUser18,
  mockActivityDataUser18,
  mockSessionsDataUser18,
  mockPerformanceDataUser18,
} from "../data/mockData.js";

import { DataNormalizer } from "../data/DataNormalizer.js";

export class DataService {
  /**
   * Mode d'utilisation des données (mock ou API réelle)
   * @type {boolean}
   * @static
   * @default false
   * @description true = données mockées, false = API réelle
   */
  static USE_MOCK_DATA = true; // true = données mockées, false = API réelle

  /**
   * URL de base de l'API SportSee
   * @type {string}
   * @static
   * @readonly
   */
  static API_BASE_URL = "http://localhost:3000";

  /**
   * ID utilisateur par défaut
   * @type {number}
   * @static
   * @readonly
   */
  static DEFAULT_USER_ID = 18;

  /**
   * Carte des données mockées organisées par endpoint
   * @type {Object<string, Function>}
   * @static
   * @readonly
   * @description Chaque clé correspond à un endpoint API et chaque valeur est une fonction retournant les données mockées
   */
  // Données mockées organisées par endpoint
  static mockDataMap = {
    // Utilisateur 18 - Cecilia (données spécifiques)
    [`/user/${DataService.DEFAULT_USER_ID}`]: () => mockUserDataUser18.data,
    [`/user/${DataService.DEFAULT_USER_ID}/activity`]: () =>
      mockActivityDataUser18.data,
    [`/user/${DataService.DEFAULT_USER_ID}/average-sessions`]: () =>
      mockSessionsDataUser18.data,
    [`/user/${DataService.DEFAULT_USER_ID}/performance`]: () =>
      mockPerformanceDataUser18.data,
    // Utilisateur 12 - Karl (données originales)
    ["/user/12"]: () => mockUserData.data,
    ["/user/12/activity"]: () => mockActivityData.data,
    ["/user/12/average-sessions"]: () => mockSessionsData.data,
    ["/user/12/performance"]: () => mockPerformanceData.data,
  };

  /**
   * Méthode principale pour récupérer des données
   *
   * @static
   * @async
   * @param {string} endpoint - L'endpoint de l'API (ex: "/user/18", "/user/18/activity")
   * @returns {Promise<Object>} Les données récupérées depuis l'API ou les données mockées
   * @throws {Error} Erreur si l'endpoint n'existe pas ou si l'appel API échoue
   *
   * @example
   * // Récupération des données utilisateur
   * const userData = await DataService.fetchData("/user/18");
   *
   * @example
   * // Récupération de l'activité utilisateur
   * const activity = await DataService.fetchData("/user/18/activity");
   */
  static async fetchData(endpoint) {
    if (DataService.USE_MOCK_DATA) {
      return DataService._getMockData(endpoint);
    } else {
      return DataService._getApiData(endpoint);
    }
  }

  /**
   * Récupération des données mockées
   *
   * @static
   * @private
   * @param {string} endpoint - L'endpoint pour lequel récupérer les données mockées
   * @returns {Object} Les données mockées correspondantes
   * @throws {Error} Si aucune donnée mockée n'est trouvée pour cet endpoint
   */
  static _getMockData(endpoint) {
    const mockFunction = DataService.mockDataMap[endpoint];

    if (!mockFunction) {
      throw new Error(`Données mockées non trouvées pour: ${endpoint}`);
    }

    const rawData = mockFunction();

    // ✅ Application de la normalisation aussi sur les données mockées
    const normalizedData = DataNormalizer.normalizeByEndpoint(
      endpoint,
      rawData
    );

    return normalizedData;
  }

  /**
   * Récupération des données depuis l'API SportSee
   *
   * @static
   * @async
   * @private
   * @param {string} endpoint - L'endpoint de l'API à appeler
   * @returns {Promise<Object>} Les données retournées par l'API
   * @throws {Error} Erreur HTTP ou erreur de réseau
   *
   * @example
   * // Appel interne pour récupérer les données utilisateur
   * const data = await DataService._getApiData("/user/18");
   */
  static async _getApiData(endpoint) {
    try {
      const response = await fetch(`${DataService.API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();
      const rawData = result.data; // Structure API SportSee

      // ✅ Application de la normalisation selon le type d'endpoint
      const normalizedData = DataNormalizer.normalizeByEndpoint(
        endpoint,
        rawData
      );

      return normalizedData;
    } catch (error) {
      throw new Error(`Échec de l'appel API: ${error.message}`);
    }
  }

  /**
   * Récupère les informations d'un utilisateur par son ID
   *
   * @static
   * @async
   * @param {number} [userId=DataService.DEFAULT_USER_ID] - ID de l'utilisateur
   * @returns {Promise<UserData>} Les données de l'utilisateur
   * @throws {Error} Erreur si l'utilisateur n'existe pas ou si l'API échoue
   *
   * @typedef {Object} UserData
   * @property {number} id - ID de l'utilisateur
   * @property {Object} userInfos - Informations personnelles
   * @property {string} userInfos.firstName - Prénom
   * @property {string} userInfos.lastName - Nom de famille
   * @property {number} userInfos.age - Âge
   * @property {number} todayScore - Score du jour (0-1)
   * @property {Object} keyData - Données clés
   * @property {number} keyData.calorieCount - Calories
   * @property {number} keyData.proteinCount - Protéines (g)
   * @property {number} keyData.carbohydrateCount - Glucides (g)
   * @property {number} keyData.lipidCount - Lipides (g)
   *
   * @example
   * // Récupération des données de l'utilisateur 18
   * const user = await DataService.getUserById(18);
   * console.log(user.userInfos.firstName); // "Cecilia"
   *
   * @example
   * // Utilisation avec l'ID par défaut
   * const defaultUser = await DataService.getUserById();
   */
  static async getUserById(userId = DataService.DEFAULT_USER_ID) {
    return await DataService.fetchData(`/user/${userId}`);
  }

  /**
   * Récupère les données d'activité d'un utilisateur
   *
   * @static
   * @async
   * @param {number} [userId=DataService.DEFAULT_USER_ID] - ID de l'utilisateur
   * @returns {Promise<ActivityData>} Les données d'activité de l'utilisateur
   * @throws {Error} Erreur si les données n'existent pas ou si l'API échoue
   *
   * @typedef {Object} ActivityData
   * @property {number} userId - ID de l'utilisateur
   * @property {ActivitySession[]} sessions - Tableau des sessions d'activité
   *
   * @typedef {Object} ActivitySession
   * @property {string} day - Date de la session (format YYYY-MM-DD)
   * @property {number} kilogram - Poids en kilogrammes
   * @property {number} calories - Calories brûlées
   *
   * @example
   * const activity = await DataService.getUserActivity(18);
   * console.log(activity.sessions[0].kilogram); // 70
   */
  static async getUserActivity(userId = DataService.DEFAULT_USER_ID) {
    return await DataService.fetchData(`/user/${userId}/activity`);
  }

  /**
   * Récupère les données de durée moyenne des sessions d'un utilisateur
   *
   * @static
   * @async
   * @param {number} [userId=DataService.DEFAULT_USER_ID] - ID de l'utilisateur
   * @returns {Promise<SessionsData>} Les données de sessions moyennes
   * @throws {Error} Erreur si les données n'existent pas ou si l'API échoue
   *
   * @typedef {Object} SessionsData
   * @property {number} userId - ID de l'utilisateur
   * @property {SessionLength[]} sessions - Tableau des durées de sessions
   *
   * @typedef {Object} SessionLength
   * @property {number} day - Jour de la semaine (1=Lundi, 7=Dimanche)
   * @property {number} sessionLength - Durée de la session en minutes
   *
   * @example
   * const sessions = await DataService.getUserAverageSessions(18);
   * console.log(sessions.sessions[0].sessionLength); // 45
   */
  static async getUserAverageSessions(userId = DataService.DEFAULT_USER_ID) {
    return await DataService.fetchData(`/user/${userId}/average-sessions`);
  }

  /**
   * Récupère les données de performance d'un utilisateur
   *
   * @static
   * @async
   * @param {number} [userId=DataService.DEFAULT_USER_ID] - ID de l'utilisateur
   * @returns {Promise<PerformanceData>} Les données de performance
   * @throws {Error} Erreur si les données n'existent pas ou si l'API échoue
   *
   * @typedef {Object} PerformanceData
   * @property {number} userId - ID de l'utilisateur
   * @property {Object<number, string>} kind - Mapping des types de performance
   * @property {PerformanceValue[]} data - Tableau des valeurs de performance
   *
   * @typedef {Object} PerformanceValue
   * @property {number} value - Valeur de la performance
   * @property {number} kind - ID du type de performance (référence vers le mapping kind)
   *
   * @example
   * const performance = await DataService.getUserPerformance(18);
   * console.log(performance.kind[1]); // "cardio"
   * console.log(performance.data[0].value); // 150
   */
  static async getUserPerformance(userId = DataService.DEFAULT_USER_ID) {
    return await DataService.fetchData(`/user/${userId}/performance`);
  }
}

/**
 * Export par défaut de la classe DataService pour compatibilité
 * @type {DataService}
 */

export default DataService;
