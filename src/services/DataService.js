/**
 * Classe de modélisation SportSee
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
  } from "./mockData.js";
  
  export class DataService {
    static USE_MOCK_DATA = false; // true = données mockées, false = API réelle
  
    static API_BASE_URL = "http://localhost:3000";
    static DEFAULT_USER_ID = 18;
  
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
     */
    static _getMockData(endpoint) {
      const mockFunction = DataService.mockDataMap[endpoint];
  
      if (!mockFunction) {
        throw new Error(`Données mockées non trouvées pour: ${endpoint}`);
      }
  
      const data = mockFunction();
      return data;
    }
  
    /**
     * Récupération des données depuis l'API
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
        const data = result.data; // Structure API SportSee
  
        return data;
      } catch (error) {
        throw new Error(`Échec de l'appel API: ${error.message}`);
      }
    }
  
    /**
     * Méthodes spécialisées pour chaque endpoint
     */
    static async getUserById(userId = DataService.DEFAULT_USER_ID) {
      return await DataService.fetchData(`/user/${userId}`);
    }
  
    static async getUserActivity(userId = DataService.DEFAULT_USER_ID) {
      return await DataService.fetchData(`/user/${userId}/activity`);
    }
  
    static async getUserAverageSessions(userId = DataService.DEFAULT_USER_ID) {
      return await DataService.fetchData(`/user/${userId}/average-sessions`);
    }
  
    static async getUserPerformance(userId = DataService.DEFAULT_USER_ID) {
      return await DataService.fetchData(`/user/${userId}/performance`);
    }
  
    /**
     * Méthode utilitaire pour basculer le mode
     */
    static setMockMode(useMock) {
      DataService.USE_MOCK_DATA = useMock;
    }
  
    /**
     * Méthode utilitaire pour obtenir le mode actuel
     */
    static getCurrentMode() {
      return DataService.USE_MOCK_DATA ? "MOCK" : "API";
    }
  }
  
  // Export par défaut pour compatibilité
  export default DataService;
  