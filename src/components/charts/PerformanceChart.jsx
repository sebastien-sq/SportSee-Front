/**
 * Composant graphique radar de performance SportSee
 *
 * Affiche un graphique radar des performances sportives de l'utilisateur
 * avec les catégories : Cardio, Énergie, Endurance, Force, Vitesse, Intensité.
 * Utilise les données formatées par le hook usePerformanceChart.
 *
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {number} [props.userId=18] - ID de l'utilisateur pour lequel afficher les performances
 * @returns {JSX.Element} Graphique radar de performance ou état de chargement/erreur
 *
 * @example
 * // Utilisation basique avec utilisateur par défaut
 * <PerformanceChart />
 *
 * @example
 * // Utilisation avec utilisateur spécifique
 * <PerformanceChart userId={12} />
 *
 * @example
 * // Intégration dans un dashboard
 * function UserDashboard({ userId }) {
 *   return (
 *     <div className="charts-container">
 *       <PerformanceChart userId={userId} />
 *       <ActivityChart userId={userId} />
 *     </div>
 *   );
 * }
 *
 * @description
 * Caractéristiques du graphique :
 * - Forme hexagonale (6 catégories de performance)
 * - Labels en français sur les axes polaires
 * - Couleur rouge (#FF0101) avec opacité 0.7
 * - Grille polaire pour faciliter la lecture
 * - Pas d'axe radial visible
 * - Fond sombre pour contraste optimal
 * 
 * Catégories affichées (dans l'ordre du radar) :
 * - Intensité, Vitesse, Force, Endurance, Énergie, Cardio
 *
 * @requires react
 * @requires recharts - Pour ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
 * @requires ../../services/hooks/chartHooks.js - Hook usePerformanceChart
 * @requires ./charts.css - Styles des graphiques
 * @uses {ChartHookState<FormattedPerformanceData[]>} usePerformanceChart
 * @author SportSee Team
 * @since 1.0.0
 */
import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { usePerformanceChart } from '../../services/hooks/chartHooks.js';
import './charts.css';

const PerformanceChart = ({ userId = 18 }) => {
  const { data, loading, error } = usePerformanceChart(userId);

  if (loading) {
    return <div className="chart-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="chart-error">Erreur: {error}</div>;
  }

  if (!data || !data.length) {
    return <div className="chart-empty">Aucune donnée disponible</div>;
  }

  return (
    <div className="performance-chart" style={{
      overflow: 'visible',
      padding: '10px' // Espace supplémentaire pour les labels
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 20, right: 25, bottom: 20, left: 25 }}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'white',
              fontSize: 12,
              textAnchor: 'middle'
            }}
            className="performance-radar-labels"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'dataMax']}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#FF0101"
            fill="#FF0101"
            fillOpacity={0.7}
            activeDot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
