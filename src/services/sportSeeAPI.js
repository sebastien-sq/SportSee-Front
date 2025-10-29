/**
 * Service API simplifié pour SportSee - Compatible avec DataService
 */

import { DataService } from "./DataService.js";

/**
 * Service principal utilisant la nouvelle classe DataService
 * Pour changer entre mock et API, modifiez DataService.USE_MOCK_DATA
 */
export const sportSeeAPI = {
  async getUserById(userId = 18) {
    return await DataService.getUserById(userId);
  },

  async getUserActivity(userId = 18) {
    return await DataService.getUserActivity(userId);
  },

  async getUserAverageSessions(userId = 18) {
    return await DataService.getUserAverageSessions(userId);
  },

  async getUserPerformance(userId = 18) {
    return await DataService.getUserPerformance(userId);
  },

  // Méthodes utilitaires
  setMockMode: DataService.setMockMode,
  getCurrentMode: DataService.getCurrentMode,
};

export default sportSeeAPI;
