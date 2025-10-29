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

  // Fonction pour personnaliser les lignes de grille
  const CustomGridLine = (props) => {
    const { y1, y2, x1, x2 } = props;

    // On veut que la ligne du BAS soit pleine (y1="196")
    // Donc on cherche la ligne avec la plus grande valeur Y
    const isBottomLine = y1 > 180; // Si Y > 180, c'est la ligne du bas

    return (
      <line
        key={`grid-line-${y1}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#dedede"
        strokeDasharray={isBottomLine ? "0" : "2 2"}
        opacity={1}
      />
    );
  };

  const CustomCursor = (props) => {
    // Recharts passe les coordonnées via l'array "points"
    const { points, top, height } = props;

    // Extraire la position X du premier point
    let cursorX = 0;
    if (points && points.length > 0) {
      cursorX = points[0].x || 0;
    }

    // Configuration du cursor
    const cursorWidth = 80; // Largeur pour couvrir les deux barres
    const centeredX = cursorX - cursorWidth / 2;
    const cursorY = top || 0;
    const cursorHeight = height || 186;

    return (
      <rect
        x={centeredX}
        y={cursorY}
        width={cursorWidth}
        height={cursorHeight}
        fill="rgba(196, 196, 196, 0.5)" // Gris semi-transparent
        stroke="none"
      />
    );
  };

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
            horizontal={CustomGridLine}
            vertical={false}
            syncWithTicks={true}
            yAxisId="weight"
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
            cursor={<CustomCursor />}
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
