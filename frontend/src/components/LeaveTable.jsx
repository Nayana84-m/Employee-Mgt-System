import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeaveTable = ({ leaves, onUpdateStatus, userRole = 'Admin' }) => {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h4 className="font-semibold text-gray-700">No Leave Applications</h4>
        <p className="text-xs text-gray-500 mt-1">There are currently no leave records matching your filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Dates & Duration</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4">Status</th>
              {userRole === 'Admin' && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900">
                  {leave.employeeName}
                </td>
                <td className="py-3.5 px-4 text-gray-600">
                  {leave.department}
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium text-[11px]">
                    {leave.leaveType}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-600">
                  <div>{leave.startDate} to {leave.endDate}</div>
                  <span className="text-[10px] text-gray-400 font-medium">({leave.days} {leave.days === 1 ? 'day' : 'days'})</span>
                </td>
                <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={leave.reason}>
                  {leave.reason}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={leave.status} />
                </td>
                {userRole === 'Admin' && (
                  <td className="py-3.5 px-4 text-right">
                    {leave.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onUpdateStatus(leave.id, 'Approved')}
                          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => onUpdateStatus(leave.id, 'Rejected')}
                          className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-[11px] italic">Processed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
