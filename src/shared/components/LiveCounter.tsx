import React, { useState, useEffect } from 'react';

/**
 * Live counter that simulates real-time candidate registrations
 * Increments by 1-3 every 5-15 seconds to create dynamic feel
 */
const LiveCounter: React.FC = () => {
  const baseCount = 1547; // Starting count for 2026 edition
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    // Increment randomly between 1-3 every 5-15 seconds
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // Format number with comma separator
  const formatted = count.toLocaleString('fr-FR');

  return (
    <span className="tabular-nums transition-all duration-500">
      {formatted}
    </span>
  );
};

export default LiveCounter;
