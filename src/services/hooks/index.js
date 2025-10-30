/**
 * Module des hooks React SportSee
 *
 * Ce module regroupe tous les hooks personnalisés de l'application,
 * des hooks génériques aux hooks spécialisés pour les graphiques.
 *
 * @module services/hooks
 * @author SportSee Team
 * @since 1.0.0
 */

// Export du hook générique
export { useApiData, useUserData, useChartData } from "./useApiData.js";

// Export des hooks utilisateur basiques
export {
  useUser,
  useUserActivity,
  useUserSessions,
  useUserPerformance,
} from "./hooks.js";

// Export des hooks spécialisés pour graphiques
export {
  useActivityChart,
  useSessionsChart,
  usePerformanceChart,
  useScoreChart,
  useAllCharts,
} from "./chartHooks.js";
