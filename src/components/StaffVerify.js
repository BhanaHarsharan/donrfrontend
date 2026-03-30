import React, { useState } from 'react';
import api from '../services/api';
import './StaffVerify.css';

const StaffVerify = () => {
  const [qrToken, setQrToken] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!qrToken.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.get(`/verify/${qrToken}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-container">
      <div className="staff-card">
        <img
          src={`${process.env.PUBLIC_URL}/donr-logo.jpeg`}
          alt="donr logo"
          className="staff-logo"
        />
        <h2>Staff Verification</h2>
        <p className="staff-subtitle">Scan or paste the donor's QR code</p>
        <input
          type="text"
          placeholder="Paste QR code token"
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
        />
        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className={`result-box ${result.valid ? 'valid' : 'invalid'}`}>
            <h3>Verification Result</h3>
            {result.valid ? (
              <>
                <p><strong>✅ Valid QR Code</strong></p>
                <div className="donor-details">
                  <p><strong>Donor:</strong> {result.donor.name}</p>
                  <p><strong>SA ID:</strong> {result.donor.sa_id}</p>
                  <p><strong>Eligible:</strong> {result.donor.eligible ? 'Yes' : 'No'}</p>
                </div>
              </>
            ) : (
              <p><strong>❌ {result.error || 'Invalid QR Code'}</strong></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffVerify;