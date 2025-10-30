/**
 * Hooks React spécialisés pour les composants graphiques SportSee
 *
 * Ce module fournit des hooks personnalisés pour chaque type de graphique,
 * utilisant la nouvelle architecture avec transformateurs séparés.
 *
 * @module services/hooks/chartHooks
 * @requires react
 * @requires ../api/DataService.js
 * @requires ../transformers/ChartTransformers.js
 * @requires ./useApiData.js
 * @author SportSee Team
 * @since 1.0.0
 *
 * @example
 * // Import des hooks spécialisés
 * import { useActivityChart, useSessionsChart } from './services/hooks/chartHooks.js';
 *
 * @example
 * // Import via le fichier index
 * import { useActivityChart, useSessionsChart } from './services/hooks/index.js';
 *
 * @example
 * // Utilisation dans un composant de graphique
 * function ActivityChart({ userId }) {
 *   const { data, loading, error } = useActivityChart(userId);
 *
 *   if (loading) return <ChartLoader />;
 *   if (error) return <ChartError error={error} />;
 *
 *   return <BarChart data={data.sessions} />;
 * }
 * 
 * @description
 * Architecture des hooks de graphiques :
 * - Chaque hook utilise useChartData (wrapper de useApiData)
 * - Récupération via DataService (mode API ou Mock)
 * - Transformation via ChartTransformers pour formatage spécifique
 * - Gestion automatique du loading, error et data
 * 
 * Flux de données :
 * 1. Hook appelé avec userId
 * 2. DataService récupère les données brutes (API ou Mock)
 * 3. DataNormalizer normalise les données (correction des inconsistances)
 * 4. ChartTransformer formate pour le graphique spécifique
 * 5. Hook retourne {data, loading, error}
 */
import { useChartData } from "./useApiData.js";
import { DataService } from "../api/DataService.js";
import { ChartTransformers } from "../transformers/ChartTransformers.js";

/**
 * Type de retour pour les hooks de graphiques
 * @typedef {Object} ChartHookState
 * @property {*} data - Données formatées pour le graphique (null si pas chargées)
 * @property {boolean} loading - Indicateur de chargement
 * @property {string|null} error - Message d'erreur éventuel
 */

/**
 * Hook spécialisé pour le graphique d'activité quotidienne
 *
 * Formate les données d'activité pour un graphique en barres combiné
 * affichant le poids et les calories brûlées par jour.
 *
 * @function useActivityChart
 * @param {number} userId - ID de l'utilisateur
 * @returns {ChartHookState} État avec données formatées pour graphique d'activité
 *
 * @example
 * function ActivityChart({ userId }) {
 *   const { data, loading, error } = useActivityChart(userId);
 *
 *   if (loading) return <div>Chargement du graphique...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *   if (!data?.sessions) return <div>Aucune donnée d'activité</div>;
 *
 *   return (
 *     <ComposedChart data={data.sessions}>
 *       <Bar dataKey="kilogram" fill="#282D30" />
 *       <Bar dataKey="calories" fill="#E60000" />
 *     </ComposedChart>
 *   );
 * }
 *
 * @example
 * // Structure des données retournées
 * // data.sessions = [
 * //   { day: 1, kilogram: 70, calories: 300, displayDay: "1" },
 * //   { day: 2, kilogram: 69, calories: 350, displayDay: "2" },
 * //   ...
 * // ]
 */
export const useActivityChart = (userId) => {
  return useChartData(
    DataService.getUserActivity,
    ChartTransformers.Activity.format,
    userId
  );
};

/**
 * Hook spécialisé pour le graphique des sessions moyennes
 *
 * Formate les données de sessions avec ajout de points fantômes
 * pour améliorer le rendu visuel du graphique en ligne.
 *
 * @function useSessionsChart
 * @param {number} userId - ID de l'utilisateur
 * @returns {ChartHookState} État avec données formatées incluant points fantômes
 *
 * @example
 * function SessionsChart({ userId }) {
 *   const { data, loading, error } = useSessionsChart(userId);
 *
 *   if (loading) return <div>Chargement des sessions...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
 *
 *   return (
 *     <LineChart data={data.sessions}>
 *       <XAxis
 *         dataKey="day"
 *         tickFormatter={(day) => day === 0 || day === 8 ? '' : dayNames[day - 1]}
 *       />
 *       <Line
 *         dataKey="sessionLength"
 *         dot={(props) => props.payload.isGhost ? null : <Dot {...props} />}
 *       />
 *     </LineChart>
 *   );
 * }
 *
 * @example
 * // Structure des données retournées avec points fantômes
 * // data.sessions = [
 * //   { day: 0, sessionLength: 45, isReal: false, isGhost: true },    // Point fantôme début
 * //   { day: 1, sessionLength: 45, isReal: true },                    // Lundi
 * //   { day: 2, sessionLength: 35, isReal: true },                    // Mardi
 * //   ...
 * //   { day: 7, sessionLength: 70, isReal: true },                    // Dimanche
 * //   { day: 8, sessionLength: 70, isReal: false, isGhost: true }     // Point fantôme fin
 * // ]
 */
export const useSessionsChart = (userId) => {
  return useChartData(
    DataService.getUserAverageSessions,
    ChartTransformers.Sessions.addGhostPoints,
    userId
  );
};

/**
 * Hook spécialisé pour le graphique radar de performance
 *
 * Transforme et réordonne les données de performance pour un affichage
 * optimisé dans un graphique radar avec traductions françaises.
 *
 * @function usePerformanceChart
 * @param {number} userId - ID de l'utilisateur
 * @returns {ChartHookState} État avec données formatées et réordonnées pour radar
 *
 * @example
 * function PerformanceRadar({ userId }) {
 *   const { data, loading, error } = usePerformanceChart(userId);
 *
 *   if (loading) return <div>Chargement performance...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   return (
 *     <RadarChart data={data}>
 *       <PolarGrid />
 *       <PolarAngleAxis
 *         dataKey="subject"
 *         tick={{ fontSize: 12, fill: '#FFFFFF' }}
 *       />
 *       <Radar
 *         dataKey="value"
 *         stroke="#FF0101"
 *         fill="#FF0101"
 *         fillOpacity={0.7}
 *       />
 *     </RadarChart>
 *   );
 * }
 *
 * @example
 * // Structure des données retournées (ordre spécifique pour le radar)
 * // data = [
 * //   { subject: "Intensité", value: 160, fullMark: 250 },
 * //   { subject: "Vitesse", value: 250, fullMark: 250 },
 * //   { subject: "Force", value: 90, fullMark: 250 },
 * //   { subject: "Endurance", value: 200, fullMark: 250 },
 * //   { subject: "Énergie", value: 180, fullMark: 250 },
 * //   { subject: "Cardio", value: 150, fullMark: 250 }
 * // ]
 */
export const usePerformanceChart = (userId) => {
  return useChartData(
    DataService.getUserPerformance,
    ChartTransformers.Performance.formatForRadar,
    userId
  );
};

/**
 * Hook spécialisé pour le graphique de score du jour
 *
 * Calcule et formate le pourcentage de réalisation de l'objectif quotidien
 * à partir du score utilisateur (todayScore ou score).
 *
 * @function useScoreChart
 * @param {number} userId - ID de l'utilisateur
 * @returns {ChartHookState} État avec pourcentage calculé pour graphique circulaire
 *
 * @example
 * function ScoreChart({ userId }) {
 *   const { data, loading, error } = useScoreChart(userId);
 *
 *   if (loading) return <div>Chargement score...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   const scoreData = [
 *     { name: 'completed', value: data.percentage, fill: '#FF0000' },
 *     { name: 'remaining', value: 100 - data.percentage, fill: 'transparent' }
 *   ];
 *
 *   return (
 *     <PieChart>
 *       <Pie
 *         data={scoreData}
 *         dataKey="value"
 *         startAngle={90}
 *         endAngle={450}
 *         innerRadius={70}
 *         outerRadius={80}
 *       />
 *       <text x="50%" y="50%" textAnchor="middle">
 *         <tspan fontSize="26" fontWeight="700">{data.percentage}%</tspan>
 *         <tspan x="50%" dy="25" fontSize="16">de votre objectif</tspan>
 *       </text>
 *     </PieChart>
 *   );
 * }
 *
 * @example
 * // Structure des données retournées
 * // data = { percentage: 30 }  // Si todayScore = 0.3
 */
export const useScoreChart = (userId) => {
  return useChartData(
    DataService.getUserById,
    ChartTransformers.Score.calculatePercentage,
    userId
  );
};

/**
 * Hook composite pour récupérer toutes les données de graphiques en une fois
 *
 * Combine tous les hooks de graphiques individuels pour un chargement
 * simultané et une gestion d'état globale.
 *
 * @function useAllCharts
 * @param {number} userId - ID de l'utilisateur
 * @returns {AllChartsState} État global de tous les graphiques
 *
 * @typedef {Object} AllChartsState
 * @property {*} activity - Données formatées du graphique d'activité
 * @property {*} sessions - Données formatées du graphique de sessions
 * @property {*} performance - Données formatées du graphique de performance
 * @property {*} score - Données formatées du graphique de score
 * @property {boolean} loading - true si au moins un graphique est en cours de chargement
 * @property {boolean} hasError - true si au moins un graphique a une erreur
 * @property {Object} errors - Détail des erreurs par graphique
 * @property {string|null} errors.activity - Erreur du graphique d'activité
 * @property {string|null} errors.sessions - Erreur du graphique de sessions
 * @property {string|null} errors.performance - Erreur du graphique de performance
 * @property {string|null} errors.score - Erreur du graphique de score
 *
 * @example
 * function Dashboard({ userId }) {
 *   const {
 *     activity,
 *     sessions,
 *     performance,
 *     score,
 *     loading,
 *     hasError,
 *     errors
 *   } = useAllCharts(userId);
 *
 *   if (loading) return <DashboardSkeleton />;
 *
 *   return (
 *     <div className="dashboard">
 *       {hasError && <ErrorBanner errors={errors} />}
 *
 *       <div className="charts-grid">
 *         {activity && <ActivityChart data={activity} />}
 *         {sessions && <SessionsChart data={sessions} />}
 *         {performance && <PerformanceChart data={performance} />}
 *         {score && <ScoreChart data={score} />}
 *       </div>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Gestion spécifique des erreurs par graphique
 * function ChartsContainer({ userId }) {
 *   const charts = useAllCharts(userId);
 *
 *   return (
 *     <div>
 *       {charts.errors.activity && <p>Impossible de charger l'activité</p>}
 *       {charts.activity && <ActivityChart data={charts.activity} />}
 *
 *       {charts.errors.sessions && <p>Impossible de charger les sessions</p>}
 *       {charts.sessions && <SessionsChart data={charts.sessions} />}
 *     </div>
 *   );
 * }
 */
export const useAllCharts = (userId) => {
  const activity = useActivityChart(userId);
  const sessions = useSessionsChart(userId);
  const performance = usePerformanceChart(userId);
  const score = useScoreChart(userId);

  const globalLoading =
    activity.loading ||
    sessions.loading ||
    performance.loading ||
    score.loading;

  const hasError =
    activity.error || sessions.error || performance.error || score.error;

  return {
    activity: activity.data,
    sessions: sessions.data,
    performance: performance.data,
    score: score.data,
    loading: globalLoading,
    error: hasError,
    errors: {
      activity: activity.error,
      sessions: sessions.error,
      performance: performance.error,
      score: score.error,
    },
  };
};
