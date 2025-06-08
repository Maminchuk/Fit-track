import React from 'react';
import '../css/WorkoutTracker.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function WorkoutChart({ data }) {
  // `data` is expected in the format [{ date: 'YYYY-MM-DD', count: number }, ...]

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="chart-container">
      <h3>Workouts by Date</h3>
      {sortedData.length === 0 ? (
        <p className="no-chart-data">Not enough data to display the workout chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
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
            <YAxis allowDecimals={false} /> {}
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WorkoutChart;
