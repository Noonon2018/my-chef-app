import React from "react";

export default function ConfirmModal({ open, title = "ยืนยันการกระทำ", message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 flex flex-col items-center relative animate-fadeindown">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#3B82F6" fillOpacity="0.15"/>
            <text x="12" y="18" textAnchor="middle" fontSize="24" fill="#3B82F6" fontWeight="bold">?</text>
          </svg>
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">{title}</div>
        <div className="text-base text-gray-700 text-center mb-6 whitespace-pre-line">{message}</div>
        <div className="flex gap-3 w-full justify-center">
          <button
            className="px-6 py-2 rounded-md bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
            onClick={onCancel}
          >ยกเลิก</button>
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 shadow"
            onClick={onConfirm}
          >ยืนยัน</button>
        </div>
      </div>
    </div>
  );
}
