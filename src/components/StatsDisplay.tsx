import React from 'react';
import { Statistics } from '../types/Card';
import './StatsDisplay.css';
import { Pie, PieChart, Tooltip } from 'recharts';

interface StatsDisplayProps {
  stats: Statistics | null;
}


const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  
  const getColor = (color: string): string => {
    switch (color) {
      case "W":
        return "white";
      case "U":
        return "blue";
      case "B":
        return "black";
      case "R":
        return "red";
      case "G":
        return "green";
      default:
        return "gray";
    }
  }

  const massagedData = stats?.colorPrefs.map((pref) => {
    return {
      name: pref.color,
      value: pref.count,
      fill: getColor(pref.color),
    }
  })
  return (
    <div className="stats-display">
      <div className="stats-header">
        <h3>Color Analysis</h3>
      </div>
      <PieChart className="stats-pie-chart" width={225} height={225}>
        <Pie isAnimationActive={false} data={massagedData}  cx="50%" cy="50%" outerRadius={50} />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default StatsDisplay;
