"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  status: "approved" | "pending" | "rejected";
  user_id?: string;
};

type Booking = {
  id: number;
  property_id: number;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  status: "confirmed" | "pending";
};

export default function DashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // مؤقتاً — لاحقاً يجب نقله إلى نظام Roles داخل قاعدة البيانات
  const ADMIN_EMAIL = "0995688838@yallahala.local";

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/");
        return;
      }

      setCurrentUser(user);
      setAuthorized(true);

      const adminMode = user.email === ADMIN_EMAIL;
      if (!adminMode) {
      router.push("/");
     return;
     }
      setIsAdmin(adminMode);

      if (adminMode) {
        await loadAdminData();
      } else {
        await loadOwnerData(user.id);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("حدث خطأ أثناء التحقق من تسجيل الدخول");
    }
  }

  // تحميل بيانات الأدمن
  async function loadAdminData() {
    try {
      setLoading(true);

      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .order("id", { ascending: false });

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("id", { ascending: false });

      if (propertiesError) throw propertiesError;
      if (bookingsError) throw bookingsError;

      setProperties((propertiesData as Property[]) || []);
      setBookings((bookingsData as Booking[]) || []);
    } catch (error) {
      console.error("Load Admin Data Error:", error);
      alert("فشل تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  }

  // تحميل بيانات المؤجر
  async function loadOwnerData(userId: string) {
    try {
      setLoading(true);

      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false });

      if (propertiesError) throw propertiesError;

      const ownerProperties = (propertiesData as Property[]) || [];

      setProperties(ownerProperties);

      if (ownerProperties.length > 0) {
        const propertyIds = ownerProperties.map((p) => p.id);

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .in("property_id", propertyIds)
          .order("id", { ascending: false });

        if (bookingsError) throw bookingsError;

        setBookings((bookingsData as Booking[]) || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Load Owner Data Error:", error);
      alert("فشل تحميل بيانات المؤجر");
    } finally {
      setLoading(false);
    }
  }

  // إعادة تحميل البيانات
  async function refreshData() {
    if (!currentUser) return;

    if (currentUser.email === ADMIN_EMAIL) {
      await loadAdminData();
    } else {
      await loadOwnerData(currentUser.id);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/admin-login");
    } catch (error) {
      console.error(error);
      alert("فشل تسجيل الخروج");
    }
  }

  async function approveProperty(id: number) {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      refreshData();
    } catch (error) {
      console.error(error);
      alert("فشل قبول العقار");
    }
  }

  async function rejectProperty(id: number) {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      refreshData();
    } catch (error) {
      console.error(error);
      alert("فشل رفض العقار");
    }
  }

  async function deleteProperty(id: number) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا العقار نهائياً؟"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;

      refreshData();
    } catch (error) {
      console.error(error);
      alert("فشل حذف العقار");
    }
  }

  async function approveBooking(id: number) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", id);

      if (error) throw error;

      alert("تم تأكيد الحجز بنجاح");
      refreshData();
    } catch (error) {
      console.error(error);
      alert("فشل تأكيد الحجز");
    }
  }

  async function deleteBooking(id: number) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا الحجز نهائياً؟"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      refreshData();
    } catch (error) {
      console.error(error);
      alert("فشل حذف الحجز");
    }
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2D6A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-lg font-bold text-[#2D6A5F]">
            جاري التحقق من صلاحيات الدخول...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24" dir="rtl">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 border">
              <Image
                src="/logo.jpg"
                alt="Yalla Hala Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="text-right">
              <h1 className="text-xl font-black text-[#111827] leading-none">
                {isAdmin
                  ? "لوحة تحكم الإدارة العامة"
                  : "لوحة تحكم المؤجر العقاري"}
              </h1>

              <p className="text-xs font-bold text-[#CF9E59] mt-1.5">
                {isAdmin
                  ? "إدارة منصة يلا هلا"
                  : `مرحباً بك: ${currentUser?.email}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin/users"
                className="bg-[#3FAF9B] text-white px-4 h-10 rounded-xl font-bold text-sm flex items-center"
              >
                إدارة المشتركين
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="h-10 px-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm transition"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {loading ? (
          <div className="text-center py-32">
            <div className="w-10 h-10 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-sm font-bold text-[#6B7280]">
              جاري تحميل البيانات...
            </p>
          </div>
        ) : (
          <>
            {/* الإحصائيات */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <StatCard
                title={
                  isAdmin
                    ? "إجمالي العقارات بالمنصة"
                    : "عقاراتي المدرجة"
                }
                value={properties.length}
                icon="🏢"
              />

              <StatCard
                title={
                  isAdmin
                    ? "إجمالي الحجوزات"
                    : "الحجوزات المستلمة"
                }
                value={bookings.length}
                icon="📅"
              />

              <StatCard
                title="العقارات النشطة"
                value={
                  properties.filter((p) => p.status === "approved").length
                }
                icon="✅"
              />

              <StatCard
                title="بانتظار الموافقة"
                value={
                  properties.filter((p) => p.status === "pending").length
                }
                icon="⏳"
              />
            </div>

            {/* العقارات */}
            <div className="mb-14">
              <h2 className="text-xl font-black text-[#111827] mb-6 text-right border-r-4 border-[#2D6A5F] pr-3">
                {isAdmin
                  ? "طلبات إدراج العقارات"
                  : "عقاراتي المعروضة"}
              </h2>

              {properties.length === 0 ? (
                <EmptyState text="لا توجد عقارات حالياً." />
              ) : (
                <div className="grid gap-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                    >
                      <div className="grid gap-5 lg:grid-cols-[200px_1fr_180px] items-center">
                        <img
                          src={
                            property.image ||
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"
                          }
                          alt={property.title}
                          className="w-full h-36 object-cover rounded-xl"
                        />

                        <div className="text-right">
                          <h3 className="text-lg font-bold text-[#111827]">
                            {property.title}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {property.location}
                          </p>

                          <p className="text-lg font-black text-[#2D6A5F] mt-3">
                            ${property.price}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {isAdmin &&
                            property.status !== "approved" && (
                              <button
                                onClick={() =>
                                  approveProperty(property.id)
                                }
                                className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                              >
                                موافقة
                              </button>
                            )}

                          {isAdmin &&
                            property.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  rejectProperty(property.id)
                                }
                                className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                              >
                                رفض
                              </button>
                            )}

                          <button
                            onClick={() =>
                              deleteProperty(property.id)
                            }
                            className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* الحجوزات */}
            <div>
              <h2 className="text-xl font-black text-[#111827] mb-6 text-right border-r-4 border-[#CF9E59] pr-3">
                {isAdmin
                  ? "سجل الحجوزات العامة"
                  : "طلبات الحجز"}
              </h2>

              {bookings.length === 0 ? (
                <EmptyState text="لا توجد حجوزات حالياً." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                    >
                      <div className="text-right">
                        <h3 className="text-base font-bold text-[#111827]">
                          {booking.guest_name}
                        </h3>

                        <a
                          href={`tel:${booking.guest_phone}`}
                          className="text-blue-600 underline text-sm mt-2 inline-block"
                        >
                          {booking.guest_phone}
                        </a>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 p-2 rounded-xl text-center">
                            <p className="text-[10px] text-gray-400">
                              الوصول
                            </p>

                            <p className="text-xs font-bold">
                              {booking.check_in}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-2 rounded-xl text-center">
                            <p className="text-[10px] text-gray-400">
                              المغادرة
                            </p>

                            <p className="text-xs font-bold">
                              {booking.check_out}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-4">
                        {booking.status !== "confirmed" && (
                          <button
                            onClick={() =>
                              approveBooking(booking.id)
                            }
                            className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                          >
                            تأكيد الحجز
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteBooking(booking.id)
                          }
                          className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-100"
                        >
                          حذف الحجز
                        </button>
                      </div>
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="text-right">
        <p className="text-xs font-bold text-[#6B7280]">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#111827]">
          {value}
        </h2>
      </div>

      <div className="p-3 rounded-xl bg-gray-50 text-gray-500">
        {icon}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-right text-sm text-gray-400 bg-white p-6 rounded-2xl border text-center">
      {text}
    </p>
  );
}
