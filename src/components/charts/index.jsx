/**
 * Module d'export centralisé des composants de graphiques SportSee
 * 
 * Ce fichier sert de point d'entrée unique pour tous les composants de graphiques,
 * facilitant les imports dans les autres parties de l'application.
 * 
 * @module components/charts
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @example
 * // Import de tous les graphiques
 * import { ActivityChart, SessionsChart, PerformanceChart, ScoreChart } from '../components/charts/index.jsx';
 * 
 * @example
 * // Import sélectif
 * import { ActivityChart, ScoreChart } from '../components/charts/index.jsx';
 * 
 * @example
 * // Utilisation dans un composant
 * function Dashboard({ userId }) {
 *   return (
 *     <div className="charts-grid">
 *       <ActivityChart userId={userId} />
 *       <SessionsChart userId={userId} />
 *       <PerformanceChart userId={userId} />
 *       <ScoreChart userId={userId} />
 *     </div>
 *   );
 * }
 * 
 * @description
 * Composants exportés :
 * - ActivityChart : Graphique d'activité quotidienne (poids + calories)
 * - SessionsChart : Graphique des durées moyennes de sessions
 * - PerformanceChart : Graphique radar de performance sportive
 * - ScoreChart : Graphique circulaire du score quotidien
 * 
 * Architecture :
 * Chaque graphique est un composant autonome qui :
 * - Récupère ses données via un hook personnalisé (chartHooks.js)
 * - Gère ses états de chargement et d'erreur
 * - Utilise des transformateurs pour formater les données (ChartTransformers.js)
 * - S'appuie sur la bibliothèque Recharts pour le rendu visuel
 */

import ActivityChartReal from "./ActivityChart.jsx";
import SessionsChartReal from "./SessionsChart.jsx";
import PerformanceChartReal from "./PerformanceChart.jsx";
import ScoreChartReal from "./ScoreChart.jsx";

/**
 * Composant de graphique d'activité quotidienne
 * @type {React.Component}
 * @see ActivityChart
 */
const ActivityChart = ActivityChartReal;

/**
 * Composant de graphique de sessions moyennes
 * @type {React.Component}
 * @see SessionsChart
 */
const SessionsChart = SessionsChartReal;

/**
 * Composant de graphique radar de performance
 * @type {React.Component}
 * @see PerformanceChart
 */
const PerformanceChart = PerformanceChartReal;

/**
 * Composant de graphique de score quotidien
 * @type {React.Component}
 * @see ScoreChart
 */
const ScoreChart = ScoreChartReal;

export { ActivityChart, SessionsChart, PerformanceChart, ScoreChart };
