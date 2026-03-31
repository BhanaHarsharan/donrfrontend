import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [showHistory, setShowHistory] = useState(true); // new state

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/questionnaire/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const res = await api.get('/gamification/stats');
        setGamification(res.data);
      } catch (err) {
        console.error('Failed to fetch gamification stats:', err);
      }
    };
    fetchGamification();
  }, []);

  const handleNewDonation = () => {
    navigate('/questionnaire');
  };

  const handleViewQR = () => {
    navigate('/qr');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <img
          src={`${process.env.PUBLIC_URL}/donr-logo.jpeg`}
          alt="donr logo"
          className="logo-small"
        />
        <div className="welcome-message">
          Welcome, <strong>{user?.full_name}</strong>!
        </div>

        {gamification && (
          <>
            <div className="gamification-card">
              <div className="stat-item">
                <div className="stat-value">{gamification.totalDonations}</div>
                <div className="stat-label">Total Donations</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{gamification.streak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{gamification.level}</div>
                <div className="stat-label">Donor Level</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{gamification.livesSaved}</div>
                <div className="stat-label">Lives </div>
              </div>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${((gamification.totalDonations % 5) / 5) * 100}%` }}
              ></div>
            </div>
            <div className="next-level-text">
              {5 - (gamification.totalDonations % 5)} more donation{gamification.totalDonations % 5 !== 4 ? 's' : ''} to reach Level {gamification.level + 1}
            </div>
          </>
        )}

        <div className="button-group">
          <button onClick={handleNewDonation}>Start New Donation</button>
          <button onClick={handleViewQR}>View My QR Code</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="history-section">
          <div className="history-header">
            <h3>Donation History</h3>
            <button className="toggle-history-btn" onClick={toggleHistory}>
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>
          {showHistory && (
            <>
              {history.length === 0 ? (
                <p>No past donations recorded.</p>
              ) : (
                <ul className="history-list">
                  {history.map((record) => (
                    <li
                      key={record.id}
                      className={record.is_eligible ? 'eligible' : 'deferred'}
                    >
                      {new Date(record.completed_at).toLocaleDateString()} –{' '}
                      {record.is_eligible ? 'Eligible' : 'Deferred'}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;