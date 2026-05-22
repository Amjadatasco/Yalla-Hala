"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("⚠️ يجب أن تكون كلمة المرور الجديدة مكونة من 6 خانات أو أكثر.");
      return;
    }

    setLoading(true);

    // تحديث كلمة المرور للمستخدم في Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      alert("❌ حدث خطأ أثناء تحديث كلمة المرور: " + error.message);
    } else {
      alert("🎉 تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بحسابك الجديد.");
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#111827]">تعيين كلمة مرور جديدة</h1>
          <p className="mt-2 text-sm text-[#6B7280]">أدخل كلمة المرور الجديدة لحسابك لتأكيد التحديث</p>
        </div>

        <form onSubmit={handleResetPassword} className="grid gap-5">
          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
            <input
              type="password"
              placeholder="اكتب كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-right outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-2 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D] transition shadow-md"
          >
            {loading ? "جاري التحديث والحفظ..." : "تأكيد وحفظ كلمة المرور"}
          </button>
        </form>
      </div>
    </main>
  );
}