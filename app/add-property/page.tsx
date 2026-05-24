"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyPage({ params }: any) {

  // دعم Next.js الحديثة
  const resolvedParams =
    "then" in params ? use(params) : params;

  const [property, setProperty] =
    useState<any>(null);

  const [existingBookings, setExistingBookings] =
    useState<any[]>([]);

  const [guestName, setGuestName] =
    useState("");

  const [guestPhone, setGuestPhone] =
    useState("");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [viewMode, setViewMode] =
    useState<"details" | "book">(
      "details"
    );

  const todayStr = new Date()
    .toISOString()
    .split("T")[0];

  // ⚠️ لاحقاً انقلهم إلى env
  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID =
    "629151535";

  useEffect(() => {

    if (resolvedParams?.id) {
      loadPropertyAndBookings();
    }

  }, [resolvedParams?.id]);

  useEffect(() => {

    if (typeof window !== "undefined") {

      const searchParams =
        new URLSearchParams(
          window.location.search
        );

      if (
        searchParams.get("action") ===
        "book"
      ) {
        setViewMode("book");
      }
    }

  }, []);

  // تحميل العقار والحجوزات
  async function loadPropertyAndBookings() {

    try {

      setPageLoading(true);

      // تحميل العقار
      const {
        data: propertyData,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (propertyError) {

        console.error(propertyError);

        return;
      }

      setProperty(propertyData);

      // تحميل الحجوزات المؤكدة
      const {
        data: bookingsData,
        error: bookingsError,
      } = await supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq(
          "property_id",
          resolvedParams.id
        )
        .eq("status", "confirmed");

      if (
        !bookingsError &&
        bookingsData
      ) {

        setExistingBookings(
          bookingsData
        );
      }

    } catch (err) {

      console.error(
        "Error loading property:",
        err
      );

    } finally {

      setPageLoading(false);

    }
  }

  // فحص تداخل الحجوزات
  function isDatesOverlapping(
    newIn: string,
    newOut: string
  ) {

    const startNew =
      new Date(newIn).getTime();

    const endNew =
      new Date(newOut).getTime();

    for (const booking of existingBookings) {

      const startExisting =
        new Date(
          booking.check_in
        ).getTime();

      const endExisting =
        new Date(
          booking.check_out
        ).getTime();

      if (
        startNew < endExisting &&
        endNew > startExisting
      ) {

        return true;
      }
    }

    return false;
  }

  // إشعار تيليغرام
  async function sendTelegramNotification(
    name: string,
    phone: string,
    inDate: string,
    outDate: string
  ) {

    try {

      const messageText =
        `🚨 طلب حجز جديد\n\n` +

        `🏠 العقار:\n${
          property?.title || ""
        }\n\n` +

        `📍 الموقع:\n${
          property?.location || ""
        }\n\n` +

        `👤 اسم المستأجر:\n${name}\n\n` +

        `📞 رقم الهاتف:\n${phone}\n\n` +

        `📅 الوصول:\n${inDate}\n\n` +

        `📅 المغادرة:\n${outDate}\n\n` +

        `🟡 الحالة:\nPending`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chat_id:
              TELEGRAM_CHAT_ID,

            text: messageText,
          }),
        }
      );

    } catch (err) {

      console.error(
        "Telegram Error:",
        err
      );

    }
  }

  // تنفيذ الحجز
  async function handleBooking() {

    // تحقق من الحقول
    if (
      !guestName.trim() ||
      !guestPhone.trim() ||
      !checkIn ||
      !checkOut
    ) {

      alert(
        "يرجى تعبئة جميع بيانات الحجز."
      );

      return;
    }

    const checkInDate =
      new Date(checkIn);

    const checkOutDate =
      new Date(checkOut);

    // تحقق من التواريخ
    if (
      checkOutDate <= checkInDate
    ) {

      alert(
        "يجب أن يكون تاريخ المغادرة بعد الوصول."
      );

      return;
    }

    // تحقق من التداخل
    if (
      isDatesOverlapping(
        checkIn,
        checkOut
      )
    ) {

      alert(
        "هذه التواريخ محجوزة بالفعل."
      );

      return;
    }

    try {

      setLoading(true);

      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // منع الحجز بدون تسجيل دخول
      if (!user) {

        alert(
          "يجب تسجيل الدخول أولاً للحجز."
        );

        setLoading(false);

        return;
      }

      // حفظ الحجز
      const { error } =
        await supabase
          .from("bookings")
          .insert([
            {
              property_id:
                property.id,

              guest_name:
                guestName.trim(),

              guest_phone:
                guestPhone.trim(),

              check_in:
                checkIn,

              check_out:
                checkOut,

              status:
                "pending",

              user_id:
                user.id,
            },
          ]);

      if (error) {

        console.error(error);

        alert(
          `فشل إرسال الحجز: ${error.message}`
        );

        setLoading(false);

        return;
      }

      // إرسال إشعار تيليغرام
      await sendTelegramNotification(
        guestName.trim(),
        guestPhone.trim(),
        checkIn,
        checkOut
      );

      // رسالة نجاح
      alert(
        "تم إرسال طلب الحجز بنجاح، سيتم مراجعة الطلب والتواصل لاحقاً."
      );

      // تنظيف الحقول
      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");

      // العودة للتفاصيل
      setViewMode("details");

      // إعادة تحميل الحجوزات
      loadPropertyAndBookings();

    } catch (err) {

      console.error(err);

      alert(
        "حدث خطأ أثناء إرسال الحجز."
      );

    } finally {

      setLoading(false);

    }
  }

  // تحميل الصفحة
  if (pageLoading) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">

        <div className="w-12 h-12 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mb-5"></div>

        <p className="text-sm font-bold text-[#3FAF9B]">

          جاري تحميل العقار...

        </p>

      </div>
    );
  }

  // العقار غير موجود
  if (!property) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">

        <p className="text-red-500 font-bold">

          العقار غير موجود

        </p>

        <button
          onClick={() =>
            (window.location.href =
              "/")
          }
          className="bg-[#3FAF9B] text-white px-5 py-2 rounded-full"
        >

          العودة للرئيسية

        </button>

      </div>
    );
  }

  return (
    <main
      className="bg-[#FAFAFA] min-h-screen px-4 py-10"
      dir="rtl"
    >

      <div className="max-w-5xl mx-auto">

        {/* الصورة الرئيسية */}
        <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white">

          <img
            src={
              property.image ||
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"
            }
            alt={property.title}
            className="w-full h-[500px] object-cover"
          />

        </div>

        {/* الكارد */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

          {/* الهيدر */}
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-gray-100 pb-6">

            <div className="text-right">

              <h1 className="text-3xl font-black text-[#111827]">

                {property.title}

              </h1>

              <p className="text-sm text-[#6B7280] mt-2">

                {property.location}
                {" - "}
                {
                  property.governorate
                }

              </p>

            </div>

            <div className="rounded-2xl bg-[#E6F4F1] px-6 py-4 text-center border border-emerald-100">

              <p className="text-3xl font-black text-[#2D6A5F]">

                $
                {property.price}

              </p>

              <p className="text-xs font-bold text-[#6B7280] mt-1">

                ليلة واحدة

              </p>

            </div>

          </div>

          {/* Tabs */}
          <div className="flex mt-6 border-b border-gray-100">

            <button
              onClick={() =>
                setViewMode(
                  "details"
                )
              }
              className={`flex-1 py-4 text-sm font-black border-b-2 transition ${
                viewMode ===
                "details"
                  ? "border-[#3FAF9B] text-[#3FAF9B]"
                  : "border-transparent text-gray-400"
              }`}
            >

              تفاصيل العقار

            </button>

            <button
              onClick={() =>
                setViewMode(
                  "book"
                )
              }
              className={`flex-1 py-4 text-sm font-black border-b-2 transition ${
                viewMode ===
                "book"
                  ? "border-[#3FAF9B] text-[#3FAF9B]"
                  : "border-transparent text-gray-400"
              }`}
            >

              طلب حجز الإقامة

            </button>

          </div>

          {/* تفاصيل العقار */}
          {viewMode ===
            "details" && (

            <div className="mt-10 space-y-8">

              {/* الوصف */}
              <section>

                <div className="flex items-center gap-2 mb-4">

                  <div className="w-1.5 h-7 rounded-full bg-[#3FAF9B]"></div>

                  <h2 className="text-2xl font-black text-[#111827]">

                    الوصف والمواصفات

                  </h2>

                </div>

                <div className="rounded-3xl border border-gray-100 bg-[#F9FAFB] p-6 sm:p-7 shadow-sm">

                  <p className="leading-[2.3] text-[15px] sm:text-base text-[#374151] whitespace-pre-line">

                    {property.description?.trim()
                      ? property.description
                      : "لا يوجد وصف مضاف لهذا العقار حالياً."}

                  </p>

                </div>

              </section>

              {/* الحجوزات */}
              <section>

                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">

                  <h3 className="text-base font-black text-amber-900 mb-4">

                    📅 الفترات المحجوزة

                  </h3>

                  {existingBookings.length ===
                  0 ? (

                    <p className="text-sm text-amber-700">

                      العقار متاح بالكامل حالياً.

                    </p>

                  ) : (

                    <div className="space-y-2">

                      {existingBookings.map(
                        (
                          booking,
                          index
                        ) => (

                          <div
                            key={
                              index
                            }
                            className="bg-white rounded-xl border border-amber-100 px-4 py-3 text-sm"
                          >

                            من{" "}

                            <span className="font-black">

                              {
                                booking.check_in
                              }

                            </span>

                            {" "}إلى{" "}

                            <span className="font-black">

                              {
                                booking.check_out
                              }

                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </section>

            </div>
          )}

          {/* قسم الحجز */}
          {viewMode ===
            "book" && (

            <div className="mt-8 grid gap-4">

              <input
                type="text"
                placeholder="اسم المستأجر الكامل"
                value={
                  guestName
                }
                onChange={(e) =>
                  setGuestName(
                    e.target
                      .value
                  )
                }
                className="rounded-2xl border border-[#E5E7EB] px-4 py-4 text-right outline-none focus:border-[#3FAF9B]"
              />

              <input
                type="text"
                placeholder="رقم الهاتف"
                value={
                  guestPhone
                }
                onChange={(e) =>
                  setGuestPhone(
                    e.target
                      .value
                  )
                }
                className="rounded-2xl border border-[#E5E7EB] px-4 py-4 text-right outline-none focus:border-[#3FAF9B]"
              />

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-2 text-xs font-bold text-[#6B7280]">

                    تاريخ الوصول

                  </label>

                  <input
                    type="date"
                    min={
                      todayStr
                    }
                    value={
                      checkIn
                    }
                    onChange={(
                      e
                    ) =>
                      setCheckIn(
                        e
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-4"
                  />

                </div>

                <div>

                  <label className="block mb-2 text-xs font-bold text-[#6B7280]">

                    تاريخ المغادرة

                  </label>

                  <input
                    type="date"
                    min={
                      checkIn ||
                      todayStr
                    }
                    value={
                      checkOut
                    }
                    onChange={(
                      e
                    ) =>
                      setCheckOut(
                        e
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-4"
                  />

                </div>

              </div>

              <button
                onClick={
                  handleBooking
                }
                disabled={
                  loading
                }
                className="mt-2 w-full rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-black text-white transition disabled:bg-gray-400"
              >

                {loading
                  ? "جاري إرسال الطلب..."
                  : "تأكيد طلب الحجز"}

              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}