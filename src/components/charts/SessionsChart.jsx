/**
 * @fileoverview Composant de graphique de durée moyenne des sessions
 * Affiche la durée moyenne des sessions d'entraînement par jour de la semaine
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
import { useSessionsChart } from '../../services/chartHooks.js';
import SessionsActiveDot from './SessionsActiveDot.jsx';
import './charts.css';

/**
 * Composant de graphique de durée moyenne des sessions
 * Affiche un graphique linéaire avec la durée des sessions pour chaque jour de la semaine
 * Inclut un overlay assombri au survol et des points fantômes pour étendre la courbe
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} [props.userId=18] - L'identifiant de l'utilisateur
 * @returns {JSX.Element} Graphique de sessions ou message d'état (chargement/erreur/vide)
 * 
 * @example
 * return (
 *   <SessionsChart userId={18} />
 * )
 */
const SessionsChart = ({ userId = 18 }) => {
  const { data, loading, error } = useSessionsChart(userId);
  const [overlayPosition, setOverlayPosition] = useState(null);

  /**
   * Gestionnaire de mouvement de la souris
   * Met à jour la position de l'overlay en fonction de la position du curseur
   * 
   * @param {Object} e - Événement de mouvement
   * @param {number} e.chartX - Position X dans le graphique
   */
  const handleMouseMove = useCallback((e) => {
    if (e && e.chartX !== undefined) {
      setOverlayPosition(e.chartX);
    }
  }, []);

  /**
   * Gestionnaire de sortie de la souris
   * Réinitialise la position de l'overlay
   */
  const handleMouseLeave = useCallback(() => {
    setOverlayPosition(null);
  }, []);

  /**
   * Tooltip personnalisé pour afficher la durée de session
   * Ignore les points fantômes et met à jour la position de l'overlay
   * 
   * @param {Object} props - Propriétés du tooltip
   * @param {boolean} props.active - Indique si le tooltip est actif
   * @param {Array} props.payload - Données du point survolé
   * @param {Object} props.coordinate - Coordonnées du point
   * @returns {JSX.Element|null} Tooltip avec durée ou null
   */
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
            activeDot={SessionsActiveDot}
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
