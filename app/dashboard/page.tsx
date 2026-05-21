"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin-login";
      return;
    }

    setAuthorized(true);
    loadData();
  }

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

    if (propertiesData) {
      setProperties(propertiesData);
    }

    if (bookingsData) {
      setBookings(bookingsData);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin-login";
  }

  async function approveProperty(id: number) {
    await supabase
      .from("properties")
      .update({ status: "approved" })
      .eq("id", id);
    loadData();
  }

  async function rejectProperty(id: number) {
    await supabase
      .from("properties")
      .update({ status: "rejected" })
      .eq("id", id);
    loadData();
  }

  async function deleteProperty(id: number) {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا العقار نهائياً؟");
    if (!confirmed) return;

    await supabase
      .from("properties")
      .delete()
      .eq("id", id);
    loadData();
  }

  async function deleteBooking(id: number) {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا الحجز نهائياً؟");
    if (!confirmed) return;

    await supabase
      .from("bookings")
      .delete()
      .eq("id", id);
    loadData();
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2D6A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold text-[#2D6A5F]">جاري التحقق من صلاحيات المسؤول...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24">
      
      {/* HEADER - لوحة التحكم الفاخرة المربوطة بالهوية */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 border">
              <img
                src="/logo.jpg"
                alt="Yalla Hala Logo"
                className="h-full w-full object-contain p-0.5"
              />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-black text-[#111827] leading-none">لوحة التحكم</h1>
              <p className="text-xs font-bold text-[#CF9E59] mt-1.5">إدارة منصة يلا هلا السياحية</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="h-10 px-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm transition duration-200 shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل خروج
          </button>

        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        
        {loading ? (
          <div className="text-center py-32">
            <div className="w-10 h-10 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-[#6B7280]">جاري تحديث البيانات الحية...</p>
          </div>
        ) : (
          <>
            {/* بطاقات الإحصائيات السريعة المطورة */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#6B7280]">إجمالي العقارات</p>
                  <h2 className="mt-2 text-3xl font-black text-[#111827]">{properties.length}</h2>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 text-gray-500">🏢</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#6B7280]">إجمالي الحجوزات</p>
                  <h2 className="mt-2 text-3xl font-black text-[#111827]">{bookings.length}</h2>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 text-gray-500">📅</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#6B7280]">العقارات النشطة</p>
                  <h2 className="mt-2 text-3xl font-black text-green-600">
                    {properties.filter((p) => p.status === "approved").length}
                  </h2>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">✅</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#6B7280]">بانتظار المراجعة</p>
                  <h2 className="mt-2 text-3xl font-black text-yellow-600">
                    {properties.filter((p) => p.status === "pending").length}
                  </h2>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">⏳</div>
              </div>

            </div>

            {/* قسم إدارة طلبات إعلانات العقارات */}
            <div className="mb-14">
              <h2 className="text-xl font-black text-[#111827] mb-6 text-right border-r-4 border-[#2D6A5F] pr-3">
                طلبات إدراج العقارات
              </h2>
              
              {properties.length === 0 ? (
                <p className="text-right text-sm text-gray-400 bg-white p-6 rounded-2xl border text-center">لا توجد طلبات عقارات مسجلة حالياً.</p>
              ) : (
                <div className="grid gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                      <div className="grid gap-5 lg:grid-cols-[200px_1fr_180px] items-center">
                        
                        <img
                          src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
                          className="w-full h-36 object-cover rounded-xl"
                          alt={property.title}
                        />

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              property.status === "approved"
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : property.status === "rejected"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                            }`}>
                              {property.status === "approved" ? "مقبول ونشط" : property.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#111827]">{property.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{property.location}</p>
                          <p className="text-lg font-black text-[#2D6A5F] mt-3">${property.price} <span className="text-[10px] text-gray-400 font-normal">/ ليلة</span></p>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          {property.status !== "approved" && (
                            <button
                              onClick={() => approveProperty(property.id)}
                              className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition"
                            >
                              موافقة ونشر
                            </button>
                          )}
                          {property.status !== "rejected" && (
                            <button
                              onClick={() => rejectProperty(property.id)}
                              className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                            >
                              رفض الطلب
                            </button>
                          )}
                          <button
                            onClick={() => deleteProperty(property.id)}
                            className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition border border-red-200"
                          >
                            حذف نهائي
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* قسم تصفح وإدارة الحجوزات الواردة */}
            <div>
              <h2 className="text-xl font-black text-[#111827] mb-6 text-right border-r-4 border-[#CF9E59] pr-3">
                طلبات الحجوزات الواردة
              </h2>

              {bookings.length === 0 ? (
                <p className="text-right text-sm text-gray-400 bg-white p-6 rounded-2xl border text-center">لا توجد طلبات حجوزات مسجلة بعد.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
                      <div className="text-right">
                        <div className="flex items-center justify-between border-b pb-2 mb-3">
                          <span className="text-[10px] text-gray-400 font-bold">معرف الحجز #{booking.id}</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">طلب حجز متاح</span>
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">{booking.guest_name}</h3>
                        <p className="text-xs text-[#6B7280] mt-1.5 flex items-center justify-end gap-1">
                          {booking.guest_phone}
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </p>

                        <div className="mt-4 pt-3 border-t border-dashed grid grid-cols-2 gap-2 text-center">
                          <div className="bg-gray-50 p-2 rounded-xl">
                            <p className="text-[9px] text-gray-400 font-bold">تاريخ الوصول</p>
                            <p className="text-xs font-bold text-gray-700 mt-1">{booking.check_in}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-xl">
                            <p className="text-[9px] text-gray-400 font-bold">تاريخ المغادرة</p>
                            <p className="text-xs font-bold text-gray-700 mt-1">{booking.check_out}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition border border-red-100 flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        حذف وإلغاء الحجز
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </section>
    </main>
  );
}