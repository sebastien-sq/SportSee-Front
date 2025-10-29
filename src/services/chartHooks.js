/**
 * Hooks spécialisés pour les graphiques
 */
import { useState, useEffect } from "react";
import { sportSeeAPI } from "./sportSeeAPI.js";

/**
 * Hook pour le graphique d'activité
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
 * Hook pour le graphique de sessions
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
 * Hook pour le graphique de performance
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
 * Hook pour le graphique de score
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
