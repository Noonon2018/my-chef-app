import React from "react";

export default function SuccessModal({ open, title = "สำเร็จ!", message, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 flex flex-col items-center relative animate-fadeindown">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#22C55E" fillOpacity="0.15"/>
            <text x="24" y="34" textAnchor="middle" fontSize="36" fill="#22C55E" fontWeight="bold">✓</text>
          </svg>
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-2">{title}</div>
        <div className="text-base text-gray-700 text-center mb-6 whitespace-pre-line">{message}</div>
        <button
          className="px-8 py-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 shadow text-lg"
          onClick={onClose}
        >รับทราบ</button>
      </div>
    </div>
  );
}
