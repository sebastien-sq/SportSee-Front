/**
 * SessionsChart - Version optimisée pour éviter les re-rendus de la courbe
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useSessionsChart } from '../../services/chartHooks.js';
import { getSessionsActiveDotPosition, setSessionsActiveDotPosition } from './sessionsOverlaySync.js';
import CustomActiveDot from './CustomActiveDot.jsx';
import './charts.css';

const SessionsChart = ({ userId = 18 }) => {
  const { data, loading, error } = useSessionsChart(userId);
  const [overlayPosition, setOverlayPosition] = useState(null);

  // Polling optimisé pour synchroniser avec la position de l'activeDot
  useEffect(() => {
    let animationFrame;

    const updatePosition = () => {
      const currentPosition = getSessionsActiveDotPosition();
      setOverlayPosition(prev => {
        // Ne mettre à jour que si la position a vraiment changé
        if (prev !== currentPosition) {
          return currentPosition;
        }
        return prev;
      });

      // Continuer le polling seulement si nécessaire
      if (currentPosition !== null) {
        animationFrame = requestAnimationFrame(updatePosition);
      }
    };

    // Démarrer le polling
    animationFrame = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []); // Pas de dépendances pour éviter les re-créations

  // Fonctions optimisées avec useCallback
  const handlePositionChange = useCallback((x) => {
    setOverlayPosition(x);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOverlayPosition(null);
    setSessionsActiveDotPosition(null);
  }, []);

  // Mémoriser le graphique pour éviter les re-rendus inutiles
  const chartComponent = useMemo(() => {
    if (!data || !data.sessions) return null;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.sessions}
          margin={{
            top: 50,
            right: -10, // Encore plus négatif pour maximiser l'espace
            left:-10,  // Encore plus négatif pour maximiser l'espace
            bottom: 20,
          }}
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
              // Ne pas afficher de label pour les points fantômes (jour 0 et 8)
              if (value === 0 || value === 8) {
                return "";
              }
              return dayNames[value - 1] || "";
            }}
          />
          <YAxis hide />
          <Tooltip
            content={({ active, payload }) => {
              // Ne pas afficher le tooltip pour les points fantômes
              if (active && payload && payload.length && payload[0].payload?.isReal && !payload[0].payload?.isGhost) {
                return (
                  <div className="sessions-tooltip">
                    <p>{`${payload[0].value} min`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="sessionLength"
            stroke="url(#sessionsGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={(props) => <CustomActiveDot {...props} onPositionChange={handlePositionChange} />}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, [data, handleMouseLeave, handlePositionChange]); // Re-render seulement si les données ou callbacks changent

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

      {/* Overlay pour assombrir la zone à droite du hover */}
      {overlayPosition !== null && (
        <div
          style={{
            position: 'absolute',
            top: '0', // Couvre toute la hauteur
            left: `${overlayPosition}px`,
            right: '0',
            bottom: '0',
            background: '#000000',
            opacity: 0.1,
            pointerEvents: 'none',
            zIndex: 5, // En dessous du titre mais au-dessus du graphique
            borderRadius: '0 5px 5px 0'
          }}
        />
      )}
    </div>
  );
};

export default SessionsChart;
