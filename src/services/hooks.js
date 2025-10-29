/**
 * Hooks React pour SportSee
 */
import { useState, useEffect } from "react";
import { sportSeeAPI } from "./sportSeeAPI.js";

/**
 * Hook générique pour récupérer des données
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
 * Hook pour récupérer les données utilisateur
 */
export const useUser = (userId) => {
  return useData(sportSeeAPI.getUserById, userId);
};

/**
 * Hook pour récupérer l'activité utilisateur
 */
export const useUserActivity = (userId) => {
  return useData(sportSeeAPI.getUserActivity, userId);
};

/**
 * Hook pour récupérer les sessions utilisateur
 */
export const useUserSessions = (userId) => {
  return useData(sportSeeAPI.getUserAverageSessions, userId);
};

/**
 * Hook pour récupérer les performances utilisateur
 */
export const useUserPerformance = (userId) => {
  return useData(sportSeeAPI.getUserPerformance, userId);
};
