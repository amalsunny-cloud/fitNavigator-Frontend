import React, { useRef, useEffect } from 'react';

const DonutChartSingle = ({ memberProgressPercentage }) => {
  const progressRef = useRef(null);
  const circumference = 2 * Math.PI * 45;
  const progressOffset = circumference * (1 - memberProgressPercentage / 100);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.strokeDashoffset = progressOffset;
    }
  }, [memberProgressPercentage, progressOffset]);

  return (
    <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
      <svg viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="9"
        />
        
        {/* Progress circle */}
        <circle
          ref={progressRef}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#2CAF50"
          strokeWidth="8"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
        
        {/* Center text */}
        <text
          x="50"
          y="50"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="16"
          fill="#ffc93c"
          fontWeight="bold"
        >
          {memberProgressPercentage}%
        </text>
      </svg>
    </div>
  );
};

export default DonutChartSingle;