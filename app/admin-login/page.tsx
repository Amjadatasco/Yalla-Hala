"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const getEmailInputClass = () => {
    const base = "h-14 rounded-2xl border px-5 text-right outline-none transition duration-200 ";
    if (triedSubmit && !email.trim()) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  const getPasswordInputClass = () => {
    const base = "h-14 rounded-2xl border px-5 text-right outline-none transition duration-200 ";
    if (triedSubmit && !password.trim()) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  async function handleLogin() {
    setTriedSubmit(true);

    if (!email.trim() || !password.trim()) {
      alert("⚠️ يرجى تعبئة كافة الحقول المطلوبة.");
      setTimeout(() => {
        const firstInvalid = document.querySelector(".border-red-500");
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          (firstInvalid as HTMLElement).focus?.();
        }
      }, 100);
      return;
    }

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
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4" dir="rtl">

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
            className={getEmailInputClass()}
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className={getPasswordInputClass()}
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
