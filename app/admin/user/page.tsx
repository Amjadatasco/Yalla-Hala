"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <main className="p-10 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl font-black mb-6">قائمة المشتركين</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <table className="w-full text-right">
          <thead><tr className="border-b"><th className="p-4">الاسم</th><th className="p-4">الهاتف</th><th className="p-4">التاريخ</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b"><td className="p-4">{u.full_name}</td><td className="p-4">{u.phone}</td><td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}