"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!fullName || !phone || !email || !password) {
      alert("يرجى تعبئة جميع الحقول.");
      return;
    }

    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (!/^09\d{8}$/.test(phone)) {
      alert("رقم الهاتف غير صالح.");
      return;
    }

    try {
      setLoading(true);

      // إنشاء الحساب
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("لم يتم إنشاء المستخدم.");
      }

      // إنشاء profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            phone: phone,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        throw profileError;
      }

      alert("تم إنشاء الحساب بنجاح.");

      router.push("/login");

    } catch (error: any) {
      console.error(error);

      alert(
        error?.message || "حدث خطأ غير متوقع أثناء التسجيل."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#111827]">
            إنشاء حساب زبون
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            انضم إلينا واحجز مكانك السياحي المثالي
          </p>
        </div>

        <form onSubmit={handleRegister} className="grid gap-5">

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              الاسم الكامل
            </label>

            <input
              type="text"
              placeholder="الاسم الثلاثي"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-right outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              رقم الهاتف
            </label>

            <input
              type="tel"
              placeholder="09xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-right outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 mt-2 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D] transition shadow-md disabled:opacity-50"
          >
            {loading
              ? "جاري إنشاء الحساب..."
              : "تأكيد التسجيل"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}

          <Link
            href="/login"
            className="text-[#3FAF9B] font-bold hover:underline"
          >
            تسجيل الدخول هنا
          </Link>
        </div>

      </div>
    </main>
  );
}