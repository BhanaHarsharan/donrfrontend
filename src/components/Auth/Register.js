import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    sa_id: '',
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img
          src={`${process.env.PUBLIC_URL}/donr-logo.jpeg`}
          alt="donr logo"
          className="logo"
        />
        <h2>donr</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="sa_id"
            placeholder="SA ID (13 digits)"
            onChange={handleChange}
            required
          />
          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />
          <input
            name="date_of_birth"
            type="date"
            placeholder="Date of Birth"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;