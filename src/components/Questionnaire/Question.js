import React from 'react';

const Question = ({ question, value, onChange }) => {
  if (question.type === 'yesno') {
    return (
      <div>
        <p>{question.text}</p>
        <label>
          <input
            type="radio"
            name={question.id}
            value="yes"
            checked={value === 'yes'}
            onChange={() => onChange(question.id, 'yes')}
          /> Yes
        </label>
        <label>
          <input
            type="radio"
            name={question.id}
            value="no"
            checked={value === 'no'}
            onChange={() => onChange(question.id, 'no')}
          /> No
        </label>
      </div>
    );
  }
  return null;
};

export default Question;