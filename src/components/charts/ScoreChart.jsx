/**
 * Composant graphique circulaire de score quotidien SportSee
 *
 * Affiche le pourcentage de réalisation de l'objectif quotidien sous forme
 * de graphique en secteurs (doughnut chart) avec texte central.
 * Utilise todayScore ou score depuis les données utilisateur.
 *
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {number} [props.userId=18] - ID de l'utilisateur pour lequel afficher le score
 * @returns {JSX.Element} Graphique circulaire de score ou état de chargement/erreur
 *
 * @example
 * // Utilisation basique avec utilisateur par défaut
 * <ScoreChart />
 *
 * @example
 * // Utilisation avec utilisateur spécifique
 * <ScoreChart userId={12} />
 *
 * @example
 * // Intégration dans une grille de graphiques
 * function MetricsGrid({ userId }) {
 *   return (
 *     <div className="metrics-grid">
 *       <ScoreChart userId={userId} />
 *     </div>
 *   );
 * }
 *
 * @description
 * Caractéristiques visuelles :
 * - Graphique en anneau (doughnut) avec rayon interne 60% et externe 75%
 * - Arc rouge (#FF0101) représentant le score réalisé
 * - Arc transparent pour la partie restante
 * - Coins arrondis (cornerRadius: 15)
 * - Rotation : commence en haut (90°) et fait un tour complet (450°)
 * - Texte centré affichant le pourcentage et le label
 * 
 * Structure des données :
 * - Score actuel : Arc rouge avec le pourcentage réalisé
 * - Reste : Arc transparent (100 - pourcentage)
 *
 * @requires react
 * @requires recharts - Pour ResponsiveContainer, PieChart, Pie, Cell
 * @requires ../../services/hooks/chartHooks.js - Hook useScoreChart
 * @requires ./charts.css - Styles des graphiques
 * @uses {ChartHookState<FormattedScoreData>} useScoreChart
 * @author SportSee Team
 * @since 1.0.0
 */
import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useScoreChart } from '../../services/hooks/chartHooks.js';
import './charts.css';

const ScoreChart = ({ userId = 18 }) => {
  const { data, loading, error } = useScoreChart(userId);

  if (loading) {
    return <div className="chart-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="chart-error">Erreur: {error}</div>;
  }

  if (!data) {
    return <div className="chart-empty">Aucune donnée</div>;
  }

  // Récupération du pourcentage transformé
  const scorePercentage = data.percentage;

  // Données pour le graphique en secteurs
  const chartData = [
    { name: 'Score', value: scorePercentage, fill: '#FF0101' },
    { name: 'Reste', value: 100 - scorePercentage, fill: 'transparent' }
  ];

  return (
    <div className="score-chart">
      <h3 className="chart-title">Score</h3>

      <div className="score-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={450}
              innerRadius="60%"
              outerRadius="75%"
              dataKey="value"
              cornerRadius={15}
              paddingAngle={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="score-content">
          <div className="score-percentage">{scorePercentage}%</div>
          <div className="score-label">de votre</div>
          <div className="score-label">objectif</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
