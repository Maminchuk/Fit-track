
import { useState, useEffect } from 'react';
import '../css/Goals.css';

function GoalsTracker() {
  const loadGoals = () => {
    try {
      const storedGoals = localStorage.getItem('goals');
      return storedGoals ? JSON.parse(storedGoals) : [];
    } catch (error) {
      console.error("Error loading goals from localStorage:", error);
      return [];
    }
  };

  const saveGoals = (goalsToSave) => {
    try {
      localStorage.setItem('goals', JSON.stringify(goalsToSave));
    } catch (error) {
      console.error("Error saving goals to localStorage:", error);
    }
  };

  const [goals, setGoals] = useState(loadGoals);
  const [newGoal, setNewGoal] = useState({ description: '', targetDate: '' });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.description.trim()) {
      alert('Please enter a goal description.');
      return;
    }

    const goalToAdd = {
      id: Date.now(),
      description: newGoal.description.trim(),
      targetDate: newGoal.targetDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    setGoals([...goals, goalToAdd]);
    setNewGoal({ description: '', targetDate: '' });
    setIsFormVisible(false);
  };

  const toggleComplete = (id) => {
    setGoals(goals.map(g => 
      g.id === id ? { 
        ...g, 
        completed: !g.completed,
        progress: !g.completed ? 100 : 0 
      } : g
    ));
  };

  const updateProgress = (id, progress) => {
    setGoals(goals.map(g => 
      g.id === id ? { 
        ...g, 
        progress: Math.min(100, Math.max(0, progress)),
        completed: progress >= 100
      } : g
    ));
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleEditClick = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      description: goal.description,
      targetDate: goal.targetDate || '',
    });
    setIsFormVisible(true);
  };

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.description.trim()) {
      alert('Please enter a goal description.');
      return;
    }

    setGoals(goals.map(g =>
      g.id === editingGoalId
        ? {
            ...g,
            description: newGoal.description.trim(),
            targetDate: newGoal.targetDate || null,
          }
        : g
    ));
    setEditingGoalId(null);
    setNewGoal({ description: '', targetDate: '' });
    setIsFormVisible(false);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'completed') return goal.completed;
    if (filter === 'active') return !goal.completed;
    return true;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'targetDate') {
      if (!a.targetDate) return 1;
      if (!b.targetDate) return -1;
      return new Date(a.targetDate) - new Date(b.targetDate);
    }
    return 0;
  });

  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return 'No deadline';
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Deadline passed';
  };

  return (
    <section className="goals-tracker">
      <div className="goals-header">
        <h2>My Goals</h2>
        <div className="stats">
          <span>Total: {goals.length}</span>
          <span>Completed: {goals.filter(g => g.completed).length}</span>
          <span>Active: {goals.filter(g => !g.completed).length}</span>
        </div>
      </div>

      <div className="controls">
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date Added</option>
            <option value="targetDate">Deadline</option>
          </select>
        </div>

        <button 
          className="add-goal-btn"
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditingGoalId(null);
            setNewGoal({ description: '', targetDate: '' });
          }}
        >
          {isFormVisible ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {(isFormVisible || editingGoalId) && (
        <form onSubmit={editingGoalId ? handleUpdateGoal : handleAddGoal} className="goal-form">
          <input
            type="text"
            name="description"
            placeholder="Goal description (e.g., run 10km)"
            value={newGoal.description}
            onChange={handleChange}
            required
            autoFocus
          />
          <div className="form-row">
            <input
              type="date"
              name="targetDate"
              placeholder="Target date (optional)"
              value={newGoal.targetDate}
              onChange={handleChange}
            />
            <button type="submit" className="submit-btn">
              {editingGoalId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      )}

      {sortedGoals.length === 0 ? (
        <div className="no-goals">
          <img src="/images/no-goals.svg" alt="No goals" width="150" />
          <p>{filter === 'all' 
            ? 'You have no goals yet. Add your first one!' 
            : filter === 'completed' 
              ? 'No completed goals' 
              : 'No active goals'}
          </p>
        </div>
      ) : (
        <ul className="goal-list">
          {sortedGoals.map(goal => (
            <li 
              key={goal.id} 
              className={`goal-item ${goal.completed ? 'completed' : ''}`}
            >
              <div className="goal-main">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleComplete(goal.id)}
                  className="goal-checkbox"
                />
                <div className="goal-content">
                  <h3 className="goal-title">{goal.description}</h3>
                  <div className="goal-meta">
                    {goal.targetDate && (
                      <span className={`deadline ${new Date(goal.targetDate) < new Date() && !goal.completed ? 'overdue' : ''}`}>
                        {calculateDaysLeft(goal.targetDate)}
                      </span>
                    )}
                    <span className="created-date">
                      Added: {new Date(goal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {!goal.completed && (
                    <div className="progress-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                        className="progress-slider"
                      />
                      <span className="progress-value">{goal.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="goal-actions">
                <button 
                  onClick={() => handleEditClick(goal)} 
                  className="action-button edit"
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)} 
                  className="action-button delete"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default GoalsTracker;
