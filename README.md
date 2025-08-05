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
## ฟีเจอร์หลัก

- จัดการลิสต์ซื้อของ (เพิ่ม/ลบ/แก้ไข/ติ๊กเสร็จ)
- เพิ่มของแบบหลายรายการในครั้งเดียว (modal)
- ปุ่ม [+] ข้างชื่อร้าน (Quick Add) เพิ่มของเข้าแต่ละร้านได้ทันที
- แนะนำของที่ซื้อบ่อย (chips) ทั้งแบบรวม (ซื้อบ่อยโดยรวม) และแยกร้าน (ซื้อบ่อยที่ [ร้าน])
- ค้นหา/auto-complete ชื่อของจากประวัติ
- วิเคราะห์พฤติกรรมการซื้อ (dashboard)
- ประวัติการซื้อย้อนหลังและซื้อซ้ำ
- พิมพ์ลิสต์ (Print Preview + ปุ่มพิมพ์)
- ตั้งค่าเครื่องพิมพ์ (CloudPRNT/Star) พร้อมทดสอบและตั้งค่าขั้นสูง

## การใช้งาน

1. กดปุ่ม **+** ที่มุมขวาล่างเพื่อเพิ่มลิสต์ใหม่ หรือปุ่ม **+** ข้างชื่อร้านเพื่อเพิ่มของในร้านนั้นโดยตรง
2. ใน modal เพิ่มของ สามารถเลือกชื่อร้าน, เพิ่มของหลายรายการ, ใช้ chips "ซื้อบ่อย (โดยรวม)" หรือ "ซื้อบ่อยที่ [ร้าน]" เพื่อเพิ่มเร็ว
3. ในแต่ละร้าน สามารถแก้ไข/ลบของแต่ละชิ้นได้ทันที
4. เมื่อกด "แก้ไข" จะมีหน้าต่างใหม่: ชื่อของแสดงผล, เลือกหน่วยด้วยปุ่ม, ปุ่มบันทึกการแก้ไข
5. กดปุ่ม "สิ้นสุดการซื้อ" เพื่อบันทึกลงประวัติ
6. ดูประวัติ/วิเคราะห์ หรือพิมพ์ลิสต์ได้จากเมนูด้านบน
7. ตั้งค่าเครื่องพิมพ์และทดสอบได้จากปุ่ม "ตั้งค่าเครื่องพิมพ์"

## อัปเดตล่าสุด

- เพิ่มปุ่ม [+] ข้างชื่อร้าน (Quick Add)
- แนะนำของที่ซื้อบ่อย (โดยรวม/แยกร้าน) ใน modal เพิ่มของ
- ปรับดีไซน์หน้าต่างแก้ไขของในตะกร้า: ชื่อแสดงผล, เลือกหน่วยด้วยปุ่ม, ปุ่มบันทึกการแก้ไข

## การ deploy

### รันบนเครื่อง

```sh
npm install
npm run dev
```

### Deploy ขึ้น Vercel/Netlify

- กด Import Project จาก GitHub หรืออัปโหลดไฟล์ทั้งหมด
- ตั้งค่า build command: `npm run build` และ output: `.next`
- ตั้งค่า environment (ถ้ามี)

### Deploy ขึ้น GitHub Pages

- ใช้ static export (`next export`) และอัปโหลดโฟลเดอร์ `out/` ไปยัง GitHub Pages

## เครดิต

สร้างโดยทีม My Chef, 2025

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
