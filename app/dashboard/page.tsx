"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: number;
  property_id: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
};

const DASHBOARD_PASSWORD = "9758";

export default function DashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedAccess = localStorage.getItem("dashboard_access");
    if (savedAccess === "granted") {
      setIsAuthorized(true);
      loadBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = () => {
    if (password === DASHBOARD_PASSWORD) {
      localStorage.setItem("dashboard_access", "granted");
      setIsAuthorized(true);
      loadBookings();
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dashboard_access");
    setIsAuthorized(false);
    setPassword("");
  };

  const handleDeleteBooking = async (id: number) => {
    const confirmed = window.confirm("هل أنت متأكد من إلغاء هذا الحجز؟");

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      alert("حدث خطأ أثناء إلغاء الحجز");
      console.log(error);
    } else {
      alert("تم إلغاء الحجز بنجاح");
      loadBookings();
    }
  };

  if (!isAuthorized) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md border rounded-3xl shadow-sm p-8 bg-white text-right">
          <h1 className="text-3xl font-bold mb-6 text-center">
            دخول الداشبورد
          </h1>

          <label className="block mb-3 text-gray-600 font-medium">
            كلمة المرور
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full border rounded-2xl px-4 py-3 mb-5"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#49B5A6] text-white py-3 rounded-2xl font-semibold hover:bg-[#3ea596]"
          >
            دخول
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-500 hover:underline">
              الرجوع للرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold">لوحة إدارة الحجوزات</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-600"
            >
              تسجيل الخروج
            </button>

            <Link
              href="/"
              className="bg-[#49B5A6] text-white px-5 py-3 rounded-xl font-semibold"
            >
              الرجوع للرئيسية
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-xl text-center">جاري تحميل الحجوزات...</p>
        ) : bookings.length === 0 ? (
          <p className="text-xl text-center">لا توجد حجوزات حالياً</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-2xl p-6 shadow-sm text-right"
              >
                <h2 className="text-2xl font-bold mb-4">
                  حجز رقم #{booking.id}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-lg">
                  <p>
                    <span className="font-bold">رقم العقار:</span>{" "}
                    {booking.property_id}
                  </p>

                  <p>
                    <span className="font-bold">الاسم:</span>{" "}
                    {booking.guest_name}
                  </p>

                  <p>
                    <span className="font-bold">رقم الهاتف:</span>{" "}
                    {booking.guest_phone}
                  </p>

                  <p>
                    <span className="font-bold">تاريخ الدخول:</span>{" "}
                    {booking.check_in}
                  </p>

                  <p>
                    <span className="font-bold">تاريخ الخروج:</span>{" "}
                    {booking.check_out}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    disabled={deletingId === booking.id}
                    className="bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === booking.id
                      ? "جاري الإلغاء..."
                      : "إلغاء الحجز"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}