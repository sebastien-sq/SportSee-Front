/**
 * Composant graphique en ligne des sessions moyennes SportSee
 *
 * Affiche un graphique en ligne des durées moyennes de sessions d'entraînement
 * par jour de la semaine. Inclut des interactions au survol avec overlay et tooltip.
 * Utilise des points fantômes pour améliorer le rendu visuel aux extrémités.
 *
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {number} [props.userId=18] - ID de l'utilisateur pour lequel afficher les sessions
 * @returns {JSX.Element} Graphique en ligne des sessions ou état de chargement/erreur
 *
 * @example
 * // Utilisation basique avec utilisateur par défaut
 * <SessionsChart />
 *
 * @example
 * // Utilisation avec utilisateur spécifique
 * <SessionsChart userId={12} />
 *
 * @example
 * // Intégration dans un tableau de bord
 * function WeeklyInsights({ userId }) {
 *   return (
 *     <div className="weekly-container">
 *       <h2>Analyse hebdomadaire</h2>
 *       <SessionsChart userId={userId} />
 *     </div>
 *   );
 * }
 *
 * @description
 * Le composant gère :
 * - Affichage des jours de la semaine (L, M, M, J, V, S, D)
 * - Points fantômes invisibles aux extrémités (jours 0 et 8) pour une courbe fluide
 * - Overlay sombre au survol à droite du curseur
 * - Tooltip personnalisé affichant la durée en minutes
 * - Gestion des états de chargement et d'erreur
 * - Gradient sur la ligne pour effet visuel
 * 
 * Points fantômes :
 * Les jours 0 et 8 sont des points fantômes ajoutés par le transformateur
 * pour améliorer le rendu visuel de la courbe aux extrémités.
 *
 * @requires react - Pour useState, useCallback, useMemo
 * @requires recharts - Pour ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
 * @requires ../../services/hooks/chartHooks.js - Hook useSessionsChart
 * @requires ./charts.css - Styles des graphiques
 * @uses {ChartHookState<FormattedSession[]>} useSessionsChart
 * @author SportSee Team
 * @since 1.0.0
 */
import React, { useState, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useSessionsChart } from '../../services/hooks/chartHooks.js';
import './charts.css';

const SessionsChart = ({ userId = 18 }) => {
  const { data, loading, error } = useSessionsChart(userId);
  const [overlayPosition, setOverlayPosition] = useState(null);

  // Gestion simplifiée du hover avec position relative
  const handleMouseMove = useCallback((e) => {
    if (e && e.chartX !== undefined) {
      setOverlayPosition(e.chartX);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOverlayPosition(null);
  }, []);

  // Tooltip personnalisé pour afficher la valeur et gérer l'overlay
  const CustomTooltip = useCallback(({ active, payload, coordinate }) => {
    if (active && payload && payload.length && coordinate) {
      // Ne pas afficher le tooltip pour les points fantômes (dayIndex 0 et 8)
      const dayIndex = payload[0]?.payload?.dayIndex;
      if (dayIndex === 0 || dayIndex === 8) {
        return null;
      }

      // Mettre à jour la position de l'overlay seulement pour les vrais points
      if (dayIndex >= 1 && dayIndex <= 7) {
        setOverlayPosition(coordinate.x);
      }

      return (
        <div className="sessions-tooltip">
          {`${payload[0].value} min`}
        </div>
      );
    }
    return null;
  }, []);

  // Mémoriser le graphique avec activeDot simplifié
  const chartComponent = useMemo(() => {
    if (!data || !data.sessions) return null;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.sessions}
          margin={{
            top: 50,
            right: -10,
            left: -10,
            bottom: 20,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="sessionsGradient" x1="100%" y1="0%" x2="0%" y2="0%" gradientUnits="objectBoundingBox">
              <stop offset="1.19%" stopColor="#FFFFFF" stopOpacity={1} />
              <stop offset="81.27%" stopColor="#FFFFFF" stopOpacity={0.403191} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="dayIndex"
            axisLine={false}
            tickLine={false}
            className="sessions-x-axis"
            tickFormatter={(value) => {
              const dayNames = ["L", "M", "M", "J", "V", "S", "D"];
              if (value === 0 || value === 8) {
                return "";
              }
              return dayNames[value - 1] || "";
            }}
          />
          <YAxis hide />
          <Tooltip
            content={CustomTooltip}
            cursor={false}
          />
          <Line
            type="monotone"
            dataKey="sessionLength"
            stroke="url(#sessionsGradient)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, [data, handleMouseMove, handleMouseLeave, CustomTooltip]);

  if (loading) {
    return <div className="chart-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="chart-error">Erreur: {error.message}</div>;
  }

  if (!data || !data.sessions) {
    return <div className="chart-empty">Aucune donnée disponible</div>;
  }

  return (
    <div className="sessions-chart" style={{ position: 'relative' }}>
      <h3 className="chart-title">Durée moyenne des sessions</h3>
      {chartComponent}

      {/* Overlay simplifié basé sur la position de la souris */}
      {overlayPosition !== null && (
        <div
          className="sessions-overlay"
          style={{
            position: 'absolute',
            top: '0',
            left: `${overlayPosition}px`,
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: 5,
            borderRadius: '0 5px 5px 0'
          }}
        />
      )}
    </div>
  );
};

export default SessionsChart;
