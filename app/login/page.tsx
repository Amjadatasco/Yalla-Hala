"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    // تحقق الهاتف
    if (
      !/^09\d{8}$/.test(
        phone
      )
    ) {

      alert(
        "رقم الهاتف غير صالح"
      );

      return;
    }

    // تحقق كلمة المرور
    if (
      !password.trim()
    ) {

      alert(
        "يرجى إدخال كلمة المرور"
      );

      return;
    }

    setLoading(true);

    // إنشاء إيميل مخفي
    const generatedEmail =
      `${phone}@yallahala.local`;

    const { error } =
      await supabase.auth.signInWithPassword({

        email:
          generatedEmail,

        password:
          password,
      });

    setLoading(false);

    if (error) {

      alert(
        "خطأ في تسجيل الدخول"
      );

    } else {

      router.push("/");

      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-extrabold text-[#111827]">

            تسجيل الدخول

          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">

            أهلاً بك مجدداً في يلا هلا

          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="grid gap-5"
        >

          <div>

            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">

              رقم الهاتف

            </label>

            <input
              type="tel"
              placeholder="09xxxxxxxx"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />

          </div>

          <div>

            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">

              كلمة المرور

            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 mt-2 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D] transition shadow-md"
          >

            {loading
              ? "جاري التحقق..."
              : "دخول"}

          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">

          ليس لديك حساب؟{" "}

          <Link
            href="/register"
            className="text-[#3FAF9B] font-bold hover:underline"
          >

            أنشئ حساباً الآن

          </Link>

        </div>

      </div>

    </main>
  );
}