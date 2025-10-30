/**
 * Hook générique pour la récupération de données API avec transformation
 * 
 * Ce module fournit un hook React réutilisable qui gère la logique commune
 * de récupération de données asynchrones avec état de chargement et d'erreur.
 * 
 * @module services/hooks/useApiData
 * @requires react
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @example
 * import { useApiData } from './services/hooks/useApiData.js';
 * import { DataService } from './services/api/DataService.js';
 * import { ActivityTransformer } from './services/transformers/ChartTransformers.js';
 * 
 * // Hook spécialisé utilisant le hook générique
 * const useActivityChart = (userId) => {
 *   return useApiData(
 *     DataService.getUserActivity,
 *     ActivityTransformer.format,
 *     userId
 *   );
 * };
 * 
 * @description
 * Ce hook générique permet de créer facilement des hooks spécialisés
 * en combinant une fonction de récupération et une fonction de transformation.
 * 
 * Avantages :
 * - Réutilisable pour tous types de données
 * - Gestion automatique du loading et des erreurs
 * - Annulation automatique si le composant est démonté
 * - Support optionnel de transformation de données
 * - Utilisation de useRef pour éviter les re-rendus inutiles
 * 
 * Cas d'usage :
 * - Hooks de graphiques (avec transformation)
 * - Hooks de données utilisateur (sans transformation)
 * - Tout hook nécessitant récupération asynchrone + transformation
 */

import { useState, useEffect, useRef } from "react";

/**
 * Type de retour pour le hook de données API
 * @typedef {Object} ApiDataHookResult
 * @property {*} data - Les données transformées (null si pas encore chargées)
 * @property {boolean} loading - Indicateur de chargement en cours
 * @property {string|null} error - Message d'erreur éventuel
 */

/**
 * Hook générique pour la récupération et transformation de données API
 * 
 * Gère automatiquement l'état de chargement, les erreurs et l'annulation
 * des requêtes en cours si le composant est démonté.
 * 
 * @function useApiData
 * @param {Function} fetchFunction - Fonction asynchrone pour récupérer les données
 * @param {Function|null} [transformer=null] - Fonction de transformation des données (optionnelle)
 * @param {number} userId - ID de l'utilisateur pour lequel récupérer les données
 * @returns {ApiDataHookResult} État avec données, loading et error
 * 
 * @example
 * // Utilisation basique sans transformation
 * const { data, loading, error } = useApiData(
 *   DataService.getUserById,
 *   null,
 *   userId
 * );
 * 
 * @example
 * // Utilisation avec transformation
 * const { data, loading, error } = useApiData(
 *   DataService.getUserActivity,
 *   ActivityTransformer.format,
 *   userId
 * );
 */
export const useApiData = (fetchFunction, transformer = null, userId) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  // Utilisation de useRef pour conserver les références stables
  const fetchFunctionRef = useRef(fetchFunction);
  const transformerRef = useRef(transformer);

  // Mise à jour des refs à chaque rendu
  fetchFunctionRef.current = fetchFunction;
  transformerRef.current = transformer;

  useEffect(() => {
    // Validation des paramètres
    if (!userId || !fetchFunctionRef.current) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: userId ? 'Fonction de récupération manquante' : 'ID utilisateur manquant'
      }));
      return;
    }

    let isCancelled = false;

    const loadData = async () => {
      try {
        // Démarrer le chargement
        setState(prev => ({ 
          ...prev, 
          loading: true, 
          error: null 
        }));

        // Récupérer les données
        const rawData = await fetchFunctionRef.current(userId);

        // Vérifier si le composant n'a pas été démonté
        if (isCancelled) return;

        // Appliquer la transformation si fournie
        let transformedData = rawData;
        if (transformerRef.current && typeof transformerRef.current === 'function') {
          try {
            transformedData = transformerRef.current(rawData);
          } catch (transformError) {
            console.warn('Erreur de transformation des données:', transformError);
            // En cas d'erreur de transformation, utiliser les données brutes
            transformedData = rawData;
          }
        }

        // Mettre à jour l'état avec succès
        setState({
          data: transformedData,
          loading: false,
          error: null
        });

      } catch (error) {
        // Gestion d'erreur seulement si le composant est toujours monté
        if (!isCancelled) {
          console.error('Erreur de récupération des données:', error);
          setState({
            data: null,
            loading: false,
            error: error.message || 'Erreur de récupération des données'
          });
        }
      }
    };

    loadData();

    // Fonction de nettoyage pour annuler la requête
    return () => {
      isCancelled = true;
    };
  }, [userId]); // Seulement userId comme dépendance

  return state;
};

/**
 * Hook spécialisé pour les données utilisateur simples (sans transformation)
 * 
 * @function useUserData
 * @param {Function} fetchFunction - Fonction de récupération des données utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {ApiDataHookResult} État avec données utilisateur
 * 
 * @example
 * const { data: user, loading, error } = useUserData(
 *   DataService.getUserById,
 *   userId
 * );
 */
export const useUserData = (fetchFunction, userId) => {
  return useApiData(fetchFunction, null, userId);
};

/**
 * Hook spécialisé pour les données de graphiques (avec transformation)
 * 
 * @function useChartData
 * @param {Function} fetchFunction - Fonction de récupération des données
 * @param {Function} transformer - Fonction de transformation pour le graphique
 * @param {number} userId - ID de l'utilisateur
 * @returns {ApiDataHookResult} État avec données transformées pour graphique
 * 
 * @example
 * const { data, loading, error } = useChartData(
 *   DataService.getUserActivity,
 *   ActivityTransformer.format,
 *   userId
 * );
 */
export const useChartData = (fetchFunction, transformer, userId) => {
  return useApiData(fetchFunction, transformer, userId);
};

/**
 * Export par défaut
 */
export default useApiData;