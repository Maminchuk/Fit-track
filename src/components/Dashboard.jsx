import { useState, useEffect } from 'react';
import {
  FiActivity, FiTrendingUp, FiDroplet, FiMoon, FiHeart, FiAward
} from 'react-icons/fi';
import {
  FaRunning, FaWeight, FaFireAlt, FaWalking, FaDumbbell
} from 'react-icons/fa';

import WeightChart from './WeightChart';
import WorkoutChart from './WorkoutChart';
import CaloriesChart from './CaloriesChart';
import SleepChart from './SleepChart';
import WorkoutTypesChart from './WorkoutTypesChart';

import '../css/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedDate, setSelectedDate] = useState(null);
  const prepareWeightData = (weights) =>
    weights.length ? weights : [
      { date: '2025-05-28', value: 75 },
      { date: '2025-05-29', value: 74.5 },
      { date: '2025-05-30', value: 74.2 },
      { date: '2025-05-31', value: 73.9 },
    ];

  const prepareWorkoutData = (workouts) =>
    workouts.length ? workouts.map(w => ({ date: w.date, count: 1 })) : [
      { date: '2025-05-28', count: 1 },
      { date: '2025-05-29', count: 2 },
      { date: '2025-05-30', count: 1 },
      { date: '2025-05-31', count: 3 },
    ];

  const prepareCaloriesData = () => [
    { date: '2025-05-28', intake: 2200, burned: 1800 },
    { date: '2025-05-29', intake: 2000, burned: 1700 },
    { date: '2025-05-30', intake: 2100, burned: 1900 },
    { date: '2025-05-31', intake: 1900, burned: 1600 },
    { date: '2025-06-01', intake: 2300, burned: 2000 },
  ];

  const prepareSleepData = () => [
    { date: '2025-05-28', hours: 7.5 },
    { date: '2025-05-29', hours: 6 },
    { date: '2025-05-30', hours: 8 },
    { date: '2025-05-31', hours: 7 },
  ];

  const prepareWorkoutTypesData = () => [
    { type: 'Running', count: 4 },
    { type: 'Cycling', count: 2 },
    { type: 'Yoga', count: 3 },
    { type: 'Strength', count: 5 },
  ];

  const calculateStreak = (workouts) => {
    const sortedDates = workouts.filter(w => w.done).map(w => new Date(w.date)).sort((a, b) => a - b);
    let streak = 0;
    if (sortedDates.length) {
      let lastDate = sortedDates[0];
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i] - lastDate) / (1000 * 60 * 60 * 24);
        if (Math.ceil(diff) === 1) streak++;
        else streak = 1;
        lastDate = sortedDates[i];
      }
    }
    return `${streak} day${streak !== 1 ? 's' : ''}`;
  };

  const calculateBMI = (profile, weightStr) => {
    const weight = parseFloat(weightStr);
    const height = parseFloat(profile.height || 175) / 100;
    return (weight / (height * height)).toFixed(1);
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const weights = JSON.parse(localStorage.getItem('weights') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const dailyMetrics = JSON.parse(localStorage.getItem('dailyMetrics') || '{}');
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

        const completedWorkouts = workouts.filter(w => w.done).length;
        const latestWeight = weights.length
          ? `${weights.sort((a, b) => new Date(b.date) - new Date(a.date))[0].value} kg`
          : `74.5 kg`;

        const lastRun = workouts.find(w =>
          w.name?.toLowerCase().includes('run')
        );

        const defaultMetrics = {
          caloriesBurnedToday: 2100,
          waterIntake: 2.5,
          sleepHours: 7,
          avgHeartRate: 72,
          stepsToday: 8500,
          proteinIntake: 110
        };

        const dm = { ...defaultMetrics, ...dailyMetrics };

        const profile = {
          height: userProfile.height || 175,
          muscleMass: userProfile.muscleMass || 36
        };

        setStats({
          workoutsCompleted: completedWorkouts || 4,
          currentWeight: latestWeight,
          lastRunDistance: lastRun ? `${lastRun.duration || 25} min` : '25 min',
          activeGoals: goals.filter(g => !g.completed).length || 2,
          caloriesBurned: `${dm.caloriesBurnedToday} kcal`,
          waterIntake: `${dm.waterIntake} L`,
          sleepHours: `${dm.sleepHours} hrs`,
          avgHeartRate: `${dm.avgHeartRate} bpm`,
          stepsToday: dm.stepsToday,
          proteinIntake: `${dm.proteinIntake} g`,
          currentStreak: calculateStreak(workouts) || '2 days',
          bmi: calculateBMI(profile, parseFloat(latestWeight)) || '22.3',
          muscleMass: `${profile.muscleMass}%`
        });

        setChartData({
          weight: prepareWeightData(weights),
          workouts: prepareWorkoutData(workouts),
          calories: prepareCaloriesData(),
          sleep: prepareSleepData(),
          workoutTypes: prepareWorkoutTypesData()
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };

    loadData();
  }, [selectedTimeframe]);

  return (
    <section className="dashboard">
      {loading ? (
        <div className="loading">Загрузка данных...</div>
      ) : (
        <>
          <div className="card welcome-banner">
  <div className="welcome-content">
    <h1>Welcome Back!</h1>
    <p>Track your progress and stay motivated</p>
    <div className="timeframe-selector">
      {['week', 'month', 'year'].map((t) => (
        <button
          key={t}
          className={selectedTimeframe === t ? 'active' : ''}
          onClick={() => {
            setSelectedTimeframe(t);
            const today = new Date();
            let displayValue;
            
            if (t === 'week') {
              displayValue = today.toLocaleString('en-US', { weekday: 'long' }); 
            } else if (t === 'month') {
              displayValue = today.toLocaleString('en-US', { month: 'long' });
            } else {
              displayValue = today.getFullYear(); 
            }

            setSelectedDate({
              timeframe: t,
              displayValue: displayValue
            });
          }}
        >
          {`This ${t.charAt(0).toUpperCase() + t.slice(1)}`}
        </button>
      ))}
    </div>
    {selectedDate && (
      <div className="selected-timeframe-date">
        <span className="timeframe-display">
          {selectedDate.displayValue}
        </span>
      </div>
    )}
  </div>
  <div className="motivational-quote">
    "The only bad workout is the one that didn't happen"
  </div>
</div>

          <div className="key-metrics">
            <div className="metric-card highlight">
              <div className="metric-icon"><FiActivity /></div>
              <div className="metric-value">{stats.workoutsCompleted}</div>
              <div className="metric-label">Workouts</div>
              <div className="metric-trend">+2 this week</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"><FaWeight /></div>
              <div className="metric-value">{stats.currentWeight}</div>
              <div className="metric-label">Weight</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon"><FaFireAlt /></div>
              <div className="metric-value">{stats.caloriesBurned}</div>
              <div className="metric-label">Calories</div>
            </div>
            <div className="metric-card highlight">
              <div className="metric-icon"><FiAward /></div>
              <div className="metric-value">{stats.currentStreak}</div>
              <div className="metric-label">Streak</div>
              <div className="metric-trend">Keep going!</div>
            </div>
          </div>

          <div className="stats-grid">
            {[
              { icon: <FaRunning />, value: stats.lastRunDistance, label: 'Last Run' },
              { icon: <FiDroplet />, value: stats.waterIntake, label: 'Water' },
              { icon: <FiMoon />, value: stats.sleepHours, label: 'Sleep' },
              { icon: <FiHeart />, value: stats.avgHeartRate, label: 'Heart Rate' },
              { icon: <FaWalking />, value: stats.stepsToday, label: 'Steps' },
              { icon: <FaDumbbell />, value: stats.proteinIntake, label: 'Protein' },
              { icon: <FiTrendingUp />, value: stats.bmi, label: 'BMI' },
              { icon: <FaDumbbell />, value: stats.muscleMass, label: 'Muscle' },
            ].map((stat, idx) => (
              <div className="stat-card" key={idx}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="charts-section">
            <h2>Your Progress</h2>
            <div className="chart-grid">
              <div className="chart-container">
                <h3>Weight Trend</h3>
                <WeightChart data={chartData.weight} timeframe={selectedTimeframe} />
              </div>
              <div className="chart-container">
                <h3>Workout Frequency</h3>
                <WorkoutChart data={chartData.workouts} timeframe={selectedTimeframe} />
              </div>
              <div className="chart-container">
                <h3>Calories Balance</h3>
                <CaloriesChart data={chartData.calories} timeframe={selectedTimeframe} />
              </div>
              <div className="chart-container">
                <h3>Sleep Quality</h3>
                <SleepChart data={chartData.sleep} timeframe={selectedTimeframe} />
              </div>
              <div className="chart-container">
                <h3>Workout Types</h3>
                <WorkoutTypesChart data={chartData.workoutTypes} />
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🏃</div>
                <div className="activity-details">
                  <div className="activity-title">Morning Run</div>
                  <div className="activity-meta">30 min • 5 km • Today</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;
