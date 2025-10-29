import React, { useEffect, useRef, memo } from 'react';
import { setSessionsActiveDotPosition } from './sessionsOverlaySync.js';

const CustomActiveDot = memo(({ cx, cy, onPositionChange, payload }) => {
  const dotRef = useRef(null);

  useEffect(() => {
    // Ne traiter que les vraies sessions (pas les fantômes)
    if (cx !== undefined && dotRef.current && payload?.isReal && !payload?.isGhost) {
      // Obtenir la position réelle du point dans le conteneur
      const dotElement = dotRef.current;
      const chartContainer = dotElement.closest('.sessions-chart');

      if (chartContainer) {
        const containerRect = chartContainer.getBoundingClientRect();
        const dotRect = dotElement.getBoundingClientRect();

        // Position relative du point dans le conteneur
        const relativeX = dotRect.left + (dotRect.width / 2) - containerRect.left;

        // Synchroniser avec notre système
        setSessionsActiveDotPosition(relativeX);

        // Aussi appeler le callback pour l'ancien système
        if (onPositionChange) {
          onPositionChange(relativeX);
        }
      }
    } else {
      setSessionsActiveDotPosition(null);
      if (onPositionChange) {
        onPositionChange(null);
      }
    }
  }, [cx, cy, onPositionChange, payload]);

  // Ne pas afficher l'activeDot pour les points fantômes
  if (!payload || !payload.isReal || payload.isGhost) {
    return null;
  }

  return (
    <circle
      ref={dotRef}
      cx={cx}
      cy={cy}
      r={5}
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth={2}
    />
  );
});

export default CustomActiveDot;
