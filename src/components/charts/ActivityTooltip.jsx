/**
 * @fileoverview Tooltip personnalisé pour le graphique d'activité
 */
import './charts.css';

/**
 * Composant de tooltip personnalisé pour le graphique d'activité
 * Affiche le poids et les calories au survol des barres
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.active - Indique si le tooltip est actif
 * @param {Array} props.payload - Données à afficher dans le tooltip
 * @returns {JSX.Element|null} Tooltip avec poids et calories, ou null si inactif
 * 
 * @example
 * <Tooltip content={<ActivityTooltip />} />
 */
const ActivityTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // On suppose que payload contient les deux valeurs : kilogram et calories
    const poids = payload.find((entry) => entry.dataKey === 'kilogram');
    const calories = payload.find((entry) => entry.dataKey === 'calories');
    return (
      <div className="activity-tooltip">
        {poids && (
          <p className="activity-tooltip-value">{poids.value}kg</p>
        )}
        {calories && (
          <p className="activity-tooltip-value">{calories.value}kCal</p>
        )}
      </div>
    );
  }
  return null;
};

export default ActivityTooltip;
