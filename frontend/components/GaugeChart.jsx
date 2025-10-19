import React from 'react';

export default function GaugeChart({ percentage = 47 }) {
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="">
      <div className="text-center">
        <div className="relative w-60 h-40">
          <svg
            viewBox="0 0 200 120"
            className="w-full h-full"
          >
            {/* Background arc (gray) */}
            <path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Filled arc (green) */}
            <path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke="#84cc16"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />

            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill="#84cc16"
            >
              {Math.round(percentage)}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}