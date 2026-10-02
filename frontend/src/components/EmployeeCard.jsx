import React from 'react';
import { Mail, Phone, Calendar, Briefcase, Edit3, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header with avatar initials and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">{employee.name}</h4>
              <p className="text-xs text-indigo-600 font-medium">{employee.position}</p>
            </div>
          </div>
          <StatusBadge status={employee.status} />
        </div>

        {/* Details list */}
        <div className="space-y-2.5 text-xs text-gray-600 my-4 border-t border-b border-gray-50 py-3">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-gray-400" />
            <span className="font-medium text-gray-800">Department:</span> {employee.department}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span>Joined: {employee.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* Footer salary and actions */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gray-400 block">Monthly Salary</span>
          <span className="text-sm font-bold text-gray-900">₹{employee.salary.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Employee"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Employee"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
