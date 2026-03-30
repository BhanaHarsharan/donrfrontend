import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const QRDisplay = () => {
  const [qrToken, setQrToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('qrToken');
    if (!token) {
      navigate('/dashboard');
      return;
    }
    setQrToken(token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const updateTimer = () => {
        const remaining = Math.max(0, expiry - Date.now());
        setTimeLeft(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          localStorage.removeItem('qrToken');
          navigate('/dashboard');
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } catch (e) {
      // not a JWT, just ignore timer
    }
  }, [navigate]);

  if (!qrToken) return null;

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Your Donation QR Code</h2>
      <div style={{ background: 'white', padding: '1rem', display: 'inline-block' }}>
        <QRCode value={qrToken} size={256} />
      </div>
      {timeLeft !== null && (
        <p>Valid for: {formatTime(timeLeft)}</p>
      )}
      <p>Show this code at the donation centre.</p>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default QRDisplay;