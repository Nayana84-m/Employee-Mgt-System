import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          {change && (
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <span>↑</span> {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
