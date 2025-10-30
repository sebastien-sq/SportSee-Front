/**
 * Page Dashboard principale de l'application SportSee
 *
 * Affiche le tableau de bord complet d'un utilisateur avec :
 * - Message de bienvenue personnalisé
 * - Graphiques d'activité, sessions, performance et score
 * - Statistiques nutritionnelles (calories, protéines, glucides, lipides)
 *
 * @component
 * @returns {JSX.Element} Page dashboard complète
 *
 * @example
 * // Utilisation avec React Router
 * <Route path="/user/:userId" element={<Dashboard />} />
 *
 * @example
 * // Affichage direct avec utilisateur spécifique
 * function App() {
 *   return <Dashboard />;
 * }
 *
 * @description
 * Architecture des données :
 * - Récupération de l'ID utilisateur depuis l'URL via useParams
 * - Chargement des données utilisateur via useUser (hook personnalisé)
 * - Mémorisation des statistiques via useMemo pour optimisation
 * - Affichage conditionnel basé sur les états loading/error
 * 
 * Structure de la page :
 * 1. Header - Navigation principale
 * 2. Sidebar - Activités sportives
 * 3. Dashboard
 *    - Titre de bienvenue
 *    - Grille de graphiques (activité, sessions, performance, score)
 *    - Panneau de statistiques nutritionnelles
 *
 * @requires react
 * @requires react-router-dom - Pour useParams et navigation
 * @requires ../components/Header.jsx - En-tête de l'application
 * @requires ../components/Sidebar.jsx - Barre latérale
 * @requires ../components/charts/index.jsx - Composants de graphiques
 * @requires ../services/hooks/hooks.js - Hook useUser
 * @requires ../services/api/DataService.js - Service de données
 * @requires ../assets/icons - Icônes nutritionnelles
 * @author SportSee Team
 * @since 1.0.0
 */
import React, { useMemo } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import './dashboard.css';
import CarbsIcon from '../assets/icons/carbs-icon.png?url';
import ProteinIcon from '../assets/icons/protein-icon.png?url';
import SugarIcon from '../assets/icons/sugar-icon.png?url';
import FatIcon from '../assets/icons/fat-icon.png?url';
import { useUser } from '../services/hooks/hooks.js';
import { useParams } from 'react-router-dom';
import { DataService } from '../services/api/DataService.js';
import {
  ActivityChart,
  SessionsChart,
  PerformanceChart,
  ScoreChart
} from '../components/charts/index.jsx';

const Dashboard = () => {
  // Récupération de l'ID utilisateur depuis l'URL
  const { userId } = useParams();

  // Conversion en number et fallback
  const numericUserId = userId ? parseInt(userId, 10) : 18;

  // Utilisation du hook pour récupérer les données utilisateur
  const { data: userData, loading, error } = useUser(numericUserId);

  // Optimisation: Mémorisation des statistiques pour éviter les recalculs
  const statsData = useMemo(() => {
    if (!userData || !userData.keyData) {
      // Données par défaut si les données utilisateur sont manquantes
      return [
        { id: 1, icon: CarbsIcon, value: '---', label: 'Calories', alt: 'Calories icon' },
        { id: 2, icon: ProteinIcon, value: '---', label: 'Protéines', alt: 'Protein icon' },
        { id: 3, icon: SugarIcon, value: '---', label: 'Glucides', alt: 'Sugar icon' },
        { id: 4, icon: FatIcon, value: '---', label: 'Lipides', alt: 'Fat icon' }
      ];
    }

    const { calorieCount, proteinCount, carbohydrateCount, lipidCount } = userData.keyData;
    return [
      {
        id: 1,
        icon: CarbsIcon,
        value: calorieCount ? `${calorieCount.toLocaleString()}kCal` : '---',
        label: 'Calories',
        alt: 'Calories icon'
      },
      {
        id: 2,
        icon: ProteinIcon,
        value: proteinCount ? `${proteinCount}g` : '---',
        label: 'Protéines',
        alt: 'Protein icon'
      },
      {
        id: 3,
        icon: SugarIcon,
        value: carbohydrateCount ? `${carbohydrateCount}g` : '---',
        label: 'Glucides',
        alt: 'Sugar icon'
      },
      {
        id: 4,
        icon: FatIcon,
        value: lipidCount ? `${lipidCount}g` : '---',
        label: 'Lipides',
        alt: 'Fat icon'
      }
    ];
  }, [userData]);

  // Optimisation: Mémorisation du prénom utilisateur
  const firstName = useMemo(() => {
    return userData?.userInfos?.firstName || 'Utilisateur';
  }, [userData]);

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <main className="main-content">
        <Header />
        <Sidebar />
        <div className='dashboard'>
          <div className='dashboard__welcome'>
            <h2 className='dashboard__title'>Chargement...</h2>
            <p className='dashboard__subtitle'>Mode: {DataService.USE_MOCK_DATA ? 'MOCK' : 'API'}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <Header />
        <Sidebar />
        <div className='dashboard'>
          <div className='dashboard__welcome'>
            <h2 className='dashboard__title'>Erreur de chargement</h2>
            <p className='dashboard__subtitle'>Impossible de récupérer les données utilisateur: {error}</p>
            <p className='dashboard__subtitle'>Mode: {DataService.USE_MOCK_DATA ? 'MOCK' : 'API'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <Header />
      <Sidebar />
      <div className='dashboard'>
        <div className='dashboard__welcome'>
          <h2 className='dashboard__title'>Bonjour<span className='dashboard__title--highlight'>&nbsp;{firstName}</span></h2>
          <p className='dashboard__subtitle'>Félicitation ! Vous avez explosé vos objectifs hier 👏</p>
        </div>
         <div className='dashboard__data'>
        <div className='dashboard__charts'>
         <div className='dashboard__chart dashboard__chart--main'>
           <ActivityChart userId={numericUserId} />
         </div>
         <div className='dashboard__chart dashboard__chart--secondary'>
           <SessionsChart userId={numericUserId} />
         </div>
          <div className='dashboard__chart dashboard__chart--secondary'>
            <PerformanceChart userId={numericUserId} />
          </div>
          <div className='dashboard__chart dashboard__chart--secondary'>
            <ScoreChart userId={numericUserId} />
          </div>
        </div>
        <div className='dashboard__stats'>
          {statsData.map((stat) => (
            <div key={stat.id} className="dashboard__stat">
              <img src={stat.icon} alt={stat.alt} className='dashboard__stat-icon'/>
              <div className='dashboard__stat-info'>
                <p className='dashboard__stat-value'>{stat.value}</p>
                <p className='dashboard__stat-label'>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

    </main>
  );
};

export default Dashboard;