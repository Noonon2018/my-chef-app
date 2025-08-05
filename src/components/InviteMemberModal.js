import React, { useState } from "react";

export default function InviteMemberModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  if (!open) return null;

  const handleInvite = (e) => {
    e.preventDefault();
    // TODO: เชื่อมต่อ backend ส่งคำเชิญจริง
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm relative border border-green-200">
        <button
          className="absolute top-2 right-2 text-green-300 hover:text-green-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="ปิด"
        >
          ×
        </button>
        <h3 className="text-2xl font-extrabold mb-5 text-center text-green-700 drop-shadow">เชิญสมาชิกใหม่</h3>
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <input
            type="email"
            className="border-2 border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg placeholder:text-gray-400"
            placeholder="อีเมลสมาชิกในครอบครัว"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-2 rounded-lg font-bold text-lg shadow-md transition"
          >
            ส่งคำเชิญ
          </button>
        </form>
        {status === "success" && (
          <div className="mt-4 text-green-600 text-center font-semibold">ส่งคำเชิญสำเร็จ!</div>
        )}
      </div>
    </div>
  );
}
