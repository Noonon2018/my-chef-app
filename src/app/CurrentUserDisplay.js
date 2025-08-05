"use client";
import { useEffect, useState } from "react";

export default function CurrentUserDisplay() {
  const [user, setUser] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(localStorage.getItem("mychef_user") || "");
    }
  }, []);
  if (!user) return null;
  return (
    <div className="mb-4 flex items-center gap-2 justify-center">
      <span className="text-green-700 font-bold text-lg">👤 ผู้จดลิสต์:</span>
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-lg shadow">{user}</span>
    </div>
  );
}
