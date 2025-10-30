/**
 * Composant racine de l'application SportSee
 * 
 * Point d'entrée principal des composants React.
 * Actuellement simplifié pour afficher directement le Dashboard.
 * 
 * @component
 * @returns {JSX.Element} Application SportSee
 * 
 * @note Ce composant est actuellement remplacé par RouterComponent dans main.jsx
 * Il est conservé pour compatibilité et tests potentiels
 * 
 * @example
 * // Utilisation directe (sans routage)
 * import App from './App.jsx';
 * 
 * root.render(<App />);
 * 
 * @requires ./page/Dashboard.jsx
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @deprecated Utiliser RouterComponent à la place pour bénéficier du routage complet
 */
import Dashboard from './page/Dashboard.jsx'

/**
 * Fonction composant App
 * Rendu direct du Dashboard sans configuration de route
 * 
 * @function App
 * @returns {JSX.Element} Dashboard de l'application
 */
function App() {

  return (
    <>
     <Dashboard />
    </>
  )
}

export default App
