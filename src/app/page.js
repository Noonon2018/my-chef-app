"use client";
// --- AnalysisTab and Cards ---
function AnalysisTab({ history, shoppingGroups, saveShoppingGroups }) {
  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Card 1: Top 5 Essentials */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <div className="font-bold text-lg mb-2 flex items-center gap-2">🌟 ของใช้ประจำตัวท็อป 5</div>
        <TopEssentialsCard history={history} />
      </div>
      {/* Card 2: Running Low Alert */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <div className="font-bold text-lg mb-2 flex items-center gap-2">🔔 สัญญาณเตือน: ของอาจจะใกล้หมด</div>
        <RunningLowCard history={history} shoppingGroups={shoppingGroups} onAddItem={name => {
          let groups = [...shoppingGroups];
          let groupIdx = groups.length > 0 ? 0 : -1;
          if (groupIdx === -1) {
            groups.push({ place: "ไม่ระบุ", items: [] });
            groupIdx = 0;
          }
          if (!groups[groupIdx].items.some(i => i.name === name)) {
            groups[groupIdx].items.push({ name, amount: "1", unit: "ชิ้น", note: "", id: Date.now() + Math.random() });
            saveShoppingGroups(groups);
          }
        }} />
      </div>
      {/* Card 3: Unnecessary Items */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <div className="font-bold text-lg mb-2 flex items-center gap-2">🧐 ของที่อาจไม่จำเป็น?</div>
        <UnnecessaryItemsCard history={history} />
      </div>
    </div>
  );
}

function TopEssentialsCard({ history }) {
  const freq = {};
  history.forEach(h => h.groups.forEach(g => g.items.forEach(i => {
    freq[i.name] = (freq[i.name] || 0) + 1;
  })));
  const top5 = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5);
  if (top5.length === 0) return <div className="text-gray-400">ยังไม่มีข้อมูล</div>;
  return (
    <ol className="list-decimal ml-6 text-base">
      {top5.map(([name, count]) => (
        <li key={name}>{name} <span className="text-gray-500">({count} ครั้ง)</span></li>
      ))}
    </ol>
  );
}

function RunningLowCard({ history, shoppingGroups, onAddItem }) {
  const itemDates = {};
  history.forEach(h => h.groups.forEach(g => g.items.forEach(i => {
    if (!itemDates[i.name]) itemDates[i.name] = [];
    itemDates[i.name].push(new Date(h.date));
  })));
  const alerts = [];
  Object.entries(itemDates).forEach(([name, dates]) => {
    if (dates.length < 2) return;
    dates.sort((a,b) => a-b);
    const intervals = dates.slice(1).map((d,i) => (d - dates[i])/(1000*60*60*24));
    const avg = intervals.reduce((a,b) => a+b,0)/intervals.length;
    const last = (new Date() - dates[dates.length-1])/(1000*60*60*24);
    const inCurrent = shoppingGroups.some(g => g.items.some(i => i.name === name));
    if (last > avg + 1 && !inCurrent) {
      alerts.push({name, avg: Math.round(avg), last: Math.round(last)});
    }
  });
  if (alerts.length === 0) return <div className="text-gray-400">ยังไม่มีของที่ควรเตือน</div>;
  return (
    <ul className="flex flex-col gap-2">
      {alerts.map(a => (
        <li key={a.name} className="flex items-center gap-2">
          <span>ดูเหมือนว่า <span className="font-bold text-green-700">&apos;{a.name}&apos;</span> จะหมดแล้ว! (ปกติซื้อทุก {a.avg} วัน, ห่างจากครั้งล่าสุด {a.last} วัน)</span>
          <button className="ml-2 px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 text-sm" onClick={() => onAddItem(a.name)}>+ เพิ่ม</button>
        </li>
      ))}
    </ul>
  );
}

function UnnecessaryItemsCard({ history }) {
  const itemDates = {};
  history.forEach(h => h.groups.forEach(g => g.items.forEach(i => {
    if (!itemDates[i.name]) itemDates[i.name] = [];
    itemDates[i.name].push(new Date(h.date));
  })));
  const now = new Date();
  const oneTime = Object.entries(itemDates)
    .filter(([name, dates]) => dates.length === 1 && (now - dates[0])/(1000*60*60*24) <= 183)
    .map(([name]) => name);
  const rare = Object.entries(itemDates)
    .filter(([name, dates]) => (dates.length <= 2 && (now - dates[0])/(1000*60*60*24) <= 183) || ((now - Math.max(...dates.map(d=>d.getTime())))/(1000*60*60*24) > 120))
    .map(([name]) => name)
    .filter(name => !oneTime.includes(name));
  return (
    <div>
      <div className="mb-1 text-sm text-gray-600">ซื้อครั้งเดียว: <span className="text-gray-800">{oneTime.length > 0 ? oneTime.join(', ') : 'ไม่มี'}</span></div>
      <div className="mb-1 text-sm text-gray-600">นานๆซื้อที: <span className="text-gray-800">{rare.length > 0 ? rare.join(', ') : 'ไม่มี'}</span></div>
      <div className="text-xs text-gray-400 mt-2">*เป็นการแนะนำจากข้อมูลความถี่เท่านั้น คุณคือผู้ตัดสินใจที่ดีที่สุดครับ!</div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";






// Editable basket item row component (must be top-level, not inside Home)
function EditableBasketItem({ item, onChange, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount);
  const [unit, setUnit] = useState(item.unit);
  const [note, setNote] = useState(item.note || "");

  useEffect(() => {
    setName(item.name);
    setAmount(item.amount);
    setUnit(item.unit);
    setNote(item.note || "");
  }, [item]);

  if (!edit) {
    return (
      <li className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
        <span>{name} <span className="text-gray-400">({amount} {unit})</span></span>
        {note && <span className="text-xs text-gray-500 ml-2">{note}</span>}
        <button className="ml-auto px-2 py-1 text-xs rounded bg-gray-300 text-gray-700 font-bold hover:bg-gray-400" onClick={() => setEdit(true)}>...</button>
        <button className="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white font-bold hover:bg-red-600" onClick={onDelete}>(x)</button>
      </li>
    );
  }
  return (
    <li className="flex flex-col gap-2 bg-gray-50 rounded px-3 py-2 border border-blue-300">
      <div className="flex gap-2 items-end">
        <input className="flex-1 border rounded px-2 py-1 font-bold" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded bg-gray-200 text-lg font-bold hover:bg-gray-300"
            onClick={() => setAmount(a => String(Math.max(1, Number(a) - 1)))}
            type="button"
          >-</button>
          <input
            className="w-12 border rounded px-2 py-1 text-center font-bold"
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, '') || '1')}
          />
          <button
            className="px-2 py-1 rounded bg-gray-200 text-lg font-bold hover:bg-gray-300"
            onClick={() => setAmount(a => String(Number(a) + 1))}
            type="button"
          >+</button>
        </div>
        <select className="border rounded px-2 py-1 font-bold" value={unit} onChange={e => setUnit(e.target.value)}>
          <option>ชิ้น</option>
          <option>แพ็ค</option>
          <option>ขวด</option>
          <option>ถุง</option>
          <option>กล่อง</option>
          <option>กิโลกรัม</option>
          <option>ลิตร</option>
          <option>อื่นๆ</option>
        </select>
        <button className="ml-2 px-3 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-700" onClick={() => { onChange({ name, amount, unit, note }); setEdit(false); }}>บันทึก</button>
        <button className="ml-2 px-2 py-1 rounded bg-gray-300 text-gray-700 font-bold hover:bg-gray-400" onClick={() => setEdit(false)}>ยกเลิก</button>
      </div>
      <textarea className="w-full border rounded px-2 py-1 font-bold mt-2" value={note} onChange={e => setNote(e.target.value)} placeholder="บันทึก/หมายเหตุ (ไม่บังคับ)" rows={1} maxLength={100} />
    </li>
  );
}

// Utility functions (no hooks)
function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  } catch {
    return [];
  }
}
function getShoppingGroups() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("mychef-items");
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].place) {
      return parsed;
    } else if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
      // กรณีเก่า: array ของ item เดี่ยวๆ
      return [{ place: "ไม่ระบุ", items: parsed }];
    }
    return [];
  } catch {
    return [];
  }
}

// Modal แสดงรายละเอียดออเดอร์ (minimal, Thai)
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={onClose} aria-label="ปิด">×</button>
        <h3 className="text-xl font-bold mb-4 text-green-700">รายละเอียดออเดอร์</h3>
        <div className="mb-2"><span className="font-semibold">ซัพพลายเออร์:</span> {order.supplier || <span className="text-gray-400">ไม่มีข้อมูล</span>}</div>
        <div className="mb-2"><span className="font-semibold">วันที่สั่งซื้อ:</span> {order.orderDate}</div>
        <div className="mb-2"><span className="font-semibold">สถานะ:</span> {order.status === 'SENT' ? 'ส่งแล้ว' : 'ฉบับร่าง'}</div>
        {/* เพิ่มรายละเอียดอื่นๆ ตามต้องการ */}
        <button className="mt-6 w-full py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700" onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
// ...no code here, just close the function...
}

export default function Home() {
  // Printer Settings modal state (advanced)
  const [showPrinterSettings, setShowPrinterSettings] = useState(false);
  // Mock printer info (simulate connected printer)
  const [printerModel, setPrinterModel] = useState('TSP143IIIW');
  const [printerNickname, setPrinterNickname] = useState('เครื่องพิมพ์ในครัว');
  const [testStatus, setTestStatus] = useState('idle'); // idle | sending | success | error
  const [quickPrint, setQuickPrint] = useState(false); // toggle for quick print
  const [receiptCopies, setReceiptCopies] = useState(1); // number of copies

  // Remove printer (reset state)
  const handleRemovePrinter = () => {
    if (window.confirm('ต้องการยกเลิกการเชื่อมต่อเครื่องพิมพ์นี้หรือไม่?')) {
      setPrinterModel('');
      setPrinterNickname('');
    }
  };

  // Mock test print
  const handleTestPrint = async () => {
    setTestStatus('sending');
    setTimeout(() => setTestStatus('success'), 1200);
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  // Quick print toggle
  const handleToggleQuickPrint = () => setQuickPrint(q => !q);

  // Change receipt copies
  const handleChangeCopies = (delta) => {
    setReceiptCopies(c => Math.max(1, c + delta));
  };
  // Print preview modal state
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Print handler
  const handlePrint = () => {
    window.print();
    setShowPrintPreview(false);
  };
  // For quick add to group
  const handleQuickAddToGroup = (place) => {
    setShowAddModal(true);
    setBasketPlace(place);
    setBasketItems([]);
    setItemName("");
    setItemAmount("1");
    setItemUnit("ชิ้น");
    setItemNote("");
    setEditItem(null);
  };
  // For new group
  const handleCreateNewGroup = () => {
    setShowAddModal(true);
    setBasketPlace("");
    setBasketItems([]);
    setItemName("");
    setItemAmount("1");
    setItemUnit("ชิ้น");
    setItemNote("");
    setEditItem(null);
  };
  // State for basket modal (multi-add)
  const [basketPlace, setBasketPlace] = useState("");
  const [basketItems, setBasketItems] = useState([]);
  // Auto-complete & frequent items state
  const [itemSuggestions, setItemSuggestions] = useState([]); // dropdown list
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [frequentItems, setFrequentItems] = useState([]); // chips for current place

  // Modal for viewing history details
  const [viewHistoryIdx, setViewHistoryIdx] = useState(null);

  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const shoppingListRef = useRef(null);
  const recipesRef = useRef(null);
  const [shoppingGroups, setShoppingGroups] = useState([]);
  // --- Add/Edit/Delete Shopping Item State & Handlers ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("1");
  const [itemNote, setItemNote] = useState("");
  const [itemPlace, setItemPlace] = useState("");
  const [itemUnit, setItemUnit] = useState("ชิ้น");
  const [editItem, setEditItem] = useState(null); // { groupPlace, idx }
  const [activeTab, setActiveTab] = useState("current");
  const [checked, setChecked] = useState({});
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mychef-history") || "[]");
    } catch { return []; }
  });

  // Save shopping groups to localStorage
  // ซื้อซ้ำ: Copy all items from a history entry to current list
  const handleRepeatPurchase = (idx) => {
    const entry = history[idx];
    if (!entry || !entry.groups) return;
    // Merge all items from entry.groups into shoppingGroups
    let newGroups = [...shoppingGroups];
    entry.groups.forEach(histGroup => {
      if (!histGroup.items || histGroup.items.length === 0) return;
      // Find or create group by place
      let groupIdx = newGroups.findIndex(g => g.place === histGroup.place);
      if (groupIdx === -1) {
        newGroups.push({ place: histGroup.place, items: [...histGroup.items] });
      } else {
        // Add only items that are not already in the group (by name, amount, unit, note)
        histGroup.items.forEach(item => {
          const exists = newGroups[groupIdx].items.some(i =>
            i.name === item.name && i.amount === item.amount && i.unit === item.unit && i.note === (item.note || "")
          );
          if (!exists) newGroups[groupIdx].items.push({ ...item, id: Date.now() + Math.random() });
        });
      }
    });
    saveShoppingGroups(newGroups);
    setActiveTab('current');
    alert('เพิ่มรายการซื้อซ้ำลงในลิสต์ปัจจุบันแล้ว!');
  };
  const saveShoppingGroups = (groups) => {
    setShoppingGroups(groups);
    localStorage.setItem("mychef-items", JSON.stringify(groups));
  };

  // Add or update item
  const handleSaveItem = () => {
    // Add all items in basket to shoppingGroups
    if (basketItems.length === 0) return;
    let groups = [...shoppingGroups];
    let groupIdx = groups.findIndex(g => g.place === (basketPlace || "ไม่ระบุ"));
    if (groupIdx === -1) {
      groups.push({ place: basketPlace || "ไม่ระบุ", items: [] });
      groupIdx = groups.length - 1;
    }
    // Add all basket items
    basketItems.forEach(item => {
      groups[groupIdx].items.push({ ...item, id: Date.now() + Math.random() });
    });
    saveShoppingGroups(groups);
    setShowAddModal(false);
    setBasketPlace("");
    setBasketItems([]);
    setItemName("");
    setItemAmount("1");
    setItemNote("");
    setItemPlace("");
    setItemUnit("ชิ้น");
    setEditItem(null);
  };

  // Edit item
  const handleEditItem = (groupPlace, idx) => {
    const group = shoppingGroups.find(g => g.place === groupPlace);
    if (!group) return;
    const item = group.items[idx];
    setEditItem({ groupPlace, idx });
    setItemName(item.name);
    setItemAmount(item.amount || "1");
    setItemNote(item.note || "");
    setItemPlace(item.place || groupPlace || "");
    setItemUnit(item.unit || "ชิ้น");
    setShowAddModal(true);
  };

  // Delete item
  const handleDeleteItem = (groupPlace, idx) => {
    if (!window.confirm("ลบของนี้ใช่หรือไม่?")) return;
    const groups = shoppingGroups.map(g =>
      g.place === groupPlace
        ? { ...g, items: g.items.filter((_, i) => i !== idx) }
        : g
    );
    saveShoppingGroups(groups);
  };

  // Copy list to clipboard
  const handleCopyList = () => {
    let text = shoppingGroups.map(g =>
      (g.place ? `[${g.place}]\n` : "") +
      g.items.map(i => `- ${i.name}${i.amount ? ` (${i.amount}${i.unit || ''})` : ''}${i.note ? ` : ${i.note}` : ''}`).join("\n")
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    alert("คัดลอกลิสต์เรียบร้อยแล้ว!");
  };

  // Checkbox toggle
  const handleCheck = (groupPlace, idx) => {
    setChecked(prev => ({ ...prev, [groupPlace + '-' + idx]: !prev[groupPlace + '-' + idx] }));
  };

  // End shopping: move to history and clear
  const handleEndShopping = () => {
    if (!window.confirm("ยืนยันสิ้นสุดการซื้อ?")) return;
    const newHistory = [
      { date: new Date().toISOString(), groups: shoppingGroups },
      ...history
    ];
    setHistory(newHistory);
    localStorage.setItem("mychef-history", JSON.stringify(newHistory));
    saveShoppingGroups([]);
    setChecked({});
  };

  // โหลด orders ทุกครั้งที่เข้า/รีเฟรชหน้า และเมื่อกลับมาที่ tab นี้
  useEffect(() => {
    const update = () => setOrders(loadOrders());
    update();
    const handler = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  // โหลด shopping list ทุกครั้งที่เข้า/รีเฟรชหน้า และเมื่อกลับมาที่ tab นี้
  useEffect(() => {
    const update = () => setShoppingGroups(getShoppingGroups());
    update();
    const handler = () => {
      if (document.visibilityState === "visible") update();
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  // Auto-complete: build all item names from history and shoppingGroups
  useEffect(() => {
    // Collect all unique item names from history and shoppingGroups
    const names = new Set();
    shoppingGroups.forEach(g => g.items.forEach(i => names.add(i.name)));
    history.forEach(h => h.groups.forEach(g => g.items.forEach(i => names.add(i.name))));
    setItemSuggestions(Array.from(names));
  }, [shoppingGroups, history]);

  // Frequent items for current place (top 4-5)
  useEffect(() => {
    if (!basketPlace) { setFrequentItems([]); return; }
    // Count frequency from history for this place
    const freq = {};
    history.forEach(h => h.groups.forEach(g => {
      if (g.place === basketPlace) {
        g.items.forEach(i => {
          freq[i.name] = (freq[i.name] || 0) + 1;
        });
      }
    }));
    // Sort by count desc, take top 5
    const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).map(([name]) => name).slice(0,5);
    setFrequentItems(sorted);
  }, [basketPlace, history]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800">My Chef</span>
        </div>
        <nav>
          <button className="ml-4 px-4 py-2 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 text-sm" onClick={() => setShowPrinterSettings(true)}>
            ตั้งค่าเครื่องพิมพ์
          </button>
        </nav>
      </header>
      {/* Printer Settings Modal (Advanced) */}
      {showPrinterSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-md relative">
            <div className="flex items-center border-b px-4 py-3">
              <button className="mr-2 text-2xl text-gray-500 hover:text-blue-600" onClick={() => setShowPrinterSettings(false)} aria-label="ปิด">←</button>
              <h2 className="text-xl font-bold text-blue-700 flex-1 text-center">ตั้งค่าเครื่องพิมพ์</h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {/* Connected Printer */}
              <div className="flex items-start gap-3 border-b pb-4">
                <span className="text-2xl mt-1">🖨️</span>
                <div className="flex-1">
                  <div className="font-bold text-base mb-1">เครื่องพิมพ์ที่เชื่อมต่อ</div>
                  {printerModel ? (
                    <>
                      <div className="text-gray-800 font-mono text-sm">{printerModel}</div>
                      {printerNickname && <div className="text-gray-500 text-xs">{printerNickname}</div>}
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm">ยังไม่ได้เชื่อมต่อเครื่องพิมพ์</div>
                  )}
                </div>
                {printerModel && (
                  <button className="ml-2 px-3 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600 text-sm" onClick={handleRemovePrinter}>ลบ</button>
                )}
              </div>
              {/* Test Print */}
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="text-2xl">🧾</span>
                <div className="flex-1">
                  <div className="font-bold text-base mb-1">ทดสอบการพิมพ์</div>
                  <div className="text-gray-500 text-xs">ส่งหน้าทดสอบเพื่อตรวจสอบว่าเครื่องพิมพ์ทำงานปกติ</div>
                </div>
                <button className="ml-2 px-3 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-700 text-sm min-w-[70px]" onClick={handleTestPrint} disabled={testStatus==='sending'}>
                  {testStatus === 'sending' ? 'กำลังทดสอบ...' : 'ทดสอบ'}
                </button>
              </div>
              {testStatus === 'success' && <div className="text-green-600 text-center text-sm">✅ ทดสอบสำเร็จ! กรุณาตรวจสอบเครื่องพิมพ์</div>}
              {testStatus === 'error' && <div className="text-red-500 text-center text-sm">❌ เกิดข้อผิดพลาด กรุณาลองใหม่</div>}
              {/* Quick Print Toggle */}
              <div className="flex items-center gap-3 border-b pb-4">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <div className="font-bold text-base mb-1">พิมพ์ด่วน (ข้ามหน้าพรีวิว)</div>
                </div>
                <button
                  className={`ml-2 w-14 h-8 flex items-center rounded-full px-1 transition-colors duration-200 ${quickPrint ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onClick={handleToggleQuickPrint}
                  aria-pressed={quickPrint}
                  title="สลับพิมพ์ด่วน"
                >
                  <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-200 ${quickPrint ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              {/* Receipt Copies */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <div className="flex-1">
                  <div className="font-bold text-base mb-1">จำนวนสำเนาต่อลิสต์</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300" onClick={() => handleChangeCopies(-1)} disabled={receiptCopies <= 1}>-</button>
                  <span className="w-6 text-center font-bold text-lg">{receiptCopies}</span>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300" onClick={() => handleChangeCopies(1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto mt-8">
          {/* Tabs */}
          <div className="flex items-center border-b mb-4">
            <button className={`px-6 py-2 font-bold text-lg border-b-2 transition ${activeTab === 'current' ? 'border-blue-500 text-blue-600 border-blue-500' : 'border-transparent text-gray-400'}`} onClick={() => setActiveTab('current')}>ลิสต์ปัจจุบัน</button>
            <button className={`px-6 py-2 font-bold text-lg border-b-2 transition ${activeTab === 'history' ? 'border-blue-500 text-blue-600 border-blue-500' : 'border-transparent text-gray-400'}`} onClick={() => setActiveTab('history')}>ประวัติ</button>
            <button className={`px-6 py-2 font-bold text-lg border-b-2 transition ${activeTab === 'analysis' ? 'border-blue-500 text-blue-600 border-blue-500' : 'border-transparent text-gray-400'}`} onClick={() => setActiveTab('analysis')}>วิเคราะห์</button>
            {activeTab === 'current' && (
              <>
                <button className="ml-auto mr-2 text-2xl text-blue-500 hover:text-blue-700" title="คัดลอกลิสต์" onClick={handleCopyList}>📋</button>
                <button className="mr-2 text-2xl text-blue-500 hover:text-blue-700" title="พิมพ์ลิสต์" onClick={() => setShowPrintPreview(true)}>🖨️</button>
              </>
            )}
      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative print:shadow-none print:p-0 print:bg-white">
            <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 print:hidden" onClick={() => setShowPrintPreview(false)}>×</button>
            {/* Receipt Layout */}
            <div className="print-preview text-gray-800">
              <div className="text-3xl font-extrabold text-center mb-2">My Chef</div>
              <div className="text-lg font-bold text-center mb-4">Shopping List</div>
              <div className="text-sm text-center text-gray-500 mb-4">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {shoppingGroups.length === 0 ? (
                <div className="text-center text-gray-400">ไม่มีรายการในลิสต์</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {shoppingGroups.map(group => (
                    <div key={group.place}>
                      <div className="font-bold text-base text-center my-2">--- {group.place} ---</div>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((item, idx) => (
                          <li key={item.id} className="flex items-center gap-2 text-base">
                            <span className="inline-block w-6 h-6 border border-gray-400 rounded mr-2 align-middle"></span>
                            <span>{item.name} <span className="text-gray-500">({item.amount} {item.unit})</span></span>
                            {item.note && <span className="text-xs text-gray-400 ml-2">{item.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-dashed my-4"></div>
              <div className="text-center text-sm text-gray-500 mt-2">Happy Shopping!</div>
              {/* Optionally, add a QR code here in the future */}
            </div>
            {/* Print/Cancel Buttons */}
            <div className="flex gap-4 mt-6 print:hidden">
              <button className="flex-1 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600" onClick={handlePrint}>พิมพ์</button>
              <button className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-bold" onClick={() => setShowPrintPreview(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
          </div>
          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <AnalysisTab
              history={history}
              shoppingGroups={shoppingGroups}
              saveShoppingGroups={saveShoppingGroups}
            />
          )}


          {/* Current List Tab */}
          {activeTab === 'current' && (
            <div className="relative">
              {/* Floating Add Button */}
              <button
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-blue-500 text-white text-4xl shadow-lg flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => { setShowAddModal(true); setEditItem(null); }}
                title="เพิ่มของ"
                aria-label="เพิ่มของ"
              >+</button>

              {/* Add/Edit Modal */}
              {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                    <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowAddModal(false); setEditItem(null); setBasketPlace(""); setBasketItems([]); }}>×</button>
                    {/* Place */}
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1 font-bold">เพิ่มของสำหรับ: <span className="text-green-700">[ {basketPlace || "ไม่ระบุ"} ]</span></label>
                      <input
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 font-bold mb-2"
                        value={basketPlace}
                        onChange={e => setBasketPlace(e.target.value)}
                        placeholder="เช่น Lotus, Makro, ตลาดสด"
                        maxLength={30}
                      />
                    </div>
                    {/* Single input for name, add by Enter or +, with auto-complete dropdown */}
                    <div className="mb-3 flex flex-col gap-1 relative">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                          <input
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 font-bold"
                            value={itemName}
                            onChange={e => {
                              setItemName(e.target.value);
                              setShowSuggestions(!!e.target.value);
                            }}
                            placeholder="พิมพ์ชื่อของแล้วกด Enter..."
                            maxLength={40}
                            autoComplete="off"
                            onFocus={() => setShowSuggestions(!!itemName)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && itemName.trim()) {
                                setBasketItems([...basketItems, { name: itemName, amount: "1", unit: "ชิ้น", note: "" }]);
                                setItemName("");
                                setShowSuggestions(false);
                              }
                            }}
                          />
                          {/* Auto-complete dropdown */}
                          {showSuggestions && itemName.trim() && (
                            <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow z-50 mt-1 max-h-48 overflow-auto">
                              {itemSuggestions.filter(n => n.includes(itemName.trim()) && !basketItems.some(b => b.name === n)).length === 0 ? (
                                <li className="px-3 py-2 text-gray-400 select-none">ไม่พบรายการแนะนำ</li>
                              ) : (
                                itemSuggestions.filter(n => n.includes(itemName.trim()) && !basketItems.some(b => b.name === n)).slice(0,8).map((n, i) => (
                                  <li
                                    key={n}
                                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                                    onMouseDown={() => {
                                      setItemName(n);
                                      setShowSuggestions(false);
                                    }}
                                  >{n}</li>
                                ))
                              )}
                            </ul>
                          )}
                        </div>
                        <button
                          className="px-3 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600"
                          onClick={() => {
                            if (!itemName.trim()) return;
                            setBasketItems([...basketItems, { name: itemName, amount: "1", unit: "ชิ้น", note: "" }]);
                            setItemName("");
                            setShowSuggestions(false);
                          }}
                          disabled={!itemName.trim()}
                        >+</button>
                      </div>
                      {/* Frequent items chips for this store */}
                      {basketPlace && frequentItems.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <span className="text-sm text-gray-500 font-bold mr-2">ซื้อบ่อยที่ {basketPlace}:</span>
                          {frequentItems.map(name => (
                            <button
                              key={name}
                              className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm hover:bg-green-200 border border-green-300"
                              type="button"
                              onClick={() => {
                                setBasketItems([...basketItems, { name, amount: "1", unit: "ชิ้น", note: "" }]);
                                setItemName("");
                                setShowSuggestions(false);
                              }}
                              disabled={basketItems.some(b => b.name === name)}
                            >{name}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Basket preview with editable rows */}
                    <hr className="my-4" />
                    <div className="mb-2 font-bold text-gray-700">ของในตะกร้านี้:</div>
                    {basketItems.length === 0 ? (
                      <div className="text-gray-400 text-base font-medium py-2">ยังไม่มีของในตะกร้า</div>
                    ) : (
                      <ul className="mb-4 flex flex-col gap-2">
                        {basketItems.map((item, idx) => (
                          <EditableBasketItem
                            key={idx}
                            item={item}
                            onChange={newItem => {
                              setBasketItems(basketItems.map((it, i) => i === idx ? newItem : it));
                            }}
                            onDelete={() => setBasketItems(basketItems.filter((_, i) => i !== idx))}
                          />
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2 justify-end mt-4">
                      <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold" onClick={() => { setShowAddModal(false); setEditItem(null); setBasketPlace(""); setBasketItems([]); }}>ยกเลิก</button>
                      <button className="px-4 py-2 rounded bg-green-600 text-white text-xl font-extrabold shadow-md hover:bg-green-700 transition-colors" onClick={handleSaveItem} disabled={basketItems.length === 0}>เพิ่ม {basketItems.length} รายการลงลิสต์</button>
                    </div>
                  </div>
                </div>
              )}





              {/* List by Bill/Place */}
              <div className="flex flex-col gap-6 pb-40">
                {shoppingGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-80 select-none mt-12">
                    <div className="text-2xl font-bold text-gray-400 mb-2">ลิสต์ของคุณยังว่างอยู่</div>
                    <div className="text-base text-gray-500 flex flex-col items-center">
                      <span>กดปุ่ม <span className="inline-block align-middle text-blue-500 text-2xl font-extrabold">+</span> ที่มุมขวาล่างเพื่อเริ่มสร้างลิสต์ใหม่</span>
                      <span className="mt-2 text-blue-400 text-3xl animate-bounce">↘</span>
                    </div>
                  </div>
                ) : (
                  shoppingGroups.map(group => (
                    <div key={group.place} className="w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-800">{group.place}</span>
                      </div>
                      {group.items.length === 0 ? (
                        <div className="text-gray-400 text-base font-medium py-2">ยังไม่มีของในร้านนี้</div>
                      ) : (
                        <ul className="flex flex-col gap-2">
                          {group.items.map((item, idx) => (
                            <li key={item.id} className="w-full bg-white rounded-lg px-4 py-3 flex items-center font-semibold text-lg text-gray-700 group shadow-sm">
                              <input type="checkbox" className="w-6 h-6 mr-4 accent-blue-500" checked={!!checked[group.place + '-' + idx]} onChange={() => handleCheck(group.place, idx)} />
                              <div className="flex flex-col flex-1">
                                <span>{item.name} <span className="text-base text-gray-400 font-normal">{item.amount} {item.unit}</span></span>
                                {item.note && <span className="text-xs text-gray-500 mt-1">{item.note}</span>}
                              </div>
                              <button className="ml-2 px-2 py-1 text-xs rounded bg-blue-500 text-white font-bold hover:bg-blue-600" onClick={() => handleEditItem(group.place, idx)}>แก้ไข</button>
                              <button className="ml-2 px-2 py-1 text-xs rounded bg-red-400 text-white font-bold hover:bg-red-500" onClick={() => handleDeleteItem(group.place, idx)}>ลบ</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* End Shopping Button */}
              {shoppingGroups.length > 0 && (
                <button className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90vw] max-w-md py-4 rounded-xl bg-blue-500 text-white text-xl font-extrabold shadow-lg flex items-center justify-center gap-2 hover:bg-blue-600 z-40" onClick={handleEndShopping}>
                  ✔️ สิ้นสุดการซื้อ
                </button>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="mt-8">
              {history.length === 0 ? (
                <div className="text-gray-400 text-lg font-semibold">ยังไม่มีประวัติการซื้อ</div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {history.map((h, i) => {
                    // Summary: date, first place, total items
                    const dateStr = new Date(h.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                    const allItems = h.groups.flatMap(g => g.items || []);
                    const firstPlace = h.groups[0]?.place || 'ไม่ระบุ';
                    return (
                      <li key={i} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-green-50 transition" onClick={() => setViewHistoryIdx(i)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-green-700 font-bold text-base mb-1">รายการซื้อของ - {dateStr}</div>
                            <div className="text-gray-500 text-sm italic">ซื้อที่ {firstPlace} ({allItems.length} รายการ)</div>
                          </div>
                          <button
                            className="ml-2 px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-1"
                            onClick={e => { e.stopPropagation(); handleRepeatPurchase(i); }}
                            title="ซื้อซ้ำ"
                          >🛒 ซื้อซ้ำ</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* History Detail Modal */}
              {viewHistoryIdx !== null && history[viewHistoryIdx] && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                    <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600" onClick={() => setViewHistoryIdx(null)}>×</button>
                    <h2 className="text-xl font-extrabold mb-4">รายละเอียดการซื้อ - {new Date(history[viewHistoryIdx].date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</h2>
                    {history[viewHistoryIdx].groups.map((group, gi) => (
                      <div key={gi} className="mb-3">
                        <div className="font-bold text-base text-green-700 mb-1">{group.place}</div>
                        <ul className="flex flex-col gap-1">
                          {group.items.map((item, idx) => (
                            <li key={item.id} className="text-gray-700 text-base flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-gray-400 text-sm">{item.amount} {item.unit}</span>
                              {item.note && <span className="text-xs text-gray-500">{item.note}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center text-sm py-4 text-gray-400 bg-white border-t">
        © 2025 My Chef
      </footer>
    </div>
  );
}
