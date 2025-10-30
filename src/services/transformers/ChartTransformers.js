/**
 * Transformateurs de données pour les graphiques SportSee
 * 
 * Ce module contient la logique pure de formatage des données
 * pour chaque type de graphique, séparée de la logique React.
 * 
 * @module ChartTransformers
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @example
 * import { ActivityTransformer, SessionsTransformer } from './transformers/ChartTransformers.js';
 * 
 * const formattedActivity = ActivityTransformer.format(rawActivityData);
 * const sessionsWithGhosts = SessionsTransformer.addGhostPoints(rawSessionsData);
 */

/**
 * Transformateur pour les données d'activité quotidienne
 * Formate les données pour un graphique en barres combiné
 */
export const ActivityTransformer = {
  /**
   * Formate les données d'activité pour le graphique
   * 
   * @param {Object} rawData - Données brutes d'activité
   * @returns {Object} Données formatées pour le graphique
   * 
   * @example
   * const rawData = {
   *   sessions: [
   *     { day: "2020-07-01", kilogram: 80, calories: 240 },
   *     { day: "2020-07-02", kilogram: 79, calories: 220 }
   *   ]
   * };
   * 
   * const formatted = ActivityTransformer.format(rawData);
   * // {
   * //   sessions: [
   * //     { day: 1, kilogram: 80, calories: 240, displayDay: "1" },
   * //     { day: 2, kilogram: 79, calories: 220, displayDay: "2" }
   * //   ]
   * // }
   */
  format(rawData) {
    if (!rawData?.sessions) {
      return { sessions: [] };
    }

    return {
      sessions: rawData.sessions.map((session, index) => ({
        day: index + 1,
        kilogram: session.kilogram || 0,
        calories: session.calories || 0,
        displayDay: `${index + 1}`,
        // Conserver les données originales si nécessaire
        originalDay: session.day,
        dayFormatted: session.dayFormatted
      }))
    };
  }
};

/**
 * Transformateur pour les données de sessions moyennes
 * Gère l'ajout de points fantômes pour améliorer le rendu visuel
 */
export const SessionsTransformer = {
  /**
   * Ajoute des points fantômes au début et à la fin des sessions
   * 
   * @param {Object} rawData - Données brutes de sessions
   * @returns {Object} Données avec points fantômes ajoutés
   * 
   * @example
   * const rawData = {
   *   sessions: [
   *     { day: 1, sessionLength: 30 },
   *     { day: 2, sessionLength: 45 }
   *   ]
   * };
   * 
   * const withGhosts = SessionsTransformer.addGhostPoints(rawData);
   * // {
   * //   sessions: [
   * //     { day: 0, sessionLength: 30, isReal: false, isGhost: true },  // Point fantôme
   * //     { day: 1, sessionLength: 30, isReal: true },                  // Données réelles
   * //     { day: 2, sessionLength: 45, isReal: true },
   * //     { day: 8, sessionLength: 45, isReal: false, isGhost: true }   // Point fantôme
   * //   ]
   * // }
   */
  addGhostPoints(rawData) {
    if (!rawData?.sessions || rawData.sessions.length === 0) {
      return { sessions: [] };
    }

    // Préparer les sessions réelles
    const realSessions = rawData.sessions.map((session) => ({
      day: session.day,
      dayIndex: session.day,
      sessionLength: session.sessionLength || 0,
      isReal: true,
      // Conserver les données normalisées du DataNormalizer
      dayName: session.dayName,
      dayNameFull: session.dayNameFull,
      sessionLengthRaw: session.sessionLengthRaw
    }));

    // Ajouter point fantôme au début (jour 0)
    const firstSession = realSessions[0];
    const ghostStart = {
      day: 0,
      dayIndex: 0,
      sessionLength: firstSession.sessionLength,
      isReal: false,
      isGhost: true
    };

    // Ajouter point fantôme à la fin (jour 8)
    const lastSession = realSessions[realSessions.length - 1];
    const ghostEnd = {
      day: 8,
      dayIndex: 8,
      sessionLength: lastSession.sessionLength,
      isReal: false,
      isGhost: true
    };

    return {
      sessions: [ghostStart, ...realSessions, ghostEnd]
    };
  }
};

/**
 * Transformateur pour les données de performance radar
 * Transforme et réordonne les données avec traductions françaises
 */
export const PerformanceTransformer = {
  /**
   * Mapping des traductions anglais vers français
   * @type {Object<string, string>}
   * @readonly
   */
  TRANSLATIONS: {
    cardio: "Cardio",
    energy: "Énergie", 
    endurance: "Endurance",
    strength: "Force",
    speed: "Vitesse",
    intensity: "Intensité"
  },

  /**
   * Ordre d'affichage spécifique pour le radar
   * @type {string[]}
   * @readonly
   */
  RADAR_ORDER: [
    "Intensité",
    "Vitesse", 
    "Force",
    "Endurance",
    "Énergie",
    "Cardio"
  ],

  /**
   * Transforme les données de performance pour le radar
   * 
   * @param {Object} rawData - Données brutes de performance
   * @returns {Array} Données ordonnées pour le graphique radar
   * 
   * @example
   * const rawData = {
   *   kind: { 1: "cardio", 2: "energy" },
   *   data: [
   *     { value: 80, kind: 1, kindName: "cardio" },
   *     { value: 120, kind: 2, kindName: "energy" }
   *   ]
   * };
   * 
   * const transformed = PerformanceTransformer.formatForRadar(rawData);
   * // [
   * //   { subject: "Cardio", value: 80, fullMark: 250 },
   * //   { subject: "Énergie", value: 120, fullMark: 250 }
   * // ]
   */
  formatForRadar(rawData) {
    if (!rawData?.data || !Array.isArray(rawData.data)) {
      return [];
    }

    // Utiliser kindName du DataNormalizer si disponible, sinon fallback sur kind mapping
    return PerformanceTransformer.RADAR_ORDER.map((frenchName) => {
      const item = rawData.data.find((d) => {
        // Priorité au kindName normalisé
        if (d.kindName) {
          return PerformanceTransformer.TRANSLATIONS[d.kindName] === frenchName;
        }
        // Fallback sur l'ancien système
        return rawData.kind && PerformanceTransformer.TRANSLATIONS[rawData.kind[d.kind]] === frenchName;
      });

      return {
        subject: frenchName,
        value: item ? item.value : 0,
        fullMark: 250
      };
    });
  }
};

/**
 * Transformateur pour les données de score quotidien
 * Calcule le pourcentage à partir du score utilisateur
 */
export const ScoreTransformer = {
  /**
   * Calcule le pourcentage de score depuis les données utilisateur
   * 
   * @param {Object} rawData - Données brutes utilisateur
   * @returns {Object} Données formatées avec pourcentage
   * 
   * @example
   * const rawData = { todayScore: 0.3 };  // ou { score: 0.3 }
   * 
   * const formatted = ScoreTransformer.calculatePercentage(rawData);
   * // { percentage: 30 }
   */
  calculatePercentage(rawData) {
    if (!rawData) {
      return { percentage: 0 };
    }

    // Utilise la normalisation du DataNormalizer (score unifié)
    const score = rawData.score || rawData.todayScore || 0;
    const percentage = Math.round(score * 100);

    return { 
      percentage: Math.max(0, Math.min(100, percentage)) // Assure que le % est entre 0 et 100
    };
  }
};

/**
 * Export d'un objet consolidé pour faciliter l'import
 */
export const ChartTransformers = {
  Activity: ActivityTransformer,
  Sessions: SessionsTransformer, 
  Performance: PerformanceTransformer,
  Score: ScoreTransformer
};

/**
 * Export par défaut
 */
export default ChartTransformers;