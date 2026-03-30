import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Question from './Question';
import { useNavigate } from 'react-router-dom';
import './Questionnaire.css';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/questionnaire');
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/questionnaire/submit', { answers });
      if (res.data.eligible) {
        localStorage.setItem('qrToken', res.data.qrToken);
        navigate('/qr');
      } else {
        alert('You are not eligible to donate at this time.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="questionnaire-container">
      <div className="questionnaire-card" style={{ textAlign: 'center' }}>
        Loading questions...
      </div>
    </div>
  );
  if (error) return (
    <div className="questionnaire-container">
      <div className="questionnaire-card" style={{ textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    </div>
  );

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <img
            src={`${process.env.PUBLIC_URL}/donr-logo.jpeg`}
            alt="donr logo"
            className="questionnaire-logo"
          />
        </div>
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div className="question-item" key={q.id}>
              <div className="question-text">{q.text}</div>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    value="yes"
                    checked={answers[q.id] === 'yes'}
                    onChange={() => handleAnswerChange(q.id, 'yes')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    value="no"
                    checked={answers[q.id] === 'no'}
                    onChange={() => handleAnswerChange(q.id, 'no')}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Questionnaire;