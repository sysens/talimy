import fs from 'fs';
import path from 'path';

const keysToAdd = {
  title: "Admin Settings",
  description: "Manage school preferences, academic structure, and basic configuration.",
  tabs: {
    schoolInfo: "School Information",
    classes: "Classes",
    subjects: "Subjects",
    modules: "Modules",
    roles: "Roles",
    fees: "Fee Structures",
    notifications: "Notifications"
  },
  schoolInfo: {
    title: "School Information",
    description: "Update the core details and policies of your school.",
    schoolName: "School Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Address",
    save: "Save Changes"
  },
  classes: {
    title: "Classes Management",
    description: "Manage all classes, sections, and assignments.",
    add: "Add Class",
    table: {
      name: "Class Name",
      grade: "Grade",
      section: "Section",
      students: "Students",
      actions: "Actions"
    }
  },
  subjects: {
    title: "Subjects Catalog",
    description: "Global list of subjects taught in your school.",
    add: "Add Subject",
    table: {
      name: "Subject Name",
      code: "Code",
      status: "Status",
      actions: "Actions"
    }
  },
  modules: {
    title: "Platform Modules",
    description: "Enable or disable different platform features.",
    dormitory: "Dormitory Management",
    meals: "Meal Plans",
    transport: "Transport",
    finance: "Advanced Finance",
    library: "Library System"
  },
  fees: {
    title: "Fee Structures",
    description: "Define different payment categories and standard sums.",
    add: "Add Category"
  },
  notifications: {
    title: "Notification Settings",
    description: "Configure how system notifications are delivered.",
    email: "Email Notifications",
    sms: "SMS Notifications",
    push: "Push Notifications",
    save: "Save Preferences"
  }
};

const keysToAddUz = {
  title: "Admin Sozlamalari",
  description: "Maktab sozlamalari, o'quv tuzilmasi va asosiy konfiguratsiyalarni boshqarish.",
  tabs: {
    schoolInfo: "Maktab ma'lumotlari",
    classes: "Sinflar",
    subjects: "Fanlar",
    modules: "Modullar",
    roles: "Rollar",
    fees: "To'lov Kategoriyalari",
    notifications: "Bildirishnomalar"
  },
  schoolInfo: {
    title: "Maktab ma'lumotlari",
    description: "Maktabning asosiy ma'lumotlari va siyosatini yangilash.",
    schoolName: "Maktab nomi",
    email: "Email manzil",
    phone: "Telefon raqami",
    address: "Manzil",
    save: "Saqlash"
  },
  classes: {
    title: "Sinflarni boshqarish",
    description: "Barcha sinflar va bo'limlarni boshqarish.",
    add: "Sinf qo'shish",
    table: {
      name: "Sinf nomi",
      grade: "Daraja",
      section: "Bo'lim",
      students: "O'quvchilar soni",
      actions: "Harakatlar"
    }
  },
  subjects: {
    title: "Fanlar katalogi",
    description: "Maktabingizda o'qitiladigan fanlar ro'yxati.",
    add: "Fan qo'shish",
    table: {
      name: "Fan nomi",
      code: "Kod",
      status: "Holati",
      actions: "Harakatlar"
    }
  },
  modules: {
    title: "Platforma modullari",
    description: "Platformaning turli imkoniyatlarini yoqish yoki o'chirish.",
    dormitory: "Yotoqxona tizimi",
    meals: "Oshxona tizimi",
    transport: "Transport tizimi",
    finance: "Kengaytirilgan Moliya",
    library: "Kutubxona tizimi"
  },
  fees: {
    title: "To'lov tuzilmalari",
    description: "Turli to'lov toifalari va standart summalarni belgilash.",
    add: "Toifa qo'shish"
  },
  notifications: {
    title: "Bildirishnomalar",
    description: "Tizim xabarlarini yetkazib berish usullarini sozlash.",
    email: "Email xabarlar",
    sms: "SMS xabarlar",
    push: "Push xabarlar",
    save: "Saqlash"
  }
};

['en','tr','ar'].forEach(lang => {
  const file = path.join(process.cwd(), `apps/web/src/messages/${lang}.json`);
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.adminSettings = keysToAdd;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
});

const fileUz = path.join(process.cwd(), `apps/web/src/messages/uz.json`);
let dataUz = JSON.parse(fs.readFileSync(fileUz, 'utf8'));
dataUz.adminSettings = keysToAddUz;
fs.writeFileSync(fileUz, JSON.stringify(dataUz, null, 2) + '\n');

console.log("Translations added successfully");
