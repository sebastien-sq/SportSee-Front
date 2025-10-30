/**
 * Composant de routage principal de l'application SportSee
 * 
 * Configure les routes de l'application en utilisant React Router v6.
 * Gère la navigation entre les différentes pages et les redirections.
 * 
 * @component
 * @returns {JSX.Element} Système de routage de l'application
 * 
 * @example
 * // Utilisation dans le point d'entrée de l'application
 * import RouterComponent from './Router.jsx';
 * 
 * root.render(
 *   <StrictMode>
 *     <RouterComponent />
 *   </StrictMode>
 * );
 * 
 * @description
 * Routes configurées :
 * - `/user/:userId` - Affiche le dashboard pour un utilisateur spécifique
 * - `*` - Redirige vers l'utilisateur par défaut (ID: 18)
 * 
 * @requires react
 * @requires react-router-dom
 * @requires ./page/Dashboard.jsx
 * @author SportSee Team
 * @since 1.0.0
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './page/Dashboard.jsx';

/**
 * Composant RouterComponent
 * Configure toutes les routes de l'application
 * 
 * @function RouterComponent
 * @returns {JSX.Element} Configuration des routes avec React Router
 */
function RouterComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userId" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/user/18" replace />} />
      </Routes>
    </Router>
  );
}

export default RouterComponent;
