/**
 * @fileoverview Point actif personnalisé pour le graphique de sessions
 */
import React, { memo } from 'react';

/**
 * Composant de point actif pour le graphique de sessions
 * Affiche un cercle blanc avec halo au survol des points du graphique
 * Ignore les points fantômes (dayIndex 0 et 8)
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.cx - Position X du centre du point
 * @param {number} props.cy - Position Y du centre du point
 * @param {Object} props.payload - Données du point
 * @param {number} props.payload.dayIndex - Index du jour (0-8, où 1-7 sont les vrais jours)
 * @returns {JSX.Element|null} Cercle actif ou null pour les points fantômes
 * 
 * @example
 * <Line activeDot={SessionsActiveDot} />
 */
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
