import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-green-600 text-white shadow">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/">
            <span>My Chef</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/family-settings" className="hover:underline font-semibold">
            ครอบครัวของฉัน
          </Link>
          {/* เพิ่มเมนูอื่น ๆ ได้ที่นี่ */}
        </nav>
      </div>
    </header>
  );
}
