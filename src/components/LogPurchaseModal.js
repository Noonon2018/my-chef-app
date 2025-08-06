import React, { useState } from 'react';

export default function LogPurchaseModal({
  isOpen,
  onClose,
  onSave,
  defaultDate,
  stores = [],
  defaultTotal = '',
}) {
  const [total, setTotal] = useState(defaultTotal);
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReceiptPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    await onSave({ total, date, stores, receipt: receiptFile });
    setTotal('');
    setReceiptFile(null);
    setReceiptPreview(null);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center">บันทึกการซื้อของ</h2>
        <div className="mb-3">
          <label className="block mb-1 font-medium">ยอดรวมค่าใช้จ่าย (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              className="w-full border rounded pl-8 pr-3 py-2 focus:outline-none focus:ring text-lg font-semibold"
              placeholder="เช่น 45.50"
              value={total}
              onChange={e => setTotal(e.target.value)}
              min="0"
              step="0.01"
              inputMode="decimal"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">วันที่</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">ร้านค้า</label>
          <div className="bg-gray-100 rounded px-3 py-2 text-gray-700">
            {stores.join(', ')}
          </div>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">แนบใบเสร็จ (ถ้ามี)</label>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded py-3 hover:bg-gray-50 focus:outline-none"
            onClick={() => document.getElementById('logpurchase-upload').click()}
          >
            <span className="text-blue-600 text-lg">📷</span>
            <span className="font-medium">เพิ่ม/ถ่ายภาพใบเสร็จ</span>
          </button>
          <input
            id="logpurchase-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {receiptPreview && (
            <img src={receiptPreview} alt="preview" className="mt-2 rounded max-h-32 mx-auto border shadow" />
          )}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded py-2"
            onClick={onClose}
          >ยกเลิก</button>
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded py-2 font-bold"
            onClick={handleSave}
          >บันทึกและย้ายไปประวัติ</button>
        </div>
      </div>
    </div>
  );
}
