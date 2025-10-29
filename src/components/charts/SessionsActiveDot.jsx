/**
 * Point activé personnalisé pour afficher le point de survol des sessions
 */
import { useEffect, useRef } from 'react';
import { setSessionsActiveDotPosition } from './sessionsOverlaySync.js';

const SessionsActiveDot = (props) => {
  const { cx, cy, payload } = props;
  const circleRef = useRef(null);

  // Mettre à jour la position pour l'overlay en utilisant la position réelle du cercle
  useEffect(() => {
    if (payload && payload.dayName && circleRef.current) {
      // Utiliser getBoundingClientRect pour obtenir la position exacte du cercle
      const circleRect = circleRef.current.getBoundingClientRect();
      const parentRect = circleRef.current.closest('.sessions-chart').getBoundingClientRect();

      // Position exacte du centre du cercle
      const centerX = circleRect.left + (circleRect.width / 2) - parentRect.left;
      setSessionsActiveDotPosition(centerX);
    } else {
      setSessionsActiveDotPosition(null);
    }
  }, [cx, payload]);

  // Ne pas afficher l'activeDot pour les points fantômes (sans dayName)
  if (!payload || !payload.dayName) {
    return null;
  }

  return (
    <circle
      ref={circleRef}
      cx={cx}
      cy={cy}
      className="sessions-active-dot"
    />
  );
};

export default SessionsActiveDot;
