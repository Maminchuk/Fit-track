import { useState, useEffect } from 'react';
import '../css/WorkoutTracker.css';

function WorkoutTracker() {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [workouts, setWorkouts] = useState(() => {
    try {
      const stored = localStorage.getItem('workouts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading workouts:", error);
      return [];
    }
  });

  const [newWorkout, setNewWorkout] = useState({ 
    name: '', 
    reps: '', 
    duration: '', 
    date: getTodayDate(),
    type: 'strength' 
  });

  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAllWorkouts, setShowAllWorkouts] = useState(false); 

  
const predefinedWorkouts = {
  'Full Body': {
    icon: '🏋️‍♂️',
    exercises: [
      { name: 'Push-ups', reps: 15, type: 'strength' },
      { name: 'Squats', reps: 20, type: 'strength' },
      { name: 'Plank', duration: 1, type: 'strength' },
      { name: 'Burpees', reps: 10, type: 'cardio' }
    ]
  },
  'Upper Body': {
    icon: '💪',
    exercises: [
      { name: 'Pull-ups', reps: 8, type: 'strength' },
      { name: 'Dumbbell Press', reps: 12, type: 'strength' },
      { name: 'Bicep Curls', reps: 15, type: 'strength' },
      { name: 'Tricep Dips', reps: 12, type: 'strength' }
    ]
  },
  'Lower Body': {
    icon: '🦵',
    exercises: [
      { name: 'Lunges', reps: 12, type: 'strength' },
      { name: 'Deadlifts', reps: 10, type: 'strength' },
      { name: 'Calf Raises', reps: 20, type: 'strength' },
      { name: 'Wall Sit', duration: 1, type: 'strength' }
    ]
  },
  'Cardio': {
    icon: '🏃‍♂️',
    exercises: [
      { name: 'Running', duration: 30, type: 'cardio' },
      { name: 'Jump Rope', duration: 10, type: 'cardio' },
      { name: 'Cycling', duration: 45, type: 'cardio' },
      { name: 'Swimming', duration: 30, type: 'cardio' }
    ]
  }
};

const addPredefinedWorkout = (workoutGroup) => {
  const today = getTodayDate();
  const newWorkouts = predefinedWorkouts[workoutGroup].exercises.map(workout => ({
    id: Date.now() + Math.random(),
    name: workout.name,
    reps: workout.reps || null,
    duration: workout.duration || null,
    date: today,
    done: false,
    type: workout.type
  }));
  
  setWorkouts([...workouts, ...newWorkouts]);
};

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  const filteredWorkouts = workouts.filter(workout => {

    if (filter === 'completed' && !workout.done) return false;
    if (filter === 'pending' && workout.done) return false;
    
    if (searchTerm && !workout.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {

    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const workoutTypes = [
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'balance', label: 'Balance' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newWorkout.name.trim()) {
      alert('Please enter workout name');
      return;
    }

    const workoutData = {
      id: editingWorkoutId || Date.now(),
      name: newWorkout.name.trim(),
      reps: newWorkout.reps ? parseInt(newWorkout.reps) : null,
      duration: newWorkout.duration ? parseInt(newWorkout.duration) : null,
      date: newWorkout.date,
      done: false,
      type: newWorkout.type
    };

    if (editingWorkoutId) {
      setWorkouts(workouts.map(w => w.id === editingWorkoutId ? workoutData : w));
      setEditingWorkoutId(null);
    } else {
      setWorkouts([...workouts, workoutData]);
    }

    setNewWorkout({ name: '', reps: '', duration: '', date: getTodayDate(), type: 'strength' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this workout?')) {
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkoutId(workout.id);
    setNewWorkout({
      name: workout.name,
      reps: workout.reps || '',
      duration: workout.duration || '',
      date: workout.date,
      type: workout.type
    });
  };

  const getWorkoutStats = () => {
    const total = workouts.length;
    const completed = workouts.filter(w => w.done).length;
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const typesCount = workouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, totalMinutes, typesCount };
  };

  const stats = getWorkoutStats();

  return (
    <div className="workout-tracker-app">
      <header className="app-header">
        <h1>Workout Tracker</h1>
        <div className="stats-summary">
          <div className="stat-card">
            <span>Total Workouts</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
          <div className="stat-card">
            <span>Total Minutes</span>
            <strong>{stats.totalMinutes}</strong>
          </div>
        </div>
      </header>
<section className="predefined-workouts-section">
  <h2>Quick Add Workouts</h2>
  <div className="predefined-workout-groups">
    {Object.entries(predefinedWorkouts).map(([group, { icon, exercises }]) => (
      <div key={group} className="workout-group">
        <h3>
          <span className="workout-icon">{icon}</span>
          {group}
          <button 
            onClick={() => addPredefinedWorkout(group)}
            className="add-group-button"
          >
            Add All
          </button>
        </h3>
        <ul className="predefined-workout-list">
          {exercises.map((workout, index) => (
            <li key={index}>
              {workout.name} 
              {workout.reps && ` - ${workout.reps} reps`}
              {workout.duration && ` - ${workout.duration} min`}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>
      <main className="app-content">
        <section className="workout-form-section">
          <h2>{editingWorkoutId ? 'Edit Workout' : 'Add New Workout'}</h2>
          <form onSubmit={handleSubmit} className="workout-form">
            <div className="form-group">
              <label>Workout Name</label>
              <input
                type="text"
                name="name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Repetitions</label>
                <input
                  type="number"
                  name="reps"
                  min="0"
                  value={newWorkout.reps}
                  onChange={(e) => setNewWorkout({...newWorkout, reps: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  min="0"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={newWorkout.date}
                  max={getTodayDate()}
                  onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                >
                  {workoutTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingWorkoutId ? 'Update Workout' : 'Add Workout'}
              </button>
              {editingWorkoutId && (
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => {
                    setEditingWorkoutId(null);
                    setNewWorkout({ name: '', reps: '', duration: '', date: getTodayDate(), type: 'strength' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="workout-list-section">
          <div className="list-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Workouts</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">A-Z</option>
                <option value="name-desc">Z-A</option>
              </select>
            </div>
          </div>

     {filteredWorkouts.length === 0 ? (
  <div className="empty-state">
    <p>No workouts found. Add your first workout!</p>
  </div>
) : (
  <> {}
    <ul className="workout-list">
      {filteredWorkouts.slice(0, showAllWorkouts ? filteredWorkouts.length : 3).map(workout => ( // Змінено тут
        <li key={workout.id} className={`workout-item ${workout.done ? 'completed' : ''}`}>
          <div className="workout-info">
            <div className="workout-header">
              <span className={`workout-type ${workout.type}`}>
                {workoutTypes.find(t => t.value === workout.type)?.label}
              </span>
              <span className="workout-date">{workout.date}</span>
            </div>
            <h3 className="workout-name">{workout.name}</h3>
            <div className="workout-stats">
              {workout.reps && <span>{workout.reps} reps</span>}
              {workout.duration && <span>{workout.duration} min</span>}
            </div>
          </div>

          <div className="workout-actions">
            <button
              onClick={() => setWorkouts(workouts.map(w =>
                w.id === workout.id ? {...w, done: !w.done} : w
              ))}
              className={`status-button ${workout.done ? 'completed' : ''}`}
            >
              {workout.done ? '✓ Done' : 'Mark Done'}
            </button>
            <button
              onClick={() => handleEdit(workout)}
              className="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(workout.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
    {filteredWorkouts.length > 3 && ( // Додайте цей блок для кнопки
      <button
        onClick={() => setShowAllWorkouts(!showAllWorkouts)}
        className="toggle-list-button" // Новий клас для кнопки
      >
        {showAllWorkouts ? 'Show Less' : 'Show More'}
      </button>
    )}
  </>
)}
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Workout Tracker</p>
        <button 
          className="export-button"
          onClick={() => {
            const data = JSON.stringify(workouts, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `workouts-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
        >
          Export Data
        </button>
      </footer>
    </div>
  );
}

export default WorkoutTracker;