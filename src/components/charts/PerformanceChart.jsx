/**
 * PerformanceChart - Version fonctionnelle avec styles originaux
 */
import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { usePerformanceChart } from '../../services/chartHooks.js';
import './charts.css';

const PerformanceChart = ({ userId = 18 }) => {
  const { data, loading, error } = usePerformanceChart(userId);

  if (loading) {
    return <div className="chart-loading">Chargement...</div>;
  }

  if (error) {
    return <div className="chart-error">Erreur: {error.message}</div>;
  }

  if (!data || !data.length) {
    return <div className="chart-empty">Aucune donnée disponible</div>;
  }

  return (
    <div className="performance-chart" style={{
      overflow: 'visible',
      padding: '10px' // Espace supplémentaire pour les labels
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 25, right: 35, bottom: 25, left: 35 }}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'white',
              fontSize: 12,
              textAnchor: 'middle'
            }}
            className="performance-radar-labels"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'dataMax']}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#FF0101"
            fill="#FF0101"
            fillOpacity={0.7}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
