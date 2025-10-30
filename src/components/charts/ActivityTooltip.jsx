/**
 * Composant de tooltip personnalisé pour le graphique d'activité SportSee
 * 
 * Affiche le poids (kg) et les calories (kCal) au survol des barres
 * dans le graphique d'activité quotidienne.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.active - Indique si le tooltip est actif (au survol)
 * @param {Array} props.payload - Données à afficher dans le tooltip
 * @param {Object} props.payload[].dataKey - Clé identifiant le type de donnée ('kilogram' ou 'calories')
 * @param {number} props.payload[].value - Valeur numérique à afficher
 * @returns {JSX.Element|null} Tooltip avec poids et calories, ou null si inactif
 * 
 * @example
 * // Utilisation dans un graphique Recharts
 * <ComposedChart data={sessions}>
 *   <Tooltip content={<ActivityTooltip />} />
 * </ComposedChart>
 * 
 * @description
 * Le tooltip recherche dans le payload les entrées avec dataKey 'kilogram' et 'calories'
 * pour afficher les deux valeurs formatées avec les unités appropriées.
 * 
 * @requires react
 * @requires ./charts.css - Styles du tooltip
 * @author SportSee Team
 * @since 1.0.0
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
