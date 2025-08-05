"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InviteMemberModal from "./InviteMemberModal";



const userList = [
  { name: "นนท์", initial: "N" },
  { name: "ปุ้ย", initial: "P" },
  { name: "ซัน", initial: "S" },
  { name: "เพิ่มชื่อเอง...", initial: "+" },
];

export default function FamilySettings() {
  const router = useRouter();
  const [selected, setSelected] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mychef_user") || "";
    }
    return "";
  });
  const [customName, setCustomName] = useState("");
  const [showInput, setShowInput] = useState(false);

  // ฟังก์ชันเลือกชื่อ
  const handleSelect = (name) => {
    if (name === "เพิ่มชื่อเอง...") {
      setShowInput(true);
      setCustomName("");
    } else {
      setSelected(name);
      setShowInput(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("mychef_user", name);
      }
      setTimeout(() => router.push("/"), 350); // redirect กลับหน้าแรก
    }
  };

  // ฟังก์ชันบันทึกชื่อเอง
  const handleCustom = (e) => {
    e.preventDefault();
    if (customName.trim()) {
      setSelected(customName.trim());
      setShowInput(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("mychef_user", customName.trim());
      }
      // แสดงชื่อทันที แล้วค่อย redirect
      setTimeout(() => router.push("/"), 1000); // รอ 1 วิ ให้เห็นชื่อก่อน redirect
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-8 mt-10 border border-green-200">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-green-700 drop-shadow">เลือกชื่อของคุณ</h2>
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {userList.map((u) => (
          <button
            key={u.name}
            className={`px-4 py-2 rounded-full font-bold shadow border-2 transition text-lg ${selected === u.name ? "bg-green-500 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
            onClick={() => handleSelect(u.name)}
          >
            {u.initial} <span className="ml-1">{u.name}</span>
          </button>
        ))}
      </div>
      {showInput && (
        <form onSubmit={handleCustom} className="flex gap-2 justify-center mb-4">
          <input
            className="border-2 border-green-500 bg-white rounded-xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-green-300 text-lg placeholder-gray-400 shadow-sm transition-colors duration-150 text-gray-800 font-bold"
            placeholder="กรอกชื่อของคุณ"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-600 transition">บันทึก</button>
        </form>
      )}
      {selected && (
        <div className="mt-6 text-center">
          <div className="text-green-700 text-xl font-bold">คุณคือ <span className="underline">{selected}</span></div>
          <div className="mt-2 text-gray-500">ชื่อของคุณจะถูกแสดงในลิสต์ปัจจุบัน</div>
        </div>
      )}
    </div>
  );
}
