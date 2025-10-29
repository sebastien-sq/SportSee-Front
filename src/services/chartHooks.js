/**
 * @fileoverview Hooks React spécialisés pour les graphiques de SportSee
 * Fournit des hooks personnalisés pour récupérer et formater les données de chaque type de graphique
 */
import { useState, useEffect } from "react";
import { sportSeeAPI } from "./sportSeeAPI.js";

/**
 * Hook pour récupérer et formater les données du graphique d'activité
 * Récupère les sessions d'activité avec poids et calories, puis les formate pour le graphique
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données formatées pour le graphique
 * @returns {Array} return.data.sessions - Sessions avec day, kilogram, calories, displayDay
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useActivityChart(18);
 * if (!loading && data) {
 *   console.log(data.sessions); // [{day: 1, kilogram: 70, calories: 240, displayDay: "1"}, ...]
 * }
 */
export const useActivityChart = (userId) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isCancelled = false;

    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const rawData = await sportSeeAPI.getUserActivity(userId);

        if (!isCancelled && rawData?.sessions) {
          // Format pour le graphique
          const formattedData = {
            sessions: rawData.sessions.map((session, index) => ({
              day: index + 1,
              kilogram: session.kilogram,
              calories: session.calories,
              displayDay: `${index + 1}`,
            })),
          };

          setState({
            data: formattedData,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message,
          });
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return state;
};

/**
 * Hook pour récupérer et formater les données du graphique de sessions
 * Récupère les durées moyennes de sessions par jour et ajoute des points fantômes
 * aux extrémités pour améliorer le rendu visuel de la courbe
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données formatées pour le graphique
 * @returns {Array} return.data.sessions - Sessions incluant points fantômes (day 0 et 8)
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useSessionsChart(18);
 * if (!loading && data) {
 *   // data.sessions contient 9 points : 1 fantôme au début, 7 vrais jours, 1 fantôme à la fin
 *   console.log(data.sessions);
 * }
 */
export const useSessionsChart = (userId) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) return;

    let isCancelled = false;

    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const rawData = await sportSeeAPI.getUserAverageSessions(userId);

        if (!isCancelled && rawData?.sessions) {
          // Créer les points fantômes
          const realSessions = rawData.sessions.map((session) => ({
            day: session.day,
            dayIndex: session.day,
            sessionLength: session.sessionLength,
            isReal: true, // Marquer comme vraie session
          }));

          // Ajouter un point fantôme au début (jour 0)
          const firstSession = realSessions[0];
          const ghostStart = {
            day: 0,
            dayIndex: 0,
            sessionLength: firstSession.sessionLength, // Même valeur que le premier point
            isReal: false, // Marquer comme fantôme
            isGhost: true,
          };

          // Ajouter un point fantôme à la fin (jour 8)
          const lastSession = realSessions[realSessions.length - 1];
          const ghostEnd = {
            day: 8,
            dayIndex: 8,
            sessionLength: lastSession.sessionLength, // Même valeur que le dernier point
            isReal: false, // Marquer comme fantôme
            isGhost: true,
          };

          const formattedData = {
            sessions: [ghostStart, ...realSessions, ghostEnd],
          };

          setState({
            data: formattedData,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message,
          });
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return state;
};

/**
 * Hook pour récupérer et formater les données du graphique de performance
 * Récupère les données de performance, traduit les catégories en français
 * et les ordonne dans un ordre spécifique pour le radar
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Array|null} return.data - Données formatées pour le graphique radar
 * @returns {string} return.data[].subject - Nom de la catégorie en français
 * @returns {number} return.data[].value - Valeur de performance
 * @returns {number} return.data[].fullMark - Valeur maximale (250)
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = usePerformanceChart(18);
 * if (!loading && data) {
 *   // Données ordonnées : Intensité, Vitesse, Force, Endurance, Énergie, Cardio
 *   console.log(data);
 * }
 */
export const usePerformanceChart = (userId) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) return;

    let isCancelled = false;

    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const rawData = await sportSeeAPI.getUserPerformance(userId);

        if (!isCancelled && rawData?.data && rawData?.kind) {
          const kindTranslations = {
            cardio: "Cardio",
            energy: "Énergie",
            endurance: "Endurance",
            strength: "Force",
            speed: "Vitesse",
            intensity: "Intensité",
          };

          // Ordre spécifique pour le radar
          const orderedData = [
            "Intensité",
            "Vitesse",
            "Force",
            "Endurance",
            "Énergie",
            "Cardio",
          ].map((frenchName) => {
            const item = rawData.data.find(
              (d) => kindTranslations[rawData.kind[d.kind]] === frenchName
            );
            return {
              subject: frenchName,
              value: item ? item.value : 0,
              fullMark: 250,
            };
          });

          setState({
            data: orderedData,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message,
          });
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return state;
};

/**
 * Hook pour récupérer et formater les données du graphique de score
 * Récupère le score quotidien de l'utilisateur et le convertit en pourcentage
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État du hook
 * @returns {Object|null} return.data - Données formatées pour le graphique
 * @returns {number} return.data.percentage - Score en pourcentage (0-100)
 * @returns {boolean} return.loading - Indique si le chargement est en cours
 * @returns {string|null} return.error - Message d'erreur éventuel
 * 
 * @example
 * const { data, loading, error } = useScoreChart(18);
 * if (!loading && data) {
 *   console.log(data.percentage); // 12 (pour un score de 0.12)
 * }
 */
export const useScoreChart = (userId) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) return;

    let isCancelled = false;

    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const rawData = await sportSeeAPI.getUserById(userId);

        if (!isCancelled) {
          const score = rawData?.todayScore || rawData?.score || 0;
          const percentage = Math.round(score * 100);

          setState({
            data: { percentage },
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message,
          });
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return state;
};

/**
 * Hook composite pour récupérer toutes les données de graphiques
 * Utilise tous les hooks de graphiques et agrège leurs états
 * Utile pour charger toutes les données en une seule fois
 * 
 * @param {number} userId - L'identifiant de l'utilisateur
 * @returns {Object} État combiné de tous les graphiques
 * @returns {Object|null} return.activity - Données du graphique d'activité
 * @returns {Object|null} return.sessions - Données du graphique de sessions
 * @returns {Array|null} return.performance - Données du graphique de performance
 * @returns {Object|null} return.score - Données du graphique de score
 * @returns {boolean} return.loading - true si au moins un graphique est en chargement
 * @returns {boolean} return.error - true si au moins un graphique a une erreur
 * @returns {Object} return.errors - Détail des erreurs par graphique
 * @returns {string|null} return.errors.activity - Erreur du graphique d'activité
 * @returns {string|null} return.errors.sessions - Erreur du graphique de sessions
 * @returns {string|null} return.errors.performance - Erreur du graphique de performance
 * @returns {string|null} return.errors.score - Erreur du graphique de score
 * 
 * @example
 * const { activity, sessions, performance, score, loading, error, errors } = useAllCharts(18);
 * if (!loading) {
 *   console.log('Toutes les données sont chargées:', { activity, sessions, performance, score });
 *   if (error) {
 *     console.error('Erreurs:', errors);
 *   }
 * }
 */
export const useAllCharts = (userId) => {
  const activity = useActivityChart(userId);
  const sessions = useSessionsChart(userId);
  const performance = usePerformanceChart(userId);
  const score = useScoreChart(userId);

  const globalLoading =
    activity.loading ||
    sessions.loading ||
    performance.loading ||
    score.loading;

  const hasError =
    activity.error || sessions.error || performance.error || score.error;

  return {
    activity: activity.data,
    sessions: sessions.data,
    performance: performance.data,
    score: score.data,
    loading: globalLoading,
    error: hasError,
    errors: {
      activity: activity.error,
      sessions: sessions.error,
      performance: performance.error,
      score: score.error,
    },
  };
};
