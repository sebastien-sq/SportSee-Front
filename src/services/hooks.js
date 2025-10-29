/**
 * @fileoverview Hooks React génériques pour SportSee
 * Fournit des hooks personnalisés pour récupérer les données de l'API
 */
import { useState, useEffect } from "react";
import { sportSeeAPI } from "./sportSeeAPI.js";

/**
 * Hook générique pour récupérer des données via une fonction de fetch
 * Gère automatiquement les états de chargement, d'erreur et d'annulation
 * 
 * @private
 * @param {Function} fetchFunction - Fonction async qui récupère les données
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {*} return.data - Données récupérées
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 */
const useData = (fetchFunction, userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isCancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction(userId);

        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [userId, fetchFunction]);

  return { data, loading, error };
};

/**
 * Hook pour récupérer les données complètes de l'utilisateur
 * Récupère les informations personnelles et les données nutritionnelles (keyData)
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données utilisateur
 * @returns {Object} return.data.userInfos - Informations personnelles (firstName, lastName, age)
 * @returns {Object} return.data.keyData - Données nutritionnelles (calorieCount, proteinCount, etc.)
 * @returns {number} return.data.todayScore - Score du jour (0-1)
 * @returns {number} return.data.score - Score alternatif (0-1)
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useUser(18);
 * if (!loading && data) {
 *   console.log(data.userInfos.firstName); // "Cecilia"
 *   console.log(data.keyData.calorieCount); // 2500
 * }
 */
export const useUser = (userId) => {
  return useData(sportSeeAPI.getUserById, userId);
};

/**
 * Hook pour récupérer l'activité quotidienne de l'utilisateur
 * Récupère les sessions avec poids et calories brûlées
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données d'activité
 * @returns {Array} return.data.sessions - Sessions avec day, kilogram, calories
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useUserActivity(18);
 * if (!loading && data) {
 *   console.log(data.sessions); // [{day: "2020-07-01", kilogram: 80, calories: 240}, ...]
 * }
 */
export const useUserActivity = (userId) => {
  return useData(sportSeeAPI.getUserActivity, userId);
};

/**
 * Hook pour récupérer les durées moyennes des sessions de l'utilisateur
 * Récupère les durées de session pour chaque jour de la semaine
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données de sessions
 * @returns {Array} return.data.sessions - Sessions avec day (1-7) et sessionLength (minutes)
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useUserSessions(18);
 * if (!loading && data) {
 *   console.log(data.sessions); // [{day: 1, sessionLength: 30}, {day: 2, sessionLength: 40}, ...]
 * }
 */
export const useUserSessions = (userId) => {
  return useData(sportSeeAPI.getUserAverageSessions, userId);
};

/**
 * Hook pour récupérer les données de performance de l'utilisateur
 * Récupère les valeurs de performance pour différentes catégories
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données de performance
 * @returns {Array} return.data.data - Valeurs avec kind (id de catégorie) et value
 * @returns {Object} return.data.kind - Mapping des ids vers les noms de catégories
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useUserPerformance(18);
 * if (!loading && data) {
 *   console.log(data.kind); // {1: 'cardio', 2: 'energy', 3: 'endurance', ...}
 *   console.log(data.data); // [{value: 80, kind: 1}, {value: 120, kind: 2}, ...]
 * }
 */
export const useUserPerformance = (userId) => {
  return useData(sportSeeAPI.getUserPerformance, userId);
};
