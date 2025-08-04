# My Chef

## ระบบเว็บ "My Chef" (Shopping List & CloudPRNT)

### ฟีเจอร์หลัก
- จัดการลิสต์ซื้อของ (CRUD) พร้อมหมวดหมู่ร้าน
- เพิ่มของหลายรายการแบบรวดเร็ว (Multi-add)
- แนะนำของที่ซื้อบ่อย, Auto-complete, Chips
- ประวัติการซื้อย้อนหลัง, ซื้อซ้ำได้ทันที
- วิเคราะห์พฤติกรรมการซื้อ (Dashboard)
- พิมพ์ลิสต์ซื้อของ (Print Preview, Print)
- ตั้งค่าเครื่องพิมพ์ (CloudPRNT) พร้อมฟีเจอร์ขั้นสูง:
  - แสดงเครื่องพิมพ์ที่เชื่อมต่อ, ตั้งชื่อเล่น, ลบเครื่องพิมพ์
  - ทดสอบการพิมพ์
  - พิมพ์ด่วน (ข้ามหน้าพรีวิว)
  - กำหนดจำนวนสำเนาต่อลิสต์

### เทคโนโลยี
- Next.js 14 (React)
- Tailwind CSS
- LocalStorage (ฝั่ง client)

---

## วิธี Deploy/ทดสอบระบบ (แนะนำ)

### 1. เตรียม GitHub Repository
1. สร้าง repo ใหม่บน GitHub
2. ในโฟลเดอร์โปรเจกต์ รัน:
   ```sh
   git init
   git remote add origin <your-repo-url>
   git add .
   git commit -m "Initial deploy"
   git push -u origin main
   ```

### 2. Deploy อัตโนมัติ (Vercel/Netlify)
- **Vercel:**
  1. สมัคร/ล็อกอินที่ https://vercel.com/import/git
  2. เชื่อมต่อ repo เลือก framework: Next.js
  3. กด Deploy ได้เลย (รองรับฟีเจอร์ Next.js เต็มรูปแบบ)
- **Netlify:**
  1. สมัคร/ล็อกอินที่ https://app.netlify.com/start
  2. เชื่อมต่อ repo เลือก Next.js
  3. Deploy ได้ทันที

### 3. (ไม่แนะนำ) GitHub Pages
- Next.js ไม่เหมาะกับ static export ทุกฟีเจอร์ (modal, localStorage, dynamic route)
- แนะนำใช้ Vercel/Netlify จะง่ายและสมบูรณ์กว่า

---

## Development

### รันบนเครื่อง
```sh
npm install
npm run dev
```
แล้วเปิด http://localhost:3000

---

## License
MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
