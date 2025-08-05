import React, { useState, useEffect, useRef } from "react";
import UnitSelector from "../components/UnitSelector";


export default function EditItem() {
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("ชิ้น");
  const [customUnit, setCustomUnit] = useState("");
  const [note, setNote] = useState("");
  const [store, setStore] = useState("");
  const [storeChips, setStoreChips] = useState([]);
  const inputRef = useRef(null);

  // โหลดร้านค้าล่าสุด/ใช้บ่อยจาก localStorage
  useEffect(() => {
    const stores = JSON.parse(localStorage.getItem("mychef_stores") || "[]");
    // เรียงตามใช้ล่าสุด (หรือใช้บ่อยในอนาคต)
    setStoreChips(stores.slice(0, 4));
  }, []);

  // เมื่อบันทึกชื่อร้านค้าใหม่ ให้เพิ่มลง localStorage
  const saveStore = (name) => {
    if (!name.trim()) return;
    let stores = JSON.parse(localStorage.getItem("mychef_stores") || "[]");
    // ลบชื่อร้านเดิมถ้ามี แล้วเพิ่มใหม่ไว้หน้าสุด (ล่าสุด)
    stores = [name, ...stores.filter((s) => s !== name)];
    localStorage.setItem("mychef_stores", JSON.stringify(stores));
    setStoreChips(stores.slice(0, 4));
  };

  // เมื่อเลือก Chip ร้านค้า
  const handleChipClick = (name) => {
    setStore(name);
    // โฟกัสช่องกรอก
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleUnitSelect = (selected) => {
    setUnit(selected);
    if (selected !== "อื่นๆ") setCustomUnit("");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="text-lg font-bold mb-2">เพิ่มของสำหรับ: <span className="text-gray-500">[ ไม่ระบุ ]</span></div>
      <div className="mb-4">
        <label className="font-medium mb-1 block">ร้านค้า</label>
        <input
          ref={inputRef}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
          placeholder="พิมพ์หรือเลือกร้านค้า..."
          value={store}
          onChange={e => setStore(e.target.value)}
          onBlur={() => saveStore(store)}
        />
        {storeChips.length > 0 && (
          <div className="mb-2">
            <div className="text-sm text-gray-500 mb-1">ร้านค้าล่าสุด:</div>
            <div className="flex flex-wrap gap-2">
              {storeChips.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-300 hover:bg-blue-100 hover:text-blue-700 transition"
                  onClick={() => handleChipClick(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
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
          เพิ่ม 0 รายการลงลิสต์
        </button>
      </div>
    </div>
  );
}
