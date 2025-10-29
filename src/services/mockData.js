/**
 * Données de démonstration pour tester les graphiques
 * Utilisez ces données si votre backend n'est pas encore disponible
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
   * Mode développement - utilise les données mockées si l'API échoue
   */
  export const createMockService = () => ({
    async getUserById() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockUserData), 500);
      });
    },
  
    async getUserActivity() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockActivityData), 500);
      });
    },
  
    async getUserAverageSessions() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockSessionsData), 500);
      });
    },
  
    async getUserPerformance() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockPerformanceData), 500);
      });
    },
  });
  
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
  
  // Centralisation des données mockées pour compatibilité avec UserModel
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
   * Fonction pour basculer entre API réelle et données mockées
   */
  export const isDevelopmentMode = () => {
    return import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API;
  };
  
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
  
  // Export direct pour faciliter l'import
  export { mockData };
  