import fs from 'fs';
import path from 'path';

const keysToAdd = {
  tabs: {
    personal: "Personal Info",
    security: "Security & Access",
    activity: "Activity Log"
  },
  personalInfo: {
    title: "Personal Information",
    edit: "Edit",
    name: "Full Name",
    role: "Role",
    phone: "Phone Number",
    address: "Address",
    dob: "Date of Birth"
  },
  security: {
    title: "Security Settings",
    changePassword: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password"
  },
  sessions: {
    title: "Active Sessions",
    description: "Devices and browsers currently logged into this account.",
    disconnect: "Disconnect",
    disconnectAll: "Disconnect All Other Sessions"
  },
  activity: {
    title: "Recent Activity Log",
    description: "Your 10 most recent actions in the system.",
    empty: "No recent activity."
  }
};

const keysToAddUz = {
  tabs: {
    personal: "Shaxsiy ma'lumotlar",
    security: "Xavfsizlik va kirish",
    activity: "Harakatlar tarixi"
  },
  personalInfo: {
    title: "Shaxsiy malumotlar",
    edit: "Tahrirlash",
    name: "To'liq ism",
    role: "Lavozim",
    phone: "Telefon raqami",
    address: "Manzil",
    dob: "Tug'ilgan sana"
  },
  security: {
    title: "Xavfsizlik sozlamalari",
    changePassword: "Parolni o'zgartirish",
    oldPassword: "Eski parol",
    newPassword: "Yangi parol",
    confirmPassword: "Parolni tasdiqlang",
    updatePassword: "Parolni yangilash"
  },
  sessions: {
    title: "Faol sessiyalar",
    description: "Ushbu hisobga hozirda kirgan qurilmalar va brauzerlar.",
    disconnect: "Uzib qo'yish",
    disconnectAll: "Boshqa barcha sessiyalarni uzib qo'yish"
  },
  activity: {
    title: "So'nggi harakatlar",
    description: "Tizimdagi so'nggi 10 ta harakatingiz.",
    empty: "So'nggi harakatlar yo'q."
  }
};

const dirs = [
  { p: 'apps/web/src/messages/en.json', k: keysToAdd },
  { p: 'apps/web/src/messages/uz.json', k: keysToAddUz },
  { p: 'apps/web/src/messages/tr.json', k: keysToAdd },
  { p: 'apps/web/src/messages/ar.json', k: keysToAdd },
];

dirs.forEach(({ p, k }) => {
  const fullPath = path.join(process.cwd(), p);
  console.log(`Updating ${fullPath}`);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.schoolAdminProfile) {
      data.schoolAdminProfile = {};
    }
    Object.assign(data.schoolAdminProfile, k);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n", 'utf8');
    console.log(`Successfully updated ${p}`);
  } catch (err) {
    console.error(`Failed to update ${p}: ${err.message}`);
  }
});
