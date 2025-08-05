import React from "react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      className="relative p-2 rounded-full hover:bg-blue-100 focus:outline-none"
      onClick={onClick}
      aria-label="การแจ้งเตือน"
    >
      <span className="text-2xl">🔔</span>
      {count > 0 && (
        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      )}
    </button>
  );
}
