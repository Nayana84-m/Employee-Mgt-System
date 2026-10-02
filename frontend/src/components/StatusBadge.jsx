import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusText) => {
    switch (statusText?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'processing':
      case 'on leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'inactive':
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
