import React, { useState } from "react";
import UnitSelector from "../components/UnitSelector";

export default function EditItem() {
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("ชิ้น");
  const [customUnit, setCustomUnit] = useState("");
  const [note, setNote] = useState("");

  const handleUnitSelect = (selected) => {
    setUnit(selected);
    if (selected !== "อื่นๆ") setCustomUnit("");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="text-lg font-bold mb-2">นม</div>
      <hr className="mb-4" />
      <div className="mb-4">
        <div className="font-medium mb-1">จำนวน:</div>
        <div className="flex items-center gap-3">
          <button
            className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-gray-300"
            onClick={() => setAmount((a) => Math.max(1, a - 1))}
            type="button"
          >
            -
          </button>
          <span className="w-8 text-center">{amount}</span>
          <button
            className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-gray-300"
            onClick={() => setAmount((a) => a + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1">หน่วย:</div>
        <UnitSelector
          selected={unit}
          onSelect={handleUnitSelect}
          customUnit={customUnit}
          onCustomUnitChange={setCustomUnit}
        />
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1">บันทึก/หมายเหตุ (ไม่บังคับ):</div>
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="พิมพ์ข้อความ..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          type="button"
        >
          ยกเลิก
        </button>
        <button
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          type="button"
        >
          บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
}
