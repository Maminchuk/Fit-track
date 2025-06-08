// src/App.jsx
import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
// -- НОВІ ІМПОРТИ --
import WeightTracker from './components/WeightTracker'; // Переконайтеся, що ви створили цей файл
import GoalsTracker from './components/GoalsTracker';   // Переконайтеся, що ви створили цей файл
import LandingPage from './components/LandingPage';     // ІМПОРТУЄМО НОВУ ГОЛОВНУ СТОРІНКУ
// -- КІНЕЦЬ НОВИХ ІМПОРТІВ --
import Settings from './components/Settings';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Змінюємо початкову сторінку на 'landing'
  const [currentPage, setCurrentPage] = useState('landing'); 

  // Функція для рендерингу поточної сторінки
  const renderPage = () => {
    switch (currentPage) {
      case 'landing': // НОВИЙ CASE: головна сторінка
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'workouts':
        return <WorkoutTracker />;
      case 'weights': // НОВИЙ CASE: сторінка відстеження ваги
        return <WeightTracker />;
      case 'goals': // НОВИЙ CASE: сторінка цілей
        return <GoalsTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />; // За замовчуванням також на головну
    }
  };

  return (
    <div className="app">
      <header className="header">
        <Navbar 
          onNavigate={setCurrentPage} 
          currentPage={currentPage} 
        />
      </header>

      <main className="main">
        {renderPage()}
      </main>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;