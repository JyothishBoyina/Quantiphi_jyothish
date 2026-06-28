import React, { useState } from 'react';

const InputSimulator = ({ onSimulate }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSimulate(inputValue);
    setInputValue('');
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Paste SMS (e.g. Paid Rs. 250 to Zomato...)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Simulate</button>
    </form>
  );
};

export default InputSimulator;
