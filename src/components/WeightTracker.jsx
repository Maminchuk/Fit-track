import { useState, useEffect } from 'react';
import '../css/WorkoutTracker.css';
import '../css/WeightTracker.css';

function WeightTracker() {
  const loadWeights = () => {
    try {
      const storedWeights = localStorage.getItem('weights');
      return storedWeights ? JSON.parse(storedWeights) : [];
    } catch (error) {
      console.error("Error loading weights from localStorage:", error);
      return [];
    }
  };

  const saveWeights = (weightsToSave) => {
    try {
      localStorage.setItem('weights', JSON.stringify(weightsToSave));
    } catch (error) {
      console.error("Error saving weights to localStorage:", error);
    }
  };

  const [weights, setWeights] = useState(loadWeights);
  const [newWeight, setNewWeight] = useState('');
  const [editingWeightId, setEditingWeightId] = useState(null);

  useEffect(() => {
    saveWeights(weights);
  }, [weights]);

  const handleChange = (e) => {
    setNewWeight(e.target.value);
  };

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!newWeight || isNaN(newWeight) || parseFloat(newWeight) <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    const weightToAdd = {
      id: Date.now(),
      value: parseFloat(newWeight),
      date: new Date().toISOString().split('T')[0], 
    };

    setWeights([...weights, weightToAdd]);
    setNewWeight('');
  };

  const handleDeleteWeight = (id) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      setWeights(weights.filter(w => w.id !== id));
    }
  };

  const handleEditClick = (weight) => {
    setEditingWeightId(weight.id);
    setNewWeight(weight.value.toString());
  };

  const handleUpdateWeight = (e) => {
    e.preventDefault();
    if (!newWeight || isNaN(newWeight) || parseFloat(newWeight) <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    setWeights(weights.map(w =>
      w.id === editingWeightId
        ? { ...w, value: parseFloat(newWeight) }
        : w
    ));
    setEditingWeightId(null);
    setNewWeight('');
  };

  return (
    <section className="weight-tracker">
      <h2>Your Weight</h2>

      <form onSubmit={editingWeightId ? handleUpdateWeight : handleAddWeight} className="weight-form">
        <input
          type="number"
          step="0.1"
          name="weight"
          placeholder="Your weight (kg)"
          value={newWeight}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingWeightId ? 'Update Weight' : 'Add Weight'}
        </button>
        {editingWeightId && (
          <button type="button" onClick={() => {
            setEditingWeightId(null);
            setNewWeight('');
          }}>Cancel</button>
        )}
      </form>

      {weights.length === 0 ? (
        <p className="no-weights-message">No weight entries yet. Add your first one!</p>
      ) : (
        <ul className="weight-list">
          {weights.sort((a, b) => new Date(b.date) - new Date(a.date)).map(w => ( 
            <li key={w.id} className="weight-item">
              <span className="weight-details">
                {w.value} kg — {w.date}
              </span>
              <div className="weight-actions">
                <button onClick={() => handleEditClick(w)} className="action-button edit-button">
                  Edit
                </button>
                <button onClick={() => handleDeleteWeight(w.id)} className="action-button delete-button">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WeightTracker;
