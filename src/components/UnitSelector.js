import React, { useState } from "react";

const UNITS = ["ชิ้น", "ขวด", "แพ็ค", "กก.", "อื่นๆ"];

export default function UnitSelector({ selected, onSelect, customUnit, onCustomUnitChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {UNITS.map((unit) => (
          <button
            key={unit}
            className={`px-4 py-2 rounded-full border transition-colors duration-200 text-sm font-medium ${
              selected === unit ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
            onClick={() => onSelect(unit)}
            type="button"
          >
            {unit}
          </button>
        ))}
      </div>
      {selected === "อื่นๆ" && (
        <input
          className="mt-2 px-4 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          placeholder="พิมพ์หน่วยที่คุณต้องการ..."
          value={customUnit}
          onChange={(e) => onCustomUnitChange(e.target.value)}
        />
      )}
    </div>
  );
}
