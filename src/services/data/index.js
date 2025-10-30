/**
 * Module de gestion et normalisation des données SportSee
 *
 * Ce module regroupe tous les utilitaires de manipulation,
 * normalisation et mock des données de l'application.
 *
 * @module services/data
 * @author SportSee Team
 * @since 1.0.0
 */

// Export des services de normalisation
export { DataNormalizer } from "./DataNormalizer.js";

// Export des données mockées
export {
  mockUserData,
  mockActivityData,
  mockSessionsData,
  mockPerformanceData,
  mockUserDataUser18,
  mockActivityDataUser18,
  mockSessionsDataUser18,
  mockPerformanceDataUser18,
  createMockService,
} from "./mockData.js";
