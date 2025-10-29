import './sidebar.css'
import meditatingIcon from '../assets/icons/meditating.png';
import swimmingIcon from '../assets/icons/swimming.png';
import dumbbellIcon from '../assets/icons/dumbbell.png';
import bikingIcon from '../assets/icons/biking.png';

/**
 * Composant de barre latérale de l'application SportSee
 * Affiche les icônes de différentes activités sportives et le copyright
 * 
 * @component
 * @returns {JSX.Element} Barre latérale avec icônes d'activités et copyright
 * 
 * @example
 * return (
 *   <Sidebar />
 * )
 */
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className='sidebar-container-icons'>
        <img className='sidebar-icon' src={meditatingIcon} alt="Meditation" />
        <img className='sidebar-icon' src={swimmingIcon} alt="Swimming" />
        <img className='sidebar-icon' src={dumbbellIcon} alt="Dumbbell" />
        <img className='sidebar-icon' src={bikingIcon} alt="Biking" />
      </div>
        <p className='sidebar-copyright'>Copyright, SportSee 2020</p>
    </aside>
  )
}

export default Sidebar