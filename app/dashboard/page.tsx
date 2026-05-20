"use client";

import { useEffect, useState } from "react";
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

    const saved =
      localStorage.getItem("dashboard_access");

    if (saved === "granted") {

      setAuthorized(true);

      loadData();

    } else {

      setLoading(false);
    }

  }, []);

  async function loadData() {

    setLoading(true);

    const { data: propertiesData } =
      await supabase
        .from("properties")
        .select("*")
        .order("id", { ascending: false });

    const { data: bookingsData } =
      await supabase
        .from("bookings")
        .select("*")
        .order("id", { ascending: false });

    if (propertiesData) {
      setProperties(propertiesData);
    }

    if (bookingsData) {
      setBookings(bookingsData);
    }

    setLoading(false);
  }

  function handleLogin() {

    if (password === DASHBOARD_PASSWORD) {

      localStorage.setItem(
        "dashboard_access",
        "granted"
      );

      setAuthorized(true);

      loadData();

    } else {

      alert("كلمة المرور غير صحيحة");
    }
  }

  function handleLogout() {

    localStorage.removeItem(
      "dashboard_access"
    );

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

    const confirmed =
      window.confirm("حذف العقار؟");

    if (!confirmed) return;

    await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    loadData();
  }

  async function deleteBooking(id: number) {

    const confirmed =
      window.confirm("حذف الحجز؟");

    if (!confirmed) return;

    await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    loadData();
  }

  if (!authorized) {

    return (
      <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

          <div className="text-center">

            <h1 className="text-4xl font-extrabold text-[#111827]">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-[#6B7280]">
              تسجيل دخول الإدارة
            </p>

          </div>

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="mt-8 w-full h-14 rounded-2xl border border-[#E5E7EB] px-5"
          />

          <button
            onClick={handleLogin}
            className="mt-5 w-full h-14 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D]"
          >
            دخول
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5]">

      <header className="bg-white border-b border-[#E5E7EB]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          <div>

            <h1 className="text-4xl font-extrabold text-[#111827]">
              Dashboard
            </h1>

            <p className="mt-2 text-[#6B7280]">
              إدارة العقارات والحجوزات
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="h-12 px-6 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600"
          >
            تسجيل خروج
          </button>

        </div>

      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {loading ? (

          <div className="text-center py-24 text-2xl">

            جاري التحميل...

          </div>

        ) : (

          <>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">

              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E7EB]">

                <p className="text-[#6B7280]">
                  العقارات
                </p>

                <h2 className="mt-3 text-5xl font-extrabold text-[#111827]">
                  {properties.length}
                </h2>

              </div>

              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E7EB]">

                <p className="text-[#6B7280]">
                  الحجوزات
                </p>

                <h2 className="mt-3 text-5xl font-extrabold text-[#111827]">
                  {bookings.length}
                </h2>

              </div>

              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E7EB]">

                <p className="text-[#6B7280]">
                  العقارات المقبولة
                </p>

                <h2 className="mt-3 text-5xl font-extrabold text-green-600">
                  {
                    properties.filter(
                      (p) =>
                        p.status === "approved"
                    ).length
                  }
                </h2>

              </div>

              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E7EB]">

                <p className="text-[#6B7280]">
                  بانتظار المراجعة
                </p>

                <h2 className="mt-3 text-5xl font-extrabold text-yellow-500">
                  {
                    properties.filter(
                      (p) =>
                        p.status === "pending"
                    ).length
                  }
                </h2>

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-4xl font-extrabold text-[#111827]">
                  العقارات
                </h2>

              </div>

              <div className="grid gap-6">

                {properties.map((property) => (

                  <div
                    key={property.id}
                    className="bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-[#E5E7EB]"
                  >

                    <div className="grid gap-6 lg:grid-cols-[260px_1fr_220px]">

                      <img
                        src={
                          property.image ||
                          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                        }
                        className="w-full h-60 object-cover rounded-[28px]"
                      />

                      <div className="text-right">

                        <div className="flex flex-wrap items-center gap-3 justify-end">

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              property.status ===
                              "approved"
                                ? "bg-green-100 text-green-700"
                                : property.status ===
                                  "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {property.status}
                          </span>

                        </div>

                        <h3 className="mt-5 text-3xl font-extrabold text-[#111827]">

                          {property.title}

                        </h3>

                        <p className="mt-3 text-[#6B7280] text-lg">

                          {property.location}

                        </p>

                        <p className="mt-5 text-3xl font-extrabold text-[#3FAF9B]">

                          ${property.price}

                        </p>

                      </div>

                      <div className="flex flex-col gap-3">

                        <button
                          onClick={() =>
                            approveProperty(
                              property.id
                            )
                          }
                          className="h-12 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600"
                        >
                          قبول
                        </button>

                        <button
                          onClick={() =>
                            rejectProperty(
                              property.id
                            )
                          }
                          className="h-12 rounded-2xl bg-yellow-500 text-white font-bold hover:bg-yellow-600"
                        >
                          رفض
                        </button>

                        <button
                          onClick={() =>
                            deleteProperty(
                              property.id
                            )
                          }
                          className="h-12 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600"
                        >
                          حذف
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="mt-16">

              <h2 className="text-4xl font-extrabold text-[#111827] mb-8">

                الحجوزات

              </h2>

              <div className="grid gap-5">

                {bookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E7EB]"
                  >

                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">

                      <div className="text-right">

                        <h3 className="text-2xl font-extrabold text-[#111827]">

                          {booking.guest_name}

                        </h3>

                        <p className="mt-3 text-[#6B7280]">

                          {booking.guest_phone}

                        </p>

                        <div className="mt-5 flex flex-wrap gap-3 justify-end">

                          <span className="bg-[#F3F4F6] px-4 py-2 rounded-full text-sm">

                            وصول:
                            {" "}
                            {booking.check_in}

                          </span>

                          <span className="bg-[#F3F4F6] px-4 py-2 rounded-full text-sm">

                            مغادرة:
                            {" "}
                            {booking.check_out}

                          </span>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          deleteBooking(
                            booking.id
                          )
                        }
                        className="h-12 px-6 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600"
                      >
                        حذف الحجز
                      </button>

                    </div>

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