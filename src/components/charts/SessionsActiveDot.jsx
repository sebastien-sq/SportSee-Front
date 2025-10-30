/**
 * Composant de point actif personnalisé pour le graphique de sessions SportSee
 * 
 * Affiche un cercle blanc lumineux avec effet de halo au survol des points
 * du graphique de durées moyennes de sessions. Ignore les points fantômes
 * (jours 0 et 8) pour ne montrer que les vrais jours de la semaine.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant (fournies par Recharts)
 * @param {number} props.cx - Position X du centre du point
 * @param {number} props.cy - Position Y du centre du point
 * @param {Object} props.payload - Données du point survolé
 * @param {number} props.payload.dayIndex - Index du jour (0-8, où 1-7 sont les vrais jours)
 * @param {boolean} [props.payload.isGhost] - Indicateur de point fantôme
 * @returns {JSX.Element|null} Cercle actif ou null pour les points fantômes
 * 
 * @example
 * // Utilisation dans un graphique de ligne Recharts
 * <Line 
 *   dataKey="sessionLength"
 *   activeDot={SessionsActiveDot}
 * />
 * 
 * @description
 * Caractéristiques visuelles :
 * - Cercle central blanc de rayon 4px
 * - Halo blanc semi-transparent (opacity 0.3) de 10px
 * - Effet drop-shadow pour renforcer la visibilité
 * - Masqué pour les jours 0 et 8 (points fantômes)
 * 
 * Points fantômes :
 * Les points avec dayIndex 0 et 8 sont des points ajoutés par le transformateur
 * pour améliorer le rendu de la courbe, mais ne doivent pas avoir d'indicateur visuel.
 * 
 * @requires react - Pour memo (optimisation)
 * @author SportSee Team
 * @since 1.0.0
 */
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
