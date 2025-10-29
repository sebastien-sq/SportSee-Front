import React, { memo } from 'react';

const SessionsActiveDot = memo(({ cx, cy, payload }) => {
  // Ne pas afficher l'activeDot pour les points fantômes (dayIndex 0 et 8)
  if (!payload || payload.dayIndex === 0 || payload.dayIndex === 8) {
    return null;
  }

  // Afficher seulement pour les vrais jours (1 à 7)
  if (payload.dayIndex >= 1 && payload.dayIndex <= 7) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeOpacity={0.3}
        strokeWidth={10}
        style={{
          filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))'
        }}
      />
    );
  }

  return null;
});

export default SessionsActiveDot;
