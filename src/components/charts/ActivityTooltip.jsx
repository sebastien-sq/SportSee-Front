/**
 * Tooltip personnalisé pour le graphique d'activité
 */
import './charts.css';

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
