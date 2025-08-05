import React from "react";

export default function AnnouncementBar({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="w-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center py-2 px-4 relative animate-fadeindown">
      <span className="truncate flex-1 text-center">{message}</span>
      <button
        className="ml-4 px-2 py-1 rounded hover:bg-blue-200 text-lg font-bold absolute right-4 top-1/2 -translate-y-1/2"
        onClick={onClose}
        aria-label="ปิดประกาศ"
      >×</button>
    </div>
  );
}
