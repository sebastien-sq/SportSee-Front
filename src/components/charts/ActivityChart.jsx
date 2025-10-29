/**
 * Composant graphique d'activité quotidienne
 * Graphique en barres combiné avec poids et calories
 */
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useActivityChart } from '../../services/chartHooks.js';

import ActivityTooltip from './ActivityTooltip.jsx';
import './charts.css';

/**
 * Composant principal du graphique d'activité
 */
const ActivityChart = ({ userId = 12 }) => {
  const { data, loading, error } = useActivityChart(userId);

  if (loading) {
    return <div className="chart-loading">Chargement...</div>;
  }
  if (error) {
    return <div className="chart-error">Erreur: {error}</div>;
  }
  if (!data || !data.sessions) {
    return <div className="chart-empty">Aucune donnée</div>;
  }

  // Calcul dynamique du domaine et des ticks pour le poids
  const weights = data.sessions.map((s) => s.kilogram);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  // On force 1 unité de marge en bas/haut
  const domainMin = min - 1;
  const domainMax = max + 1;
  // Générer un nombre de ticks adapté à l'écart du poids (entre 3 et 7)
  const range = domainMax - domainMin;
  let tickStep = 1;
  if (range > 6) tickStep = 2;
  if (range > 14) tickStep = 5;
  // Calcul du premier tick arrondi au multiple inférieur
  const firstTick = Math.floor(domainMin / tickStep) * tickStep;
  // Calcul du dernier tick arrondi au multiple supérieur
  const lastTick = Math.ceil(domainMax / tickStep) * tickStep;
  const ticks = [];
  for (let t = firstTick; t <= lastTick; t += tickStep) {
    ticks.push(t);
  }

  return (
    <div className="activity-chart">
      <div className="chart-header">
        <h3 className="chart-title">Activité quotidienne</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot--weight"></span>
            <span>Poids (kg)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--calories"></span>
            <span>Calories brûlées (kCal)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={data.sessions}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <YAxis
            yAxisId="weight"
            orientation="right"
            domain={[domainMin, domainMax]}
            axisLine={false}
            tickLine={false}
            className="activity-y-axis-weight"
            ticks={ticks}
            type="number"
            allowDecimals={false}
          />
          <CartesianGrid
            strokeDasharray="2 2"
            horizontal={true}
            vertical={false}
            stroke="#dedede"
            style={{ opacity: 1, visibility: 'visible', zIndex: 10 }}
          />
          <XAxis
            dataKey="displayDay"
            axisLine={false}
            tickLine={false}
            className="activity-x-axis"
          />
          <YAxis
            yAxisId="calories"
            orientation="left"
            domain={['dataMin - 10', 'dataMax + 10']}
            hide
          />
          <Tooltip
            content={<ActivityTooltip />}
          />
          <Bar
            yAxisId="weight"
            dataKey="kilogram"
            className="activity-bar-weight"
            radius={[3, 3, 0, 0]}
            barSize={7}
          />
          <Bar
            yAxisId="calories"
            dataKey="calories"
            className="activity-bar-calories"
            radius={[3, 3, 0, 0]}
            barSize={7}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
