// components/Settings.jsx
import React, { useState, useEffect } from 'react';
import '../css/Settings.css';

function Settings() {
    const [height, setHeight] = useState('');
    const [muscleMass, setMuscleMass] = useState('');
    const [theme, setTheme] = useState('light');
    const [unitSystem, setUnitSystem] = useState('metric');
    const [isDirty, setIsDirty] = useState(false);

    const loadUserProfile = () => {
        try {
            const storedProfile = localStorage.getItem('userProfile');
            return storedProfile ? JSON.parse(storedProfile) : {};
        } catch (error) {
            console.error("Error loading user profile from localStorage:", error);
            return {};
        }
    };

    const saveUserProfile = (profileToSave) => {
        try {
            localStorage.setItem('userProfile', JSON.stringify(profileToSave));
            console.log("User profile saved:", profileToSave);
            setIsDirty(false);
        } catch (error) {
            console.error("Error saving user profile to localStorage:", error);
        }
    };

    useEffect(() => {
        const userProfile = loadUserProfile();
        setHeight(userProfile.height || '');
        setMuscleMass(userProfile.muscleMass || '');
        setTheme(userProfile.theme || 'light');
        setUnitSystem(userProfile.unitSystem || 'metric');
        document.body.className = userProfile.theme === 'dark' ? 'dark-theme' : 'light-theme';
    }, []);

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
        setIsDirty(true);
    }, [theme]);

    useEffect(() => {
        setIsDirty(true);
    }, [height, muscleMass, unitSystem]);

    const handleHeightChange = (e) => setHeight(e.target.value);
    const handleMuscleMassChange = (e) => setMuscleMass(e.target.value);

    const handleSaveClick = () => {
        const updatedProfile = {
            height: parseFloat(height) || null,
            muscleMass: parseFloat(muscleMass) || null,
            theme,
            unitSystem,
        };
        saveUserProfile(updatedProfile);
    };

    return (
        <section className="settings-page">
            <div className="settings-header">
                <h2>Profile Settings</h2>
                <p>Customize the app for maximum comfort and results 💪</p>
            </div>

            <div className="settings-section personal-info">
                <h3>📊 Personal Info</h3>
                <div className="form-group">
                    <label htmlFor="height">Height (cm):</label>
                    <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={handleHeightChange}
                        placeholder="e.g., 175"
                        min="50"
                        max="250"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="muscleMass">Muscle Mass (%):</label>
                    <input
                        type="number"
                        id="muscleMass"
                        value={muscleMass}
                        onChange={handleMuscleMassChange}
                        placeholder="e.g., 30"
                        min="0"
                        max="100"
                    />
                </div>
                <div className="info-box">
                    <strong>Why is this important?</strong><br />
                    This data helps calculate BMI, metabolism, and other metrics in the dashboard.
                </div>
            </div>

            <button
                className={`save-button ${isDirty ? 'active' : 'disabled'}`}
                onClick={handleSaveClick}
                disabled={!isDirty}
            >
                💾 Save Settings
            </button>

            <div className="settings-footer">
                <p className="footer-quote">"Every step brings you closer to your goal. Set yourself up for success!" 🚀</p>
            </div>
        </section>
    );
}

export default Settings;
