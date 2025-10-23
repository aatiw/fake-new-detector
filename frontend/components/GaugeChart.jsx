import React from 'react';

export default function GaugeChart({ percentage = 47 }) {
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor;
  if (percentage > 80) {
    strokeColor = '#166534'; // Dark green
  } else if (percentage > 60) {
    strokeColor = '#22c55e'; // Green
  } else if (percentage > 40) {
    strokeColor = '#f97316'; // Orange
  } else {
    strokeColor = '#dc2626'; // Red
  }

  return (
    <div className="">
      <div className="text-center">
        <div className="relative w-32 h-30">
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
              stroke={strokeColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
            />

            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill={strokeColor}
            >
              {Math.round(percentage)}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}