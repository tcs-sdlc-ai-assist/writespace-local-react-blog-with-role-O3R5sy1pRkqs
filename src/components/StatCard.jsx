import React from 'react';
import PropTypes from 'prop-types';

/**
 * Admin dashboard stat tile component.
 * Displays a number and label with a colorful icon background.
 * @param {Object} props
 * @param {number|string} props.value - The stat number to display.
 * @param {string} props.label - The descriptive label for the stat.
 * @param {string} props.icon - The emoji or text icon to display.
 * @param {string} [props.color] - The color scheme ("indigo", "violet", "green", "red", "amber", "blue"). Defaults to "indigo".
 * @returns {JSX.Element}
 */
function StatCard({ value, label, icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      valueTxt: 'text-indigo-600',
    },
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-700',
      valueTxt: 'text-violet-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      valueTxt: 'text-green-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      valueTxt: 'text-red-600',
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      valueTxt: 'text-amber-600',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      valueTxt: 'text-blue-600',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
      <span
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl ${scheme.bg} ${scheme.text}`}
        role="img"
        aria-label={label}
      >
        {icon}
      </span>
      <div>
        <p className={`text-2xl font-bold ${scheme.valueTxt}`}>{value}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['indigo', 'violet', 'green', 'red', 'amber', 'blue']),
};

export default StatCard;