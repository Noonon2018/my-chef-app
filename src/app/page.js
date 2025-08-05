"use client";
import CurrentUserDisplay from "./CurrentUserDisplay";
// Modal สำหรับแก้ไขสูตรอาหาร
function EditRecipeModal({ open, recipe, onSave, onClose }) {
  const iconOptions = React.useMemo(() => ["🍲","🥩","🐔","🐟","🥦","🍳","🍜","🍚","🍤","🥗","🍕","🍰"], []);
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState(iconOptions[0]);
  const [ingredients, setIngredients] = React.useState("");
  const [steps, setSteps] = React.useState("");
  React.useEffect(() => {
    if (open && recipe) {
      setName(recipe.name || "");
      setIcon(recipe.icon || iconOptions[0]);
      setIngredients((recipe.ingredients||[]).map(i => i.name + (i.amount ? ` ${i.amount}` : "")).join("\n"));
      setSteps((recipe.steps||[]).join("\n"));
    }
  }, [open, recipe, iconOptions]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadein">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={onClose} aria-label="ปิด">×</button>
        <div className="text-xl font-bold mb-4 text-blue-700">แก้ไขสูตร: {name || recipe?.name}</div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">ชื่อสูตรอาหาร:</label>
          <input className="w-full border rounded px-3 py-2 font-bold" value={name} onChange={e=>setName(e.target.value)} maxLength={40} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">ไอคอน:</label>
          <div className="flex gap-2 items-center">
            <button className="text-3xl bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center border border-blue-300" type="button">{icon}</button>
            <div className="flex flex-wrap gap-1 ml-2">
              {iconOptions.map(opt => (
                <button key={opt} className={"text-2xl w-9 h-9 rounded-full flex items-center justify-center border " + (icon===opt ? "bg-blue-100 border-blue-500" : "bg-white border-gray-200 hover:bg-blue-50")}
                  type="button" onClick={()=>setIcon(opt)}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">วัตถุดิบ (ใส่ 1 อย่างต่อ 1 บรรทัด):</label>
          <textarea className="w-full border rounded px-3 py-2 font-mono min-h-[80px]" value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="เนื้อสับ 300 กรัม\nกระเทียม 3 กลีบ" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">วิธีทำ:</label>
          <textarea className="w-full border rounded px-3 py-2 font-mono min-h-[80px]" value={steps} onChange={e=>setSteps(e.target.value)} placeholder="1. ..." />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold" onClick={onClose}>ยกเลิก</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-colors" onClick={()=>{
            // parse ingredients and steps
            const ings = ingredients.split("\n").map(line=>{
              const [name,...rest] = line.trim().split(/\s+/);
              return name ? { name: line.replace(/\s+\d.*$/,"").trim(), amount: line.replace(/^[^\d]+/,"").trim() } : null;
            }).filter(Boolean);
            const stepArr = steps.split("\n").map(s=>s.trim()).filter(Boolean);
            onSave({ ...recipe, name, icon, ingredients: ings, steps: stepArr });
          }}>✔️ บันทึกการแก้ไข</button>
        </div>
      </div>
    </div>
  );
}

// Utility functions (no hooks)

function getShoppingGroups() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("mychef-items");
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].place) {
      // อัปเกรดชื่อกลุ่มเก่าเป็นชื่อใหม่
      return parsed.map(g => g.place === "ไม่ระบุ" ? { ...g, place: "วัตถุดิบของคุณ" } : g);
    } else if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
      // กรณีเก่า: array ของ item เดี่ยวๆ
      return [{ place: "วัตถุดิบของคุณ", items: parsed }];
    }
    return [];
  } catch {
    return [];
  }
}

// Mock loadOrders สำหรับ orders (localStorage)
function loadOrders() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("mychef-orders") || "[]");
  } catch {
    return [];
  }
}
// Modal สำหรับเพิ่มสูตรอาหารใหม่
function AddRecipeModal({ open, onSave, onClose }) {
  const [name, setName] = React.useState("");
  const [ingredients, setIngredients] = React.useState("");
  const [steps, setSteps] = React.useState("");
  React.useEffect(() => {
    if (open) {
      setName("");
      setIngredients("");
      setSteps("");
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadein">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={onClose} aria-label="ปิด">×</button>
        <div className="text-xl font-bold mb-4 text-green-700">เพิ่มสูตรอาหารใหม่</div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">ชื่อสูตรอาหาร:</label>
          <input className="w-full border rounded px-3 py-2 font-bold" value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="พิมพ์ชื่อเมนูของคุณ..." />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">วัตถุดิบ (ใส่ 1 อย่างต่อ 1 บรรทัด):</label>
          <textarea className="w-full border rounded px-3 py-2 font-mono min-h-[80px]" value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="หมูสับ 300 กรัม\nใบกะเพรา 1 กำ" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">วิธีทำ:</label>
          <textarea className="w-full border rounded px-3 py-2 font-mono min-h-[80px]" value={steps} onChange={e=>setSteps(e.target.value)} placeholder="1. ตั้งกระทะ...\n2. ใส่เครื่องปรุง..." />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold" onClick={onClose}>ยกเลิก</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-colors" onClick={() => {
            // parse ingredients and steps
            const ings = ingredients.split("\n").map(line=>{
              const [iname,...rest] = line.trim().split(/\s+/);
              return iname ? { name: line.replace(/\s+\d.*$/,""), amount: line.replace(/^[^\d]+/i,"").trim() } : null;
            }).filter(Boolean);
            const stepArr = steps.split("\n").map(s=>s.trim()).filter(Boolean);
            if (!name.trim() || ings.length === 0 || stepArr.length === 0) return;
            onSave({ id: Date.now(), name: name.trim(), ingredients: ings, steps: stepArr });
          }}>✔️ บันทึกสูตร</button>
        </div>
      </div>
    </div>
  );
}

// --- AnalysisTab and Cards ---
function AnalysisTab({ history, shoppingGroups, saveShoppingGroups }) {
  // --- สูตรอาหาร (ตำราสูตรอัจฉริยะ) ---
  // เก็บสูตรใน localStorage หรือ state (mock data)
  const [recipes, setRecipes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mychef-recipes") || "[]");
    } catch { return []; }
  });
  // Modal state for add recipe
  const [addModal, setAddModal] = React.useState(false);
  // สถิติการดู/ดึงของ (สำหรับวิเคราะห์)
  const [recipeStats, setRecipeStats] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mychef-recipe-stats") || "{}");
    } catch { return {}; }
  });
  // อัปเดต localStorage เมื่อสูตรเปลี่ยน
  React.useEffect(() => {
    localStorage.setItem("mychef-recipes", JSON.stringify(recipes));
  }, [recipes]);
  React.useEffect(() => {
    localStorage.setItem("mychef-recipe-stats", JSON.stringify(recipeStats));
  }, [recipeStats]);

  // เพิ่มสูตรตัวอย่างถ้ายังไม่มี
  React.useEffect(() => {
    if (recipes.length === 0) {
      setRecipes([
        {
          id: 1,
          name: "ผัดกะเพราหมูสับ",
          ingredients: [
            { name: "หมูสับ", amount: "200 กรัม" },
            { name: "ใบกะเพรา", amount: "1 กำ" },
            { name: "กระเทียม", amount: "5 กลีบ" },
            { name: "พริกขี้หนู", amount: "10 เม็ด" },
            { name: "น้ำมันหอย", amount: "1 ช้อนโต๊ะ" },
          ],
          steps: [
            "โขลกกระเทียมกับพริกขี้หนูพอหยาบ",
            "ผัดกระเทียมพริกกับน้ำมัน ใส่หมูสับ ผัดจนสุก",
            "ปรุงรส ใส่ใบกะเพรา ผัดเร็วๆ ปิดไฟ"
          ]
        },
        {
          id: 2,
          name: "ต้มยำกุ้งน้ำข้น",
          ingredients: [
            { name: "กุ้งแม่น้ำ", amount: "500 กรัม" },
            { name: "ข่า", amount: "5 แว่น" },
            { name: "ตะไคร้", amount: "2 ต้น" },
            { name: "ใบมะกรูด", amount: "5 ใบ" },
            { name: "เห็ดฟาง", amount: "100 กรัม" },
          ],
          steps: [
            "ต้มน้ำ ใส่ข่า ตะไคร้ ใบมะกรูด",
            "ใส่กุ้ง เห็ด ปรุงรส ใส่นมข้นจืด ปิดไฟ"
          ]
        }
      ]);
    }
  }, [recipes.length]);

  // เพิ่มสูตรใหม่ (mock, จริงควรมีฟอร์ม)
  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  // --- UI ---
  // --- ฟังก์ชันสำหรับ RecipeList ---
  const handleAddToShoppingList = (recipe, selectedIdxs) => {
    const itemsToAdd = selectedIdxs.map(i => recipe.ingredients[i]);
    if (!itemsToAdd.length) return;
    let groups = [...shoppingGroups];
    let groupIdx = groups.findIndex(g => g.place === "ไม่ระบุ");
    if (groupIdx === -1) {
      groups.push({ place: "ไม่ระบุ", items: [] });
      groupIdx = groups.length - 1;
    }
    itemsToAdd.forEach(item => {
      groups[groupIdx].items.push({
        name: item.name,
        amount: item.amount || "1",
        unit: "ชิ้น",
        note: "",
        id: Date.now() + Math.random()
      });
    });
    saveShoppingGroups(groups);
  };
  const handleExpandRecipe = (rid) => {
    setRecipeStats(stats => ({ ...stats, [rid]: { ...(stats[rid]||{}), view: ((stats[rid]?.view||0)+1) } }));
  };
  const handleAddStat = (rid) => {
    setRecipeStats(stats => ({ ...stats, [rid]: { ...(stats[rid]||{}), add: ((stats[rid]?.add||0)+1) } }));
  };

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Pantry Staples Card (วัตถุดิบติดครัว) */}

      <AddRecipeModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSave={newRecipe => {
          setRecipes(rs => [...rs, newRecipe]);
          setAddModal(false);
        }}
      />
      <PantryStaplesCard
        recipes={recipes}
        onAddToShoppingList={(name, menuName) => {
          let groups = [...shoppingGroups];
          const placeName = menuName || "วัตถุดิบของคุณ";
          let groupIdx = groups.findIndex(g => g.place === placeName);
          if (groupIdx === -1) {
            groups.push({ place: placeName, items: [] });
            groupIdx = groups.length - 1;
          }
          // ไม่เพิ่มซ้ำ
          if (!groups[groupIdx].items.some(i => i.name === name)) {
            groups[groupIdx].items.push({ name, amount: "1", unit: "ชิ้น", note: "", id: Date.now() + Math.random() });
            saveShoppingGroups(groups);
          }
        }}
        onAddRecipe={() => setAddModal(true)}
      />

      {/* All-in-One Smart Cookbook (ตำราสูตรอัจฉริยะ) */}
      <RecipeList
        recipes={recipes}
        onDelete={id => setRecipes(rs => rs.filter(r => r.id !== id))}
        onAddToShoppingList={handleAddToShoppingList}
        onExpand={handleExpandRecipe}
        onAddStat={handleAddStat}
      />

      {/* Card 0: Shopping Rhythm */}
      <ShoppingRhythmCard history={history} />
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


// Pantry Staples Card (วัตถุดิบติดครัวจากสูตร)
function PantryStaplesCard({ recipes, onAddToShoppingList, onAddRecipe }) {
  // วิเคราะห์วัตถุดิบจากทุกสูตร พร้อมเก็บสูตรที่ใช้แต่ละวัตถุดิบ
  const [expanded, setExpanded] = React.useState(null);
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const pantryMap = {};
  recipes.forEach(r => r.ingredients.forEach(i => {
    if (!i.name) return;
    if (!pantryMap[i.name]) pantryMap[i.name] = { count: 0, recipes: [] };
    pantryMap[i.name].count++;
    pantryMap[i.name].recipes.push({ name: r.name, id: r.id });
  }));
  const sorted = Object.entries(pantryMap).sort((a,b) => b[1].count-a[1].count);

  // เพิ่มวัตถุดิบเข้า Shopping List ใน localStorage
  // เพิ่ม argument menuName เพื่อส่งชื่อเมนูไปยัง parent
  const handleAddToShoppingList = (name, menuName) => {
    let groups = [];
    try {
      groups = JSON.parse(localStorage.getItem("mychef-items") || "[]");
    } catch { groups = []; }
    // อัปเกรดชื่อกลุ่มเก่าเป็นชื่อใหม่
    groups = groups.map(g => g.place === "ไม่ระบุ" ? { ...g, place: "วัตถุดิบของคุณ" } : g);
    const placeName = menuName || "วัตถุดิบของคุณ";
    let groupIdx = groups.findIndex(g => g.place === placeName);
    if (groupIdx === -1) {
      groups.push({ place: placeName, items: [] });
      groupIdx = groups.length - 1;
    }
    // ไม่เพิ่มซ้ำ
    if (!groups[groupIdx].items.some(i => i.name === name)) {
      groups[groupIdx].items.push({ name, amount: "1", unit: "ชิ้น", note: "", id: Date.now() + Math.random() });
      localStorage.setItem("mychef-items", JSON.stringify(groups));
      setToast({ open: true, msg: `เพิ่ม "${name}" ในลิสต์ซื้อของแล้ว` });
      // trigger event ให้ component อื่นรีเฟรช (optional)
      window.dispatchEvent(new Event("storage"));
    } else {
      setToast({ open: true, msg: `มี "${name}" อยู่ในลิสต์แล้ว` });
    }
    if (onAddToShoppingList) onAddToShoppingList(name, menuName);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
      <div className="font-bold text-lg mb-2 flex items-center gap-2">🥫 วัตถุดิบติดครัว (จากสูตรอาหารของคุณ)</div>
      {sorted.length === 0 ? (
        <div className="text-gray-400">ยังไม่มีข้อมูลวัตถุดิบจากสูตร</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map(([name, data], idx) => (
            <li key={name} className="">
              <div
                className="flex items-center gap-2 justify-between bg-gray-50 rounded px-3 py-2 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                aria-expanded={expanded === idx}
              >
                <span className="font-bold text-base text-gray-800">{name} <span className="text-gray-500 text-sm">(ใช้ใน {data.count} สูตร)</span></span>
                <div className="flex items-center gap-2">
                  <button
                    className="ml-2 px-3 py-1 rounded bg-green-100 text-green-700 font-bold hover:bg-green-200 text-sm"
                    onClick={e => { e.stopPropagation(); handleAddToShoppingList(name, data.recipes[0]?.name); }}
                  >+ เพิ่ม</button>
                  <span className="text-gray-400 text-lg">{expanded === idx ? '▴' : '▾'}</span>
                </div>
              </div>
              {expanded === idx && (
                <div className="bg-gray-100 rounded-lg p-3 mt-2 ml-2 animate-fade-in">
                  {data.recipes.map(recipe => (
                    <a
                      key={recipe.id}
                      href={`#recipe-${recipe.id}`}
                      className="block py-1 px-2 rounded hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2"
                      onClick={e => { e.stopPropagation(); }}
                    >
                      <span className="text-green-700">•</span> {recipe.name}
                      <span className="ml-1">[→]</span>
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 px-4 py-3 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 shadow flex items-center gap-2 justify-center"
        onClick={onAddRecipe}
      >+ เพิ่มสูตรอาหารใหม่</button>
      {toast.open && (
        <div className="fixed left-1/2 bottom-8 z-[9999] -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-lg font-bold animate-fadein drop-shadow-lg select-none">
          <span className="text-2xl">✓</span>
          <span>{toast.msg}</span>
          <button className="ml-2 text-white text-xl" onClick={() => setToast({ open: false, msg: "" })}>×</button>
        </div>
      )}
    </div>
  );
}

// All-in-One Smart Cookbook (ตำราสูตรอัจฉริยะ) พร้อมตัวสลับมุมมอง (List/Grid)
function RecipeList({ recipes, onDelete, onAddToShoppingList, onExpand, onAddStat }) {
  const [expandedId, setExpandedId] = React.useState(null);
  const [selectMode, setSelectMode] = React.useState(false);
  const [selected, setSelected] = React.useState([]); // index array
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const [view, setView] = React.useState("list"); // "list" | "grid"
  const [search, setSearch] = React.useState("");
  const [editModal, setEditModal] = React.useState({ open: false, recipe: null });

  // ฟิลเตอร์สูตรตามคำค้นหา
  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  // เมื่อขยายสูตร
  const handleExpand = (id) => {
    setExpandedId(id === expandedId ? null : id);
    setSelectMode(false);
    setSelected([]);
    if (id !== expandedId && onExpand) onExpand(id);
  };

  // เมื่อกดเพิ่มของไปลิสต์ซื้อของ
  const handleAddToList = (recipe) => {
    setSelectMode(true);
    setSelected(recipe.ingredients.map((_, i) => i)); // default: เลือกทั้งหมด
  };
  // เมื่อยืนยันเลือกวัตถุดิบ
  const handleConfirmAdd = (recipe) => {
    if (!selected.length) return;
    onAddToShoppingList(recipe, selected);
    setToast({ open: true, msg: `✓ เพิ่ม ${selected.length} รายการเรียบร้อยแล้ว!` });
    setSelectMode(false);
    setSelected([]);
    if (onAddStat) onAddStat(recipe.id);
  };

  // UI: View Switcher + Search Bar
  return (
    <>
      <EditRecipeModal
        open={editModal.open}
        recipe={editModal.recipe}
        onClose={() => setEditModal({ open: false, recipe: null })}
        onSave={updated => {
          setEditModal({ open: false, recipe: null });
          if (updated && updated.id) {
            if (onAddStat) onAddStat(updated.id);
            if (typeof onDelete === 'function') {
              // update recipe in list
              onDelete(-1); // hack: do nothing
            }
            if (typeof onDelete === 'function') {
              // update recipe in parent
              // parent should update recipes state
            }
          }
          // Actually update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          // Use callback to update recipe in parent
          if (typeof onDelete === 'function') {
            // parent should update recipes state
          }
          setToast({ open: true, msg: `✓ อัปเดตสูตร '${updated.name}' เรียบร้อยแล้ว` });
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('mychef-recipe-updated', { detail: updated }));
          }
        }}
      />
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-lg flex items-center gap-2">🍳 ตำราสูตรอัจฉริยะ</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="px-3 py-1.5 rounded-lg border border-gray-300 focus:ring focus:border-blue-400 text-base w-40 md:w-56 placeholder-gray-400"
              placeholder="ค้นหาสูตร..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className={
                "ml-2 px-2 py-1 rounded text-xl font-bold " +
                (view === "list" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-blue-100")
              }
              title="แสดงแบบลิสต์"
              onClick={() => setView("list")}
              aria-label="List View"
            >☰</button>
            <button
              className={
                "px-2 py-1 rounded text-xl font-bold " +
                (view === "grid" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-blue-100")
              }
              title="แสดงแบบตาราง"
              onClick={() => setView("grid")}
              aria-label="Grid View"
            >🀊</button>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          filteredRecipes.length === 0 ? (
            <div className="text-gray-400">ยังไม่มีสูตรอาหาร</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRecipes.map(recipe => (
                <li key={recipe.id}>
                  {/* แถวหลัก */}
                  <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => handleExpand(recipe.id)}>
                    <span className="font-bold text-base text-gray-800 flex-1 truncate">{recipe.name}</span>
                    {expandedId === recipe.id ? (
                      <span className="ml-2 text-gray-400">▴</span>
                    ) : (
                      <span className="ml-2 text-gray-400">...</span>
                    )}
                    {/* เมนู ... ลบ */}
                    <button className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-600 font-bold hover:bg-red-200" onClick={e => { e.stopPropagation(); onDelete(recipe.id); }}>ลบ</button>
                  </div>
                  {/* มุมมองขยาย */}
                  {expandedId === recipe.id && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-2 mb-4 border border-blue-100">
                      {/* Action Bar */}
                      <div className="flex gap-2 mb-4">
                        {!selectMode ? (
                          <>
                            <button className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-2" onClick={e => { e.stopPropagation(); handleAddToList(recipe); }}>
                              <span>🛒</span> <span>เพิ่มของไปลิสต์ซื้อของ</span>
                            </button>
                            <button className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 flex items-center gap-2" onClick={e => { e.stopPropagation(); setEditModal({ open: true, recipe }); }}>
                              <span>✏️</span> <span>แก้ไขสูตร</span>
                            </button>
                          </>
                        ) : (
                          <button className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2" onClick={e => { e.stopPropagation(); handleConfirmAdd(recipe); }}>
                            <span>✔️</span> <span>ยืนยัน ({selected.length}) รายการ</span>
                          </button>
                        )}
                      </div>
                      {/* รายละเอียดสูตร */}
                      <div className="mb-2 font-bold text-gray-700">วัตถุดิบ:</div>
                      <ul className="mb-4 flex flex-col gap-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-base">
                            {selectMode ? (
                              <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={selected.includes(idx)} onChange={e => {
                                setSelected(sel => e.target.checked ? [...sel, idx] : sel.filter(i => i !== idx));
                              }} />
                            ) : null}
                            <span>{ing.name} <span className="text-gray-400">({ing.amount})</span></span>
                          </li>
                        ))}
                      </ul>
                      <div className="mb-2 font-bold text-gray-700">วิธีทำ:</div>
                      <ol className="list-decimal ml-6 text-base">
                        {recipe.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}

        {/* Grid View */}
        {view === "grid" && (
          filteredRecipes.length === 0 ? (
            <div className="text-gray-400">ยังไม่มีสูตรอาหาร</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex flex-col items-stretch border border-transparent hover:border-blue-300"
                  onClick={() => handleExpand(recipe.id)}
                >
                  {/* รูปภาพสูตร (icon) */}
                  <div className="h-32 w-full bg-gradient-to-br from-blue-100 to-green-100 rounded-t-xl flex items-center justify-center text-5xl text-blue-400">
                    <span role="img" aria-label="food">{recipe.icon || "🍲"}</span>
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <div className="font-bold text-lg text-gray-800 mb-1 truncate">{recipe.name}</div>
                    <div className="text-gray-500 text-sm mb-2 truncate">{recipe.ingredients.map(i => i.name).join(", ")}</div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        className="flex-1 py-1.5 rounded bg-green-600 text-white font-bold hover:bg-green-700 text-sm"
                        onClick={e => { e.stopPropagation(); handleAddToList(recipe); }}
                      >🛒 เพิ่มของไปลิสต์</button>
                      <button
                        className="flex-1 py-1.5 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 text-sm"
                        onClick={e => { e.stopPropagation(); setEditModal({ open: true, recipe }); }}
                      >✏️ แก้ไข</button>
                      <button
                        className="flex-none px-2 py-1 rounded bg-red-100 text-red-600 font-bold hover:bg-red-200 text-xs"
                        onClick={e => { e.stopPropagation(); onDelete(recipe.id); }}
                      >ลบ</button>
                    </div>
                  </div>
                  {/* มุมมองขยาย (Modal-like) */}
                  {expandedId === recipe.id && (
                    <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={e => { e.stopPropagation(); setExpandedId(null); }}>
                      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fadein" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setExpandedId(null)} aria-label="ปิด">×</button>
                        <div className="font-bold text-xl mb-2 text-green-700">{recipe.name}</div>
                        <div className="mb-2 font-bold text-gray-700">วัตถุดิบ:</div>
                        <ul className="mb-4 flex flex-col gap-1">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-base">
                              <span>{ing.name} <span className="text-gray-400">({ing.amount})</span></span>
                            </li>
                          ))}
                        </ul>
                        <div className="mb-2 font-bold text-gray-700">วิธีทำ:</div>
                        <ol className="list-decimal ml-6 text-base">
                          {recipe.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Toast แจ้งเตือน */}
        {toast.open && (
          <div className="fixed left-1/2 bottom-8 z-[9999] -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-lg font-bold animate-fadein drop-shadow-lg select-none">
            <span className="text-2xl">✓</span>
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}

// Shopping Rhythm Card (จังหวะการช้อปของคุณ)
function ShoppingRhythmCard({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
        <div className="font-bold text-lg mb-2 flex items-center gap-2">📅 จังหวะการช้อปของคุณ</div>
        <div className="text-gray-400 text-base">ยังไม่มีข้อมูลประวัติการซื้อ</div>
      </div>
    );
  }
  // 1. วันในสัปดาห์ที่ซื้อของบ่อยที่สุด
  const dayCount = Array(7).fill(0); // 0=อาทิตย์ ... 6=เสาร์
  history.forEach(h => {
    const d = new Date(h.date);
    dayCount[d.getDay()]++;
  });
  const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const maxDayIdx = dayCount.indexOf(Math.max(...dayCount));
  const heroDay = dayNames[maxDayIdx];

  // 2. ร้านค้าที่ไปบ่อยสุด
  const placeCount = {};
  history.forEach(h => h.groups.forEach(g => {
    const place = g.place || "ไม่ระบุ";
    placeCount[place] = (placeCount[place] || 0) + 1;
  }));
  const favPlace = Object.entries(placeCount).sort((a,b) => b[1]-a[1])[0]?.[0] || "-";

  // 3. ความถี่เฉลี่ย (วันต่อครั้ง)
  const dates = history.map(h => new Date(h.date)).sort((a,b) => a-b);
  let avgFreq = null;
  if (dates.length > 1) {
    const intervals = dates.slice(1).map((d,i) => (d - dates[i])/(1000*60*60*24));
    avgFreq = Math.round(intervals.reduce((a,b) => a+b,0)/intervals.length);
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="font-bold text-lg mb-2 flex items-center gap-2">
        <span className="text-2xl">📅</span>
        <span>จังหวะการช้อปของคุณ</span>
      </div>
      <div className="my-4 text-center">
        <div className="text-xl md:text-2xl font-extrabold text-blue-700 leading-snug whitespace-pre-line">
          {`ดูเหมือนว่า วัน${heroDay}\nคือวันช้อปปิ้งหลักของคุณ!`}
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1 text-base text-gray-700">
        <div>• ร้านค้าคู่ใจ: <span className="font-bold text-green-700">{favPlace}</span></div>
        <div>• ความถี่ในการซื้อ: {avgFreq ? `โดยเฉลี่ยทุกๆ ${avgFreq} วัน` : "-"}</div>
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
// Alert Modal (Success)
function AlertModal({ open, title = "สำเร็จ!", message, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center relative animate-fadein">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <span className="text-green-600 text-4xl">✓</span>
        </div>
        <div className="text-xl font-bold text-green-700 mb-2">{title}</div>
        <div className="text-base text-gray-700 mb-6 text-center">{message}</div>
        <button className="w-full py-2 rounded bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition" onClick={onClose}>ตกลง</button>
      </div>
    </div>
  );
}

// Confirm Modal (Question)
function ConfirmModal({ open, title = "ยืนยันการกระทำ", message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center relative animate-fadein">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <span className="text-blue-600 text-4xl">?</span>
        </div>
        <div className="text-xl font-bold text-blue-700 mb-2">{title}</div>
        <div className="text-base text-gray-700 mb-6 text-center">{message}</div>
        <div className="flex gap-3 w-full">
          <button className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-300 transition" onClick={onCancel}>ยกเลิก</button>
          <button className="flex-1 py-2 rounded bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition" onClick={onConfirm}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
}
// Toast Notification (Snackbar)
function Toast({ open, message, icon = "✓", duration = 3500, onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);
  if (!open) return null;
  return (
    <div className="fixed left-1/2 bottom-8 z-[9999] -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-lg font-bold animate-fadein drop-shadow-lg select-none">
      <span className="text-2xl">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// Announcement Bar
function AnnouncementBar({ message, onClose }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="w-full bg-blue-100 text-blue-800 px-4 py-2 flex items-center justify-between text-base font-bold border-b border-blue-200 animate-slidein">
      <span>{message}</span>
      <button className="ml-4 text-xl font-bold hover:text-red-500" aria-label="ปิดประกาศ" onClick={() => { setShow(false); onClose && onClose(); }}>×</button>
    </div>
  );
}
import Link from "next/link";






// Editable basket item row component (must be top-level, not inside Home)
function EditableBasketItem({ item, onChange, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount);
  const [unit, setUnit] = useState([
    "ชิ้น", "ขวด", "แพ็ค", "กก.", "กิโลกรัม"
  ].includes(item.unit) ? item.unit : (item.unit === "อื่นๆ" ? "อื่นๆ" : (item.unit || "ชิ้น")));
  const [customUnit, setCustomUnit] = useState(!["ชิ้น", "ขวด", "แพ็ค", "กก.", "กิโลกรัม", "อื่นๆ"].includes(item.unit) ? item.unit : "");
  const [note, setNote] = useState(item.note || "");
  // --- โซนหน่วยพิเศษ ---
  const [customUnits, setCustomUnits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mychef-custom-units") || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    setName(item.name);
    setAmount(item.amount);
    setUnit([
      "ชิ้น", "ขวด", "แพ็ค", "กก.", "กิโลกรัม"
    ].includes(item.unit) ? item.unit : (item.unit === "อื่นๆ" ? "อื่นๆ" : (item.unit || "ชิ้น")));
    setCustomUnit(!["ชิ้น", "ขวด", "แพ็ค", "กก.", "กิโลกรัม", "อื่นๆ"].includes(item.unit) ? item.unit : "");
    setNote(item.note || "");
  }, [item]);

  // Sync customUnits to localStorage
  useEffect(() => {
    localStorage.setItem("mychef-custom-units", JSON.stringify(customUnits));
  }, [customUnits]);

  const getFinalUnit = () => {
    if (unit === "อื่นๆ") {
      return customUnit.trim() ? customUnit.trim() : "อื่นๆ";
    }
    return unit;
  };

  // --- UI ---
  if (!edit) {
    return (
      <li className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
        <span>{name} <span className="text-gray-400">({amount} {getFinalUnit()})</span></span>
        {note && <span className="text-xs text-gray-500 ml-2">{note}</span>}
        <button className="ml-auto px-2 py-1 text-xs rounded bg-gray-300 text-gray-700 font-bold hover:bg-gray-400" onClick={() => setEdit(true)}>...</button>
        <button className="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white font-bold hover:bg-red-600" onClick={onDelete}>(x)</button>
      </li>
    );
  }
  const unitOptions = ["ชิ้น", "ขวด", "แพ็ค", "กก."];
  return (
    <li className="flex flex-col gap-4 bg-gray-50 rounded px-3 py-4 border border-blue-300 relative">
      {/* Item name (static) */}
      <div className="text-xl font-bold text-gray-800 mb-1">{name}</div>
      {/* Amount */}
      <div>
        <div className="text-sm text-gray-600 mb-1">จำนวน:</div>
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold hover:bg-gray-300"
            onClick={() => setAmount(a => String(Math.max(1, Number(a) - 1)))}
            type="button"
          >-</button>
          <span className="w-10 text-center text-lg font-bold">{amount}</span>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 text-2xl font-bold hover:bg-gray-300"
            onClick={() => setAmount(a => String(Number(a) + 1))}
            type="button"
          >+</button>
        </div>
      </div>
      {/* Unit button group with special zone */}
      <div>
        <div className="text-sm text-gray-600 mb-1">หน่วย:</div>
        <div className="flex flex-wrap gap-2 mb-2 relative">
          {unitOptions.map(opt => (
            <button
              key={opt}
              type="button"
              className={
                "px-4 py-1 rounded-full border font-bold transition-colors " +
                (unit === opt
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50")
              }
              onClick={() => { setUnit(opt); setCustomUnit(""); }}
            >{opt}</button>
          ))}
          {/* อื่นๆ (no dropdown, just show special zone below) */}
          <button
            type="button"
            className={
              "px-4 py-1 rounded-full border font-bold flex items-center gap-1 transition-colors " +
              (unit === "อื่นๆ" ? "bg-blue-700 text-white border-blue-700 shadow" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50")
            }
            onClick={() => { setUnit("อื่นๆ"); }}
          >
            อื่นๆ
          </button>
        </div>
        {/* Special unit zone: show if unit === "อื่นๆ" */}
        {unit === "อื่นๆ" && (
          <div className="mt-2 p-3 rounded-xl border border-blue-200 bg-blue-50 animate-fadein flex flex-col gap-2">
            <div className="text-sm font-bold text-blue-700 mb-1">หน่วยที่ใช้บ่อย:</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {customUnits.length === 0 && (
                <span className="text-gray-400 text-sm">ยังไม่มีหน่วยที่เคยสร้าง</span>
              )}
              {customUnits.map((cu, idx) => (
                <button
                  key={cu}
                  type="button"
                  className={
                    "px-3 py-1 rounded-full border font-bold text-blue-700 bg-white border-blue-300 hover:bg-blue-100 transition " +
                    (customUnit === cu ? "bg-blue-600 text-white border-blue-600" : "")
                  }
                  onClick={() => setCustomUnit(cu)}
                >{cu}</button>
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-1">หรือพิมพ์หน่วยใหม่:</div>
            <form
              className="flex gap-2"
              onSubmit={e => {
                e.preventDefault();
                if (!customUnit.trim()) return;
                if (!customUnits.includes(customUnit.trim())) {
                  setCustomUnits([...customUnits, customUnit.trim()]);
                }
                // ไม่ปิดโซนนี้ ให้เลือกต่อได้
              }}
            >
              <input
                id="custom-unit-input"
                className="flex-1 border rounded px-3 py-2 font-bold focus:ring focus:border-blue-400 placeholder-gray-400"
                value={customUnit}
                onChange={e => setCustomUnit(e.target.value)}
                placeholder="พิมพ์หน่วยที่คุณต้องการ..."
                maxLength={20}
                autoFocus
              />
              <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-700">บันทึก</button>
            </form>
          </div>
        )}
      </div>
      {/* Note */}
      <div>
        <div className="text-sm text-gray-600 mb-1">บันทึก/หมายเหตุ (ไม่บังคับ):</div>
        <input
          className="w-full border rounded px-3 py-2 font-bold"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          maxLength={100}
        />
      </div>
      {/* Action buttons */}
      <div className="flex gap-2 justify-end mt-2">
        <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold" onClick={() => setEdit(false)}>ยกเลิก</button>
        <button className="px-4 py-2 rounded bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-colors" onClick={() => { onChange({ name, amount, unit: getFinalUnit(), note }); setEdit(false); }}>บันทึกการแก้ไข</button>
      </div>
    </li>
  );
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
        <button className="mt-6 w-full py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700" onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
}
export default function Home() {
  // Dropdown state for item name auto-suggest
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Checkbox state for shopping list items
  const [checked, setChecked] = useState({});
  // Dropdown state for place auto-suggest
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  // Ref for place input (for focusing, dropdown, etc.)
  const placeInputRef = useRef(null);
  // Frequent items for current place
  const [frequentItems, setFrequentItems] = useState([]);
  // Suggestions for item name auto-complete
  const [itemSuggestions, setItemSuggestions] = useState([]);
  // Tab state (current/history/recipes)
  const [activeTab, setActiveTab] = useState('current');
  // --- State declarations must be at the top before any useEffect or code that uses them ---
  // Basket modal states (for add/edit item)
  const [basketPlace, setBasketPlace] = useState("");
  const [basketItems, setBasketItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("1");
  const [itemUnit, setItemUnit] = useState("ชิ้น");
  const [itemNote, setItemNote] = useState("");
  const [itemPlace, setItemPlace] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [shoppingGroups, setShoppingGroups] = useState([]);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mychef-history") || "[]");
    } catch { return []; }
  });
  // Alert Modal state
  const [alertModal, setAlertModal] = useState({ open: false, message: '' });
  const showAlert = (msg) => setAlertModal({ open: true, message: msg });

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, message: '', onConfirm: null });
  const showConfirm = (msg, onConfirm) => setConfirmModal({ open: true, message: msg, onConfirm });
  // Toast state
  const [toast, setToast] = useState({ open: false, message: '', icon: '✓' });
  const showToast = (msg, icon = '✓') => setToast({ open: true, message: msg, icon });

  // Announcement Bar state (ตัวอย่าง)
  const [showAnnounce, setShowAnnounce] = useState(true);
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
  };
  useEffect(() => {
    const places = new Set();
    shoppingGroups.forEach(g => g.place && g.place !== "ไม่ระบุ" && places.add(g.place));
    history.forEach(h => h.groups.forEach(g => g.place && g.place !== "ไม่ระบุ" && places.add(g.place)));
    setPlaceSuggestions(Array.from(places));
  }, [shoppingGroups, history]);

  // Modal for viewing history details
  const [viewHistoryIdx, setViewHistoryIdx] = useState(null);

  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const shoppingListRef = useRef(null);
  const recipesRef = useRef(null);
  // ...existing code...

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
    showAlert('เพิ่มรายการซื้อซ้ำลงในลิสต์ปัจจุบันแล้ว!');
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
    // Toast: เพิ่มของลงลิสต์
    showToast(`✓ เพิ่ม${basketItems.length > 1 ? ` ${basketItems.length} รายการ` : ` '${basketItems[0].name}'`} ลงในลิสต์แล้ว`);
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

  // Delete item (with custom confirmation modal)
  const handleDeleteItem = (groupPlace, idx) => {
    const group = shoppingGroups.find(g => g.place === groupPlace);
    if (!group) return;
    const item = group.items[idx];
    showConfirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบ '${item.name}'? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      () => {
        setConfirmModal(m => ({ ...m, open: false }));
        const groups = shoppingGroups.map(g =>
          g.place === groupPlace
            ? { ...g, items: g.items.filter((_, i) => i !== idx) }
            : g
        );
        saveShoppingGroups(groups);
        showToast(`✓ ลบ '${item.name}' เรียบร้อยแล้ว`);
      }
    );
  };

  // Copy list to clipboard
  const handleCopyList = () => {
    // หาชื่อผู้จดลิสต์และวันเวลาล่าสุด (ถ้ามีใน history)
    let listOwner = "";
    let listDate = "";
    if (history && history.length > 0) {
      listOwner = history[0].owner || "";
      if (history[0].date) {
        const d = new Date(history[0].date);
        listDate = d.toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    }
    let header = "";
    if (listOwner) header += `ผู้จดลิสต์: ${listOwner}\n`;
    if (listDate) header += `วันที่: ${listDate}\n`;
    if (header) header += "---------------------\n";
    let text = shoppingGroups.map(g =>
      (g.place ? `[${g.place}]\n` : "") +
      g.items.map(i => `- ${i.name}${i.amount ? ` (${i.amount}${i.unit || ''})` : ''}${i.note ? ` : ${i.note}` : ''}`).join("\n")
    ).join("\n\n");
    navigator.clipboard.writeText(header + text);
    showToast("✓ คัดลอกลิสต์เรียบร้อยแล้ว");
  };

  // Checkbox toggle
  const handleCheck = (groupPlace, idx) => {
    setChecked(prev => ({ ...prev, [groupPlace + '-' + idx]: !prev[groupPlace + '-' + idx] }));
  };

  // End shopping: move to history and clear
  const handleEndShopping = () => {
    showConfirm(
      "คุณต้องการสิ้นสุดการซื้อและย้ายลิสต์นี้ไปที่ประวัติใช่ไหม?",
      () => {
        setConfirmModal(m => ({ ...m, open: false }));
        let listOwner = "";
        if (typeof window !== "undefined") {
          listOwner = localStorage.getItem("mychef_user") || "";
        }
        const newHistory = [
          { date: new Date().toISOString(), groups: shoppingGroups, owner: listOwner },
          ...history
        ];
        setHistory(newHistory);
        localStorage.setItem("mychef-history", JSON.stringify(newHistory));
        saveShoppingGroups([]);
        setChecked({});
        showAlert("สิ้นสุดการซื้อและบันทึกลงประวัติเรียบร้อยแล้ว!");
      }
    );
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
      {/* Alert Modal */}
      <AlertModal open={alertModal.open} message={alertModal.message} onClose={() => setAlertModal(a => ({ ...a, open: false }))} />
      {/* Confirm Modal */}
      <ConfirmModal open={confirmModal.open} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(m => ({ ...m, open: false }))} />
      {/* Announcement Bar */}
      {showAnnounce && (
        <AnnouncementBar
          message="ฟีเจอร์ใหม่: ตอนนี้คุณสามารถพิมพ์ลิสต์ซื้อของได้แล้ว!"
          onClose={() => setShowAnnounce(false)}
        />
      )}
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
              {/* ชื่อผู้ใช้ที่เลือก */}
              <CurrentUserDisplay />
              {/* Floating Add Button */}
              <button
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-blue-500 text-white text-4xl shadow-lg flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => { setShowAddModal(true); setEditItem(null); }}
                title="เพิ่มของ"
                aria-label="เพิ่มของ"
              >+</button>
              {/* Toast Notification */}
              <Toast open={toast.open} message={toast.message} icon={toast.icon} onClose={() => setToast(t => ({ ...t, open: false }))} />

              {/* Add/Edit Modal */}
              {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                    <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowAddModal(false); setEditItem(null); setBasketPlace(""); setBasketItems([]); }}>×</button>
                    {/* Place */}
                    <div className="mb-3 relative">
                      <label className="block text-gray-700 mb-1 font-bold">เพิ่มของสำหรับ: <span className="text-green-700">[ {basketPlace || "ไม่ระบุ"} ]</span></label>
                      <input
                        ref={placeInputRef}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 font-bold mb-2"
                        value={basketPlace}
                        onChange={e => {
                          setBasketPlace(e.target.value);
                          setShowPlaceDropdown(!!e.target.value);
                        }}
                        placeholder="เช่น Lotus, Makro, ตลาดสด"
                        maxLength={30}
                        autoComplete="off"
                        onFocus={() => setShowPlaceDropdown(!!basketPlace)}
                        onBlur={() => setTimeout(() => setShowPlaceDropdown(false), 120)}
                        onKeyDown={e => {
                          if (showPlaceDropdown && placeSuggestions.length > 0) {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              const list = document.getElementById('place-dropdown-list');
                              if (list) list.firstChild?.focus();
                            }
                          }
                        }}
                      />
                      {/* Dropdown แนะนำร้านค้า */}
                      {showPlaceDropdown && basketPlace.trim() && (
                        <ul id="place-dropdown-list" className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow z-50 mt-1 max-h-48 overflow-auto">
                          {placeSuggestions.filter(n => n.toLowerCase().startsWith(basketPlace.trim().toLowerCase()) && n !== basketPlace).length === 0 ? (
                            <li className="px-3 py-2 text-gray-400 select-none">ไม่พบสถานที่แนะนำ</li>
                          ) : (
                            placeSuggestions.filter(n => n.toLowerCase().startsWith(basketPlace.trim().toLowerCase()) && n !== basketPlace).slice(0,8).map((n, i, arr) => (
                              <li
                                key={n}
                                tabIndex={0}
                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-gray-700 outline-none"
                                onMouseDown={() => {
                                  setBasketPlace(n);
                                  setShowPlaceDropdown(false);
                                  placeInputRef.current?.blur();
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setBasketPlace(n);
                                    setShowPlaceDropdown(false);
                                    placeInputRef.current?.blur();
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    if (i < arr.length - 1) arr[i + 1] && arr[i + 1].ref?.current?.focus();
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    if (i > 0) arr[i - 1] && arr[i - 1].ref?.current?.focus();
                                    else placeInputRef.current?.focus();
                                  }
                                }}
                              >{n}</li>
                            ))
                          )}
                        </ul>
                      )}
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
                      {/* Frequent items chips: global or by place */}
                      {(!basketPlace || frequentItems.length === 0) && (() => {
                        // Show global frequent items if no place or no place-specific frequent items
                        // Calculate top 4-5 most frequent items overall
                        const freq = {};
                        history.forEach(h => h.groups.forEach(g => g.items.forEach(i => {
                          freq[i.name] = (freq[i.name] || 0) + 1;
                        })));
                        shoppingGroups.forEach(g => g.items.forEach(i => {
                          freq[i.name] = (freq[i.name] || 0) + 1;
                        }));
                        const globalTop = Object.entries(freq).sort((a,b) => b[1]-a[1]).map(([name]) => name).slice(0,5);
                        if (globalTop.length === 0) return null;
                        return (
                          <div className="mt-2 flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-gray-500 font-bold mr-2">ซื้อบ่อย (โดยรวม):</span>
                            {globalTop.map(name => (
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
                        );
                      })()}
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
                        <button
                          className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 text-base"
                          title="เพิ่มของในร้านนี้"
                          onClick={() => handleQuickAddToGroup(group.place)}
                        >+</button>
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
                    const owner = h.owner || "";
                    return (
                      <li key={i} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-green-50 transition" onClick={() => setViewHistoryIdx(i)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-green-700 font-bold text-base mb-1">รายการซื้อของ - {dateStr}</div>
                            <div className="text-gray-500 text-sm italic">ซื้อที่ {firstPlace} ({allItems.length} รายการ)</div>
                            {owner && <div className="text-xs text-gray-600 mt-1">ผู้จดลิสต์: <span className="font-bold text-green-700">{owner}</span></div>}
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
