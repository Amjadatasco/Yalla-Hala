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
  longitude?: number;
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

      // إذا لم يسجل دخول
      if (error || !user) {
        router.push("/");
        return;
      }

      setCurrentUser(user);
      setAuthorized(true);

      // إذا كان أدمن → تحويل للوحة الإدارة
      if (user.email === ADMIN_EMAIL) {
        router.push("/admin-dashboard");
        return;
      }

      // تحميل بيانات المؤجر فقط
      await loadOwnerData(user.id);
    } catch (error) {
      console.error("Auth Error:", error);
      alert("حدث خطأ أثناء التحقق من تسجيل الدخول");
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

      // تحميل الحجوزات المرتبطة بعقاراته
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

    await loadOwnerData(currentUser.id);
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("فشل تسجيل الخروج");
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
      // 1. Fetch booking details to get property_id, guest details, etc.
      const { data: bookingData, error: bookingErr } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (bookingErr || !bookingData) throw bookingErr || new Error("Booking not found");

      // 2. Fetch property details
      const { data: propertyData, error: propertyErr } = await supabase
        .from("properties")
        .select("*")
        .eq("id", bookingData.property_id)
        .single();

      if (propertyErr || !propertyData) throw propertyErr || new Error("Property not found");

      // 3. Confirm booking status in database
      const { error: updateErr } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", id);

      if (updateErr) throw updateErr;

      // 4. Send Telegram notification
      try {
        const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
        const TELEGRAM_CHAT_ID = "629151535";
        
        // Calculate price and nights
        let calculatedPrice = 0;
        let nights = 0;
        const is12h = bookingData.check_in === bookingData.check_out;
        
        if (is12h) {
          calculatedPrice = propertyData.latitude || 0; // latitude stores 12h price
        } else {
          const start = new Date(bookingData.check_in);
          const end = new Date(bookingData.check_out);
          if (end > start) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            calculatedPrice = nights * (propertyData.price || 0);
          }
        }
        
        const formattedPrice = propertyData.longitude === 1 
          ? `${Number(calculatedPrice).toLocaleString()} ل.س` 
          : `$${calculatedPrice} USD`;

        const messageText =
          `✅ تم تأكيد واكتمال حجز\n\n` +
          `🏠 العقار:\n${propertyData.title}\n\n` +
          `👤 صاحب العقار (المؤجر):\n${propertyData.owner_name} (${propertyData.owner_phone})\n\n` +
          `👤 المستأجر:\n${bookingData.guest_name} (${bookingData.guest_phone})\n\n` +
          `📅 التواريخ:\n` +
          (is12h
            ? `يوم ${bookingData.check_in} (إيجار 12 ساعة)\n\n`
            : `من ${bookingData.check_in} إلى ${bookingData.check_out} (${nights} ليالٍ)\n\n`) +
          `💰 القيمة الإجمالية:\n${formattedPrice}\n\n` +
          `🟢 حالة الحجز:\nConfirmed (مؤكد)`;

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: messageText,
            }),
          }
        );
      } catch (tgErr) {
        console.error("Failed to send Telegram notification:", tgErr);
      }

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
            جاري التحقق من تسجيل الدخول...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24" dir="rtl">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-start">
            <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 border">
              <Image
                src="/logo.jpg"
                alt="Yalla Hala Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="text-right">
              <h1 className="text-lg sm:text-xl font-black text-[#111827] leading-tight">
                لوحة تحكم المؤجر
              </h1>

              <p className="text-[10px] sm:text-xs font-bold text-[#CF9E59] mt-1">
                مرحباً بك: {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end sm:justify-start">
            <button
              onClick={handleLogout}
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm transition"
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
                title="عقاراتي المدرجة"
                value={properties.length}
                icon="🏢"
              />

              <StatCard
                title="الحجوزات المستلمة"
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
                عقاراتي المعروضة
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
                            {property.longitude === 1 ? `${Number(property.price).toLocaleString()} ل.س` : `$${property.price}`}
                          </p>

                        </div>

                        <div className="flex flex-col gap-2">
                        <Link
  href={`/edit-property/${property.id}`}
  className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center"
>
  تعديل العقار
</Link>
                          <button
                            onClick={() => deleteProperty(property.id)}
                            className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200"
                          >
                            حذف العقار
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
                طلبات الحجز
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

                        {booking.check_in === booking.check_out && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black py-1.5 px-2.5 rounded-lg text-center">
                            ☀️ إيجار 12 ساعة (نصف يوم)
                          </div>
                        )}

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
                            onClick={() => approveBooking(booking.id)}
                            className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                          >
                            تأكيد الحجز
                          </button>

                        )}

                        <button
                          onClick={() => deleteBooking(booking.id)}
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-3">
      <div className="text-right">
        <p className="text-xs font-bold text-[#6B7280]">
          {title}
        </p>

        <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#111827]">
          {value}
        </h2>
      </div>

      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
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
