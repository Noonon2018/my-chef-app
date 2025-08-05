import React from "react";

export default function NotificationPanel({ notifications = [], onAction, onRemove, onClose }) {
  if (!notifications.length) return null;
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-blue-200 z-50 animate-fadeindown">
      <div className="px-4 py-2 border-b font-bold text-blue-700 flex items-center justify-between">
        <span>การแจ้งเตือน</span>
        <button className="text-xl font-bold hover:text-red-500" onClick={onClose} aria-label="ปิด">×</button>
      </div>
      <ul className="max-h-80 overflow-y-auto divide-y">
        {notifications.map((n, idx) => (
          <li key={idx} className="flex items-center gap-2 px-4 py-3">
            <span className="text-xl">{n.icon || "🔔"}</span>
            <span className="flex-1 text-gray-800">{n.message}</span>
            {n.action && (
              <button className="ml-2 px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 text-sm" onClick={() => onAction?.(n, idx)}>{n.actionLabel || "+ เพิ่ม"}</button>
            )}
            <button className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-600 font-bold hover:bg-gray-300 text-xs" onClick={() => onRemove?.(idx)}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
