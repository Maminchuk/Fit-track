import React from 'react';
import '../css/WorkoutTracker.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function WeightChart({ data }) {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="chart-container">
      <h3>Weight Changes (kg)</h3>
      {sortedData.length === 0 ? (
        <p className="no-chart-data">Not enough data to display the weight chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={sortedData}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WeightChart;
