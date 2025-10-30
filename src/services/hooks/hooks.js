/**
 * Hooks React personnalisés pour la gestion des données SportSee
 *
 * Ce module fournit des hooks React pour récupérer et gérer les données utilisateur
 * de manière asynchrone avec gestion d'état (loading, error, data).
 *
 * @module services/hooks/hooks
 * @requires react
 * @requires ../api/DataService.js
 * @author SportSee Team
 * @since 1.0.0
 *
 * @example
 * // Import des hooks
 * import { useUser, useUserActivity } from './services/hooks/hooks.js';
 *
 * @example
 * // Import via le fichier index
 * import { useUser, useUserActivity } from './services/hooks/index.js';
 *
 * @example
 * // Utilisation dans un composant
 * function UserProfile({ userId }) {
 *   const { data: user, loading, error } = useUser(userId);
 *
 *   if (loading) return <div>Chargement...</div>;
 *   if (error) return <div>Erreur: {error}</div>;
 *
 *   return <h1>Bonjour {user.userInfos.firstName}!</h1>;
 * }
 * 
 * @description
 * Ces hooks fournissent une interface simplifiée pour récupérer les données
 * depuis le DataService sans avoir besoin de transformer les données.
 * 
 * Pour des hooks avec transformation de données pour graphiques,
 * voir le module chartHooks.js qui utilise le hook générique useApiData.
 * 
 * Architecture :
 * - hooks.js : Hooks simples pour données brutes (ce fichier)
 * - chartHooks.js : Hooks spécialisés pour graphiques avec transformation
 * - useApiData.js : Hook générique réutilisable pour récupération + transformation
 */
import { useState, useEffect } from "react";
import { DataService } from "../api/DataService.js";

/**
 * Type de retour standard des hooks de données
 * @typedef {Object} DataHookResult
 * @property {*} data - Les données récupérées (null si pas encore chargées ou en cas d'erreur)
 * @property {boolean} loading - Indicateur de chargement en cours
 * @property {string|null} error - Message d'erreur éventuel
 */

/**
 * Hook générique pour récupérer des données de manière asynchrone
 *
 * @private
 * @function useData
 * @param {Function} fetchFunction - Fonction asynchrone pour récupérer les données
 * @param {number} userId - ID de l'utilisateur pour lequel récupérer les données
 * @returns {DataHookResult} Objet contenant data, loading et error
 *
 * @example
 * // Utilisation interne uniquement
 * const result = useData(DataService.getUserById, 18);
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
 * Hook pour récupérer les données complètes d'un utilisateur
 *
 * @function useUser
 * @param {number} userId - ID de l'utilisateur à récupérer
 * @returns {DataHookResult<UserData>} État de chargement et données utilisateur
 *
 * @example
 * function UserProfile({ userId }) {
 *   const { data: user, loading, error } = useUser(userId);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!user) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{user.userInfos.firstName} {user.userInfos.lastName}</h1>
 *       <p>Score du jour: {Math.round(user.todayScore * 100)}%</p>
 *       <p>Calories: {user.keyData.calorieCount}</p>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Avec gestion d'erreur
 * function UserDashboard({ userId }) {
 *   const { data: user, loading, error } = useUser(userId);
 *
 *   useEffect(() => {
 *     if (error) {
 *       console.error('Erreur de chargement utilisateur:', error);
 *     }
 *   }, [error]);
 *
 *   return loading ? <LoadingState /> : <UserContent user={user} />;
 * }
 */
export const useUser = (userId) => {
  return useData(DataService.getUserById, userId);
};

/**
 * Hook pour récupérer les données d'activité quotidienne d'un utilisateur
 *
 * @function useUserActivity
 * @param {number} userId - ID de l'utilisateur
 * @returns {DataHookResult<ActivityData>} État de chargement et données d'activité
 *
 * @example
 * function ActivityChart({ userId }) {
 *   const { data: activity, loading, error } = useUserActivity(userId);
 *
 *   if (loading) return <ChartSkeleton />;
 *   if (error) return <ChartError error={error} />;
 *   if (!activity?.sessions) return <NoData />;
 *
 *   return (
 *     <BarChart data={activity.sessions}>
 *       {activity.sessions.map(session => (
 *         <Bar key={session.day} dataKey="kilogram" />
 *       ))}
 *     </BarChart>
 *   );
 * }
 *
 * @example
 * // Calcul de statistiques
 * function ActivityStats({ userId }) {
 *   const { data: activity } = useUserActivity(userId);
 *
 *   const avgWeight = activity?.sessions.reduce((sum, s) => sum + s.kilogram, 0) / activity?.sessions.length;
 *   const totalCalories = activity?.sessions.reduce((sum, s) => sum + s.calories, 0);
 *
 *   return <div>Poids moyen: {avgWeight?.toFixed(1)}kg, Total calories: {totalCalories}</div>;
 * }
 */
export const useUserActivity = (userId) => {
  return useData(DataService.getUserActivity, userId);
};

/**
 * Hook pour récupérer les durées moyennes des sessions d'entraînement
 *
 * @function useUserSessions
 * @param {number} userId - ID de l'utilisateur
 * @returns {DataHookResult<SessionsData>} État de chargement et données de sessions
 *
 * @example
 * function SessionsLineChart({ userId }) {
 *   const { data: sessions, loading, error } = useUserSessions(userId);
 *
 *   if (loading) return <LineChartSkeleton />;
 *   if (error) return <ChartError error={error} />;
 *
 *   const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
 *
 *   return (
 *     <LineChart data={sessions.sessions}>
 *       <XAxis
 *         dataKey="day"
 *         tickFormatter={(day) => dayNames[day - 1]}
 *       />
 *       <Line dataKey="sessionLength" />
 *     </LineChart>
 *   );
 * }
 *
 * @example
 * // Affichage de la session la plus longue
 * function BestSession({ userId }) {
 *   const { data: sessions } = useUserSessions(userId);
 *
 *   const bestSession = sessions?.sessions.reduce((best, current) =>
 *     current.sessionLength > best.sessionLength ? current : best
 *   );
 *
 *   return bestSession ? <p>Meilleure session: Jour {bestSession.day} ({bestSession.sessionLength}min)</p> : null;
 * }
 */
export const useUserSessions = (userId) => {
  return useData(DataService.getUserAverageSessions, userId);
};

/**
 * Hook pour récupérer les données de performance sportive d'un utilisateur
 *
 * @function useUserPerformance
 * @param {number} userId - ID de l'utilisateur
 * @returns {DataHookResult<PerformanceData>} État de chargement et données de performance
 *
 * @example
 * function PerformanceRadar({ userId }) {
 *   const { data: performance, loading, error } = useUserPerformance(userId);
 *
 *   if (loading) return <RadarSkeleton />;
 *   if (error) return <ChartError error={error} />;
 *
 *   const formattedData = performance.data.map(item => ({
 *     subject: performance.kind[item.kind],
 *     value: item.value
 *   }));
 *
 *   return <RadarChart data={formattedData} />;
 * }
 *
 * @example
 * // Affichage des points forts
 * function PerformanceHighlights({ userId }) {
 *   const { data: performance } = useUserPerformance(userId);
 *
 *   if (!performance) return null;
 *
 *   const strongestPerf = performance.data.reduce((max, current) =>
 *     current.value > max.value ? current : max
 *   );
 *
 *   return (
 *     <div>
 *       <h3>Point fort</h3>
 *       <p>{performance.kind[strongestPerf.kind]}: {strongestPerf.value}</p>
 *     </div>
 *   );
 * }
 */
export const useUserPerformance = (userId) => {
  return useData(DataService.getUserPerformance, userId);
};
