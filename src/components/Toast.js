import React, { useEffect } from "react";

export default function Toast({ open, message, icon = "✓", duration = 3500, onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;
  return (
    <div className="fixed left-1/2 bottom-10 z-50 -translate-x-1/2 flex items-center px-6 py-3 rounded-lg shadow-lg bg-white border border-blue-200 text-blue-700 text-lg font-bold animate-fadeinup min-w-[220px] max-w-xs">
      <span className="mr-2 text-2xl">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
