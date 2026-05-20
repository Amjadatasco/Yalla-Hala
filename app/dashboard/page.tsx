"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DASHBOARD_PASSWORD = "9758";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  status: string;
};

type Booking = {
  id: number;
  property_id: number;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
};

export default function DashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_access");

    if (saved === "granted") {
      setAuthorized(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: propertiesData } = await supabase
      .from("properties")
      .select("*")
      .order("id", { ascending: false });

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (propertiesData) setProperties(propertiesData);
    if (bookingsData) setBookings(bookingsData);

    setLoading(false);
  }

  function handleLogin() {
    if (password === DASHBOARD_PASSWORD) {
      localStorage.setItem("dashboard_access", "granted");

      setAuthorized(true);

      loadData();
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  }

  function handleLogout() {
    localStorage.removeItem("dashboard_access");

    setAuthorized(false);

    setPassword("");
  }

  async function approveProperty(id: number) {
    await supabase
      .from("properties")
      .update({
        status: "approved",
      })
      .eq("id", id);

    loadData();
  }

  async function rejectProperty(id: number) {
    await supabase
      .from("properties")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    loadData();
  }

  async function deleteProperty(id: number) {
    const confirmed = window.confirm("حذف العقار؟");

    if (!confirmed) return;

    await supabase.from("properties").delete().eq("id", id);

    loadData();
  }

  async function deleteBooking(id: number) {
    const confirmed = window.confirm("حذف الحجز؟");

    if (!confirmed) return;

    await supabase.from("bookings").delete().eq("id", id);

    loadData();
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">

        <div className="w-full max-w-md bg-white border rounded-[32px] p-8 shadow-sm">

          <h1 className="text-4xl font-extrabold text-center mb-8">
            Dashboard
          </h1>

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-4"
          />

          <button
            onClick={handleLogin}
            className="mt-5 w-full bg-[#3FAF9B] text-white py-4 rounded-2xl text-lg font-bold"
          >
            دخول
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-4xl font-extrabold">
            لوحة الإدارة
          </h1>

          <div className="flex gap-3">

            <Link
              href="/"
              className="bg-[#3FAF9B] text-white px-5 py-3 rounded-2xl font-bold"
            >
              الرئيسية
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-2xl font-bold"
            >
              تسجيل خروج
            </button>

          </div>

        </div>

      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">

        {loading ? (
          <p className="text-center text-2xl">
            جاري التحميل...
          </p>
        ) : (
          <>

            <div className="mb-14">

              <h2 className="text-4xl font-extrabold mb-8 text-right">
                العقارات
              </h2>

              <div className="grid gap-6">

                {properties.map((property) => (

                  <div
                    key={property.id}
                    className="bg-white border border-[#E5E7EB] rounded-[32px] p-6 shadow-sm"
                  >

                    <div className="grid md:grid-cols-4 gap-6 items-center">

                      <img
                        src={
                          property.image ||
                          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                        }
                        className="w-full h-48 object-cover rounded-3xl"
                      />

                      <div className="md:col-span-2 text-right">

                        <h3 className="text-3xl font-extrabold">
                          {property.title}
                        </h3>

                        <p className="mt-3 text-[#6B7280]">
                          {property.location}
                        </p>

                        <p className="mt-3 text-2xl font-bold text-[#3FAF9B]">
                          ${property.price}
                        </p>

                        <div className="mt-4">

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              property.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : property.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {property.status || "pending"}
                          </span>

                        </div>

                      </div>

                      <div className="flex flex-col gap-3">

                        <button
                          onClick={() => approveProperty(property.id)}
                          className="bg-green-500 text-white py-3 rounded-2xl font-bold"
                        >
                          قبول
                        </button>

                        <button
                          onClick={() => rejectProperty(property.id)}
                          className="bg-yellow-500 text-white py-3 rounded-2xl font-bold"
                        >
                          رفض
                        </button>

                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="bg-red-500 text-white py-3 rounded-2xl font-bold"
                        >
                          حذف
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div>

              <h2 className="text-4xl font-extrabold mb-8 text-right">
                الحجوزات
              </h2>

              <div className="grid gap-6">

                {bookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="bg-white border border-[#E5E7EB] rounded-[32px] p-6 shadow-sm text-right"
                  >

                    <h3 className="text-2xl font-extrabold mb-5">
                      حجز رقم #{booking.id}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 text-lg">

                      <p>
                        <span className="font-bold">
                          رقم العقار:
                        </span>{" "}
                        {booking.property_id}
                      </p>

                      <p>
                        <span className="font-bold">
                          الاسم:
                        </span>{" "}
                        {booking.guest_name}
                      </p>

                      <p>
                        <span className="font-bold">
                          الهاتف:
                        </span>{" "}
                        {booking.guest_phone}
                      </p>

                      <p>
                        <span className="font-bold">
                          الدخول:
                        </span>{" "}
                        {booking.check_in}
                      </p>

                      <p>
                        <span className="font-bold">
                          الخروج:
                        </span>{" "}
                        {booking.check_out}
                      </p>

                    </div>

                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="mt-6 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                      حذف الحجز
                    </button>

                  </div>

                ))}

              </div>

            </div>

          </>
        )}

      </section>

    </main>
  );
}