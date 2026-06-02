"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert("بيانات الدخول غير صحيحة");
    } else {
      router.push("/dashboard");
    }
  }

  function handleForgotPassword() {
    alert(
      "يرجى التواصل مع إدارة الموقع لإعادة تعيين كلمة المرور."
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        <div className="text-center">

          <h1 className="text-4xl font-extrabold text-[#111827]">

            Admin Login

          </h1>

          <p className="mt-3 text-[#6B7280]">

            تسجيل دخول الإدارة

          </p>

        </div>

        <div className="mt-8 grid gap-5">

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="h-14 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D]"
          >

            {loading
              ? "جاري الدخول..."
              : "تسجيل الدخول"}

          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-[#3FAF9B] font-semibold hover:underline"
          >
            نسيت كلمة المرور؟
          </button>

        </div>

      </div>

    </main>
  );
}
