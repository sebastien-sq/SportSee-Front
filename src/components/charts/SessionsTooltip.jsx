/**
 * Tooltip personnalisé pour les sessions
 */
import { useEffect } from 'react';
import { getSessionsActiveDotPosition } from './sessionsOverlaySync.js';
import './charts.css';

const SessionsTooltip = ({ active, payload }) => {
  // Gérer l'overlay en utilisant la position de l'activeDot
  useEffect(() => {
    const overlay = document.querySelector('.sessions-chart .sessions-overlay');
    const currentActiveDotPosition = getSessionsActiveDotPosition();

    if (overlay) {
      if (active && currentActiveDotPosition && payload && payload.length && payload[0].payload && payload[0].payload.dayName) {
        overlay.style.left = `${currentActiveDotPosition}px`;
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }
    }

    return () => {
      if (overlay) {
        overlay.style.display = 'none';
      }
    };
  }, [active, payload]);

  // Ne pas afficher le tooltip pour les points fantômes (sans dayName)
  if (active && payload && payload.length && payload[0].payload && payload[0].payload.dayName) {
    return (
      <div className="sessions-tooltip">
        <p>{`${payload[0].value} min`}</p>
      </div>
    );
  }
  return null;
};

export default SessionsTooltip;
