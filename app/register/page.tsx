"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {

  const router = useRouter();

  // البيانات
  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // تحميل
  const [loading, setLoading] =
    useState(false);

  // التسجيل
  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault();

    // تحقق
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim()
    ) {

      alert(
        "يرجى تعبئة جميع الحقول."
      );

      return;
    }

    // تحقق الهاتف
    if (
      !/^09\d{8}$/.test(
        phone
      )
    ) {

      alert(
        "رقم الهاتف غير صالح."
      );

      return;
    }

    // تحقق كلمة المرور
    if (
      password.length < 6
    ) {

      alert(
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
      );

      return;
    }

    try {

      setLoading(true);

      // إنشاء الحساب
      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email,
          password,
        });

      // خطأ
      if (error) {

        throw error;

      }

      // المستخدم غير موجود
      if (!data.user) {

        throw new Error(
          "فشل إنشاء المستخدم."
        );

      }

      // إنشاء profile
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .insert([
          {
            id:
              data.user.id,

            full_name:
              fullName,

            email:
              email,

            phone:
              phone,

            role:
              "user",
          },
        ]);

      // خطأ profiles
      if (profileError) {

        console.error(
          "PROFILE ERROR:",
          profileError
        );

        alert(
          profileError.message
        );

        return;
      }

      // نجاح
      alert(
        "تم إنشاء الحساب بنجاح."
      );

      // تحويل
      router.push(
        "/login"
      );

    } catch (error: any) {

      console.error(
        error
      );

      alert(
        error?.message ||
          "حدث خطأ أثناء إنشاء الحساب."
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12"
      dir="rtl"
    >

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        {/* العنوان */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-black text-[#111827]">

            إنشاء حساب جديد

          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">

            سجل الآن وابدأ باستخدام المنصة

          </p>

        </div>

        {/* الفورم */}
        <form
          onSubmit={
            handleRegister
          }
          className="grid gap-5"
        >

          {/* الاسم */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

              الاسم الكامل

            </label>

            <input
              type="text"
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 outline-none focus:border-[#3FAF9B]"
            />

          </div>

          {/* الهاتف */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

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
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 outline-none focus:border-[#3FAF9B]"
            />

          </div>

          {/* الإيميل */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

              البريد الإلكتروني

            </label>

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 outline-none focus:border-[#3FAF9B]"
            />

          </div>

          {/* كلمة المرور */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

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
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 outline-none focus:border-[#3FAF9B]"
            />

          </div>

          {/* الزر */}
          <button
            type="submit"
            disabled={loading}
            className="h-14 rounded-2xl bg-[#3FAF9B] text-white font-black text-lg hover:bg-[#2F8E7D] transition disabled:opacity-50"
          >

            {loading
              ? "جاري إنشاء الحساب..."
              : "إنشاء الحساب"}

          </button>

        </form>

        {/* تسجيل الدخول */}
        <div className="mt-6 text-center text-sm text-gray-600">

          لديك حساب بالفعل؟{" "}

          <Link
            href="/login"
            className="text-[#3FAF9B] font-bold hover:underline"
          >

            تسجيل الدخول

          </Link>

        </div>

      </div>

    </main>
  );
}