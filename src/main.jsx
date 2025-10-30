/**
 * Point d'entrée principal de l'application SportSee
 * 
 * Initialise l'application React et configure le DOM virtuel.
 * Applique les styles globaux et normalisation CSS.
 * 
 * @module main
 * @requires react
 * @requires react-dom/client
 * @requires ./normalize.css - Styles de normalisation cross-browser
 * @requires ./index.css - Styles globaux de l'application
 * @requires ./Router.jsx - Configuration du routage
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @example
 * // Ce fichier est le point d'entrée configuré dans vite.config.js
 * // Il est automatiquement chargé par Vite au démarrage de l'application
 * 
 * @description
 * Flux d'initialisation :
 * 1. Récupération de l'élément DOM #root
 * 2. Validation de l'existence de l'élément
 * 3. Création de la racine React avec createRoot (React 18+)
 * 4. Rendu de l'application en mode strict pour détection des problèmes
 * 
 * @throws {Error} Si l'élément #root n'est pas trouvé dans le DOM
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './normalize.css'
import './index.css'
import RouterComponent from './Router.jsx'

/**
 * Récupération de l'élément root du DOM
 * @type {HTMLElement|null}
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Élément root manquant');
}

/**
 * Création de la racine React pour le rendu
 * Utilise l'API concurrent de React 18+
 * @type {Root}
 */
const root = createRoot(rootElement);

/**
 * Rendu de l'application avec StrictMode activé
 * StrictMode aide à identifier les problèmes potentiels dans l'application
 */
root.render(
  <StrictMode>
    <RouterComponent />
  </StrictMode>,
);
