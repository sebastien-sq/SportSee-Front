/**
 * Service de normalisation des données SportSee
 * 
 * Gère les inconsistances de schéma entre utilisateurs pour assurer
 * une interface cohérente dans l'application.
 * 
 * @module DataNormalizer
 * @author SportSee Team
 * @since 1.0.0
 * 
 * @example
 * import { DataNormalizer } from './DataNormalizer.js';
 * 
 * const normalizedUser = DataNormalizer.normalizeUser(rawUserData);
 * const normalizedPerf = DataNormalizer.normalizePerformance(rawPerfData);
 */

/**
 * Service de normalisation des données SportSee
 * Standardise les différents formats de données provenant de l'API
 * pour assurer une interface cohérente dans l'application.
 */
export class DataNormalizer {
  
  /**
   * Mapping des catégories de performance (clés numériques vers noms lisibles)
   * @type {Object<number, string>}
   * @static
   * @readonly
   */
  static PERFORMANCE_KIND_MAP = {
    1: 'cardio',
    2: 'energy',
    3: 'endurance', 
    4: 'strength',
    5: 'speed',
    6: 'intensity'
  };

  /**
   * Mapping des jours de la semaine pour les sessions moyennes
   * @type {string[]}
   * @static
   * @readonly
   * @description Index 0-6 correspond aux jours 1-7 de l'API
   */
  static DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  /**
   * Noms complets des jours de la semaine
   * @type {string[]}
   * @static
   * @readonly
   */
  static DAY_NAMES_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  /**
   * Normalise les données utilisateur
   * Gère l'inconsistance todayScore vs score et ajoute des fallbacks
   * 
   * @param {Object} rawData - Données brutes de l'API utilisateur
   * @returns {Object|null} Données utilisateur normalisées
   * 
   * @example
   * const rawUser = { id: 12, userInfos: { firstName: "Karl" }, todayScore: 0.12 };
   * const normalized = DataNormalizer.normalizeUser(rawUser);
   * console.log(normalized.score); // 0.12 (unifié)
   */
  static normalizeUser(rawData) {
    if (!rawData) {
      console.warn('DataNormalizer.normalizeUser: Données manquantes');
      return null;
    }

    // Gestion unifiée du score (todayScore ou score)
    const score = rawData.todayScore ?? rawData.score ?? 0;

    return {
      id: rawData.id ?? 0,
      userInfos: {
        firstName: rawData.userInfos?.firstName ?? '',
        lastName: rawData.userInfos?.lastName ?? '',
        age: rawData.userInfos?.age ?? 0
      },
      // ✅ Unification todayScore/score
      todayScore: score,
      score: score,
      keyData: {
        calorieCount: rawData.keyData?.calorieCount ?? 0,
        proteinCount: rawData.keyData?.proteinCount ?? 0,
        carbohydrateCount: rawData.keyData?.carbohydrateCount ?? 0,
        lipidCount: rawData.keyData?.lipidCount ?? 0
      }
    };
  }

  /**
   * Normalise les données de performance
   * Résout le mapping kind numérique vers noms des catégories
   * 
   * @param {Object} rawData - Données brutes de performance
   * @returns {Object|null} Données de performance normalisées
   * 
   * @example
   * const rawPerf = { userId: 12, kind: { 1: 'cardio' }, data: [{ value: 80, kind: 1 }] };
   * const normalized = DataNormalizer.normalizePerformance(rawPerf);
   * console.log(normalized.data[0].kindName); // 'cardio'
   */
  static normalizePerformance(rawData) {
    if (!rawData) {
      console.warn('DataNormalizer.normalizePerformance: Données manquantes');
      return null;
    }

    if (!rawData.data || !Array.isArray(rawData.data)) {
      console.warn('DataNormalizer.normalizePerformance: Données de performance invalides');
      return {
        userId: rawData.userId ?? 0,
        kind: rawData.kind ?? {},
        data: []
      };
    }

    return {
      userId: rawData.userId ?? 0,
      kind: rawData.kind ?? {},
      // ✅ Résolution du mapping kind + ajout des noms lisibles
      data: rawData.data.map(item => ({
        value: item?.value ?? 0,
        kind: item?.kind ?? 0,
        kindName: DataNormalizer.PERFORMANCE_KIND_MAP[item?.kind] ?? 'unknown'
      }))
    };
  }

  /**
   * Normalise les données de sessions moyennes
   * Gère les sessions avec sessionLength: 0 et ajoute les noms des jours
   * 
   * @param {Object} rawData - Données brutes de sessions moyennes
   * @returns {Object|null} Données de sessions normalisées
   * 
   * @example
   * const rawSessions = { userId: 12, sessions: [{ day: 1, sessionLength: 0 }] };
   * const normalized = DataNormalizer.normalizeSessions(rawSessions);
   * console.log(normalized.sessions[0].dayName); // 'L'
   * console.log(normalized.sessions[0].sessionLength); // 1 (minimum)
   */
  static normalizeSessions(rawData) {
    if (!rawData) {
      console.warn('DataNormalizer.normalizeSessions: Données manquantes');
      return null;
    }

    if (!rawData.sessions || !Array.isArray(rawData.sessions)) {
      console.warn('DataNormalizer.normalizeSessions: Sessions invalides');
      return {
        userId: rawData.userId ?? 0,
        sessions: []
      };
    }

    return {
      userId: rawData.userId ?? 0,
      // ✅ Gestion sessionLength: 0 + mapping jours
      sessions: rawData.sessions.map(session => ({
        day: session?.day ?? 1,
        dayName: DataNormalizer.DAY_NAMES[session?.day - 1] ?? '?',
        dayNameFull: DataNormalizer.DAY_NAMES_FULL[session?.day - 1] ?? 'Inconnu',
        // ✅ Fallback pour sessionLength: 0 (minimum 1 pour éviter les graphiques vides)
        sessionLength: Math.max(session?.sessionLength ?? 1, 1),
        sessionLengthRaw: session?.sessionLength ?? 0 // Garde la valeur originale pour référence
      }))
    };
  }

  /**
   * Normalise les données d'activité
   * Extrait le jour depuis les dates string et ajoute des fallbacks
   * 
   * @param {Object} rawData - Données brutes d'activité
   * @returns {Object|null} Données d'activité normalisées
   * 
   * @example
   * const rawActivity = { userId: 12, sessions: [{ day: "2020-07-01", kilogram: 80 }] };
   * const normalized = DataNormalizer.normalizeActivity(rawActivity);
   * console.log(normalized.sessions[0].dayFormatted); // 1
   * console.log(normalized.sessions[0].dayName); // "1er"
   */
  static normalizeActivity(rawData) {
    if (!rawData) {
      console.warn('DataNormalizer.normalizeActivity: Données manquantes');
      return null;
    }

    if (!rawData.sessions || !Array.isArray(rawData.sessions)) {
      console.warn('DataNormalizer.normalizeActivity: Sessions d\'activité invalides');
      return {
        userId: rawData.userId ?? 0,
        sessions: []
      };
    }

    return {
      userId: rawData.userId ?? 0,
      // ✅ Extraction du jour depuis les dates string
      sessions: rawData.sessions.map(session => {
        const dayString = session?.day ?? '';
        let dayFormatted = 0;
        let dayName = '?';

        try {
          if (dayString) {
            const date = new Date(dayString);
            dayFormatted = date.getDate();
            dayName = `${dayFormatted}${dayFormatted === 1 ? 'er' : ''}`;
          }
        } catch {
          console.warn(`DataNormalizer.normalizeActivity: Date invalide "${dayString}"`);
        }

        return {
          day: dayString,
          dayFormatted,
          dayName,
          kilogram: session?.kilogram ?? 0,
          calories: session?.calories ?? 0
        };
      })
    };
  }

  /**
   * Applique la normalisation appropriée selon le type d'endpoint
   * 
   * @param {string} endpoint - L'endpoint API appelé
   * @param {Object} rawData - Données brutes de l'API
   * @returns {Object|null} Données normalisées selon le type
   * 
   * @example
   * const normalized = DataNormalizer.normalizeByEndpoint('/user/12/performance', rawPerfData);
   */
  static normalizeByEndpoint(endpoint, rawData) {
    if (!endpoint || !rawData) {
      console.warn('DataNormalizer.normalizeByEndpoint: Paramètres manquants', { endpoint, hasData: !!rawData });
      return rawData;
    }

    try {
      // Détection du type d'endpoint et application de la normalisation appropriée
      if (endpoint.includes('/performance')) {
        return DataNormalizer.normalizePerformance(rawData);
      }
      
      if (endpoint.includes('/average-sessions')) {
        return DataNormalizer.normalizeSessions(rawData);
      }
      
      if (endpoint.includes('/activity')) {
        return DataNormalizer.normalizeActivity(rawData);
      }
      
      if (endpoint.match(/\/user\/\d+$/)) {
        return DataNormalizer.normalizeUser(rawData);
      }

      // Pas de normalisation spécifique nécessaire
      return rawData;
      
    } catch (error) {
      console.error('DataNormalizer.normalizeByEndpoint: Erreur de normalisation', error);
      return rawData; // Retourne les données originales en cas d'erreur
    }
  }

  /**
   * Valide la structure des données normalisées
   * 
   * @param {string} type - Type de données ('user', 'performance', 'sessions', 'activity')
   * @param {Object} data - Données à valider
   * @returns {boolean} true si valide, false sinon
   */
  static validateNormalizedData(type, data) {
    if (!data) return false;

    switch (type) {
      case 'user':
        return !!(data.id && data.userInfos && typeof data.score === 'number');
      
      case 'performance':
        return !!(data.userId && data.data && Array.isArray(data.data));
      
      case 'sessions':
        return !!(data.userId && data.sessions && Array.isArray(data.sessions));
      
      case 'activity':
        return !!(data.userId && data.sessions && Array.isArray(data.sessions));
      
      default:
        return false;
    }
  }
}

/**
 * Export par défaut pour compatibilité
 */
export default DataNormalizer;