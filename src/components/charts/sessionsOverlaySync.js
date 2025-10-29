/**
 * Utilitaire partagé pour synchroniser la position de l'overlay des sessions avec l'activeDot
 */

// Variable partagée pour synchroniser l'overlay avec l'activeDot des sessions
let currentSessionsActiveDotPosition = null;

// Fonction pour définir la position de l'activeDot des sessions
export const setSessionsActiveDotPosition = (position) => {
  currentSessionsActiveDotPosition = position;
};

// Fonction pour obtenir la position de l'activeDot des sessions
export const getSessionsActiveDotPosition = () => {
  return currentSessionsActiveDotPosition;
};
