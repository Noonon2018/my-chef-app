module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        highcontrast: {
          bg: '#000000', // พื้นหลังดำ
          fg: '#ffff00', // ตัวอักษรเหลือง
          button: '#ffff00', // ปุ่มเหลือง
          buttonText: '#000000', // ตัวอักษรปุ่มดำ
          border: '#ffff00', // ขอบปุ่มเหลือง
          link: '#ffff00', // ลิงก์เหลือง
        },
        colorblind: {
          bg: '#ffffff', // พื้นหลังขาว
          fg: '#222222', // ตัวอักษรดำ
          button: '#0072b2', // ปุ่มน้ำเงินเข้ม
          buttonText: '#ffffff', // ตัวอักษรปุ่มขาว
          border: '#222222', // ขอบปุ่มดำ
          link: '#0072b2', // ลิงก์น้ำเงินเข้ม
        },
      },
    },
  },
  plugins: [],
};
