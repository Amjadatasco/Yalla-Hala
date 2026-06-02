"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PropertyPage({ params }: any) {
  const resolvedParams =
    "then" in params
      ? use(params)
      : params;

  const [property, setProperty] = useState<any>(null);

  const [existingBookings, setExistingBookings] =
    useState<any[]>([]);

  const [guestName, setGuestName] = useState("");

  const [guestPhone, setGuestPhone] = useState("");

  const [checkIn, setCheckIn] = useState<any>("");

  const [checkOut, setCheckOut] = useState<any>("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"details" | "book">("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID =
    "629151535";

  useEffect(() => {
    if (resolvedParams?.id) {
      loadPropertyAndBookings();
    }
  }, [resolvedParams?.id]);

  async function loadPropertyAndBookings() {
    try {
      setPageLoading(true);

      const {
        data: propertyData,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select("*")
        .eq(
          "id",
          resolvedParams.id
        )
        .single();

      if (propertyError) {
        console.error(
          propertyError
        );

        return;
      }

      setProperty(propertyData);

      const {
        data: bookingsData,
        error: bookingsError,
      } = await supabase
        .from("bookings")
        .select(
          "check_in, check_out"
        )
        .eq(
          "property_id",
          resolvedParams.id
        )
        .eq(
          "status",
          "confirmed"
        );

      if (
        !bookingsError &&
        bookingsData
      ) {
        setExistingBookings(
          bookingsData
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }

  function getBlockedDates() {
    const blockedDates: Date[] = [];

    existingBookings.forEach((booking) => {
      const start =
        new Date(
          booking.check_in
        );

      const end =
        new Date(
          booking.check_out
        );

      const current =
        new Date(start);

      while (current <= end) {
        blockedDates.push(
          new Date(current)
        );

        current.setDate(
          current.getDate() + 1
        );
      }
    });

    return blockedDates;
  }

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
        startNew <
          endExisting &&
        endNew >
          startExisting
      ) {
        return true;
      }
    }

    return false;
  }

  async function sendTelegramNotification(
    name: string,
    phone: string,
    inDate: string,
    outDate: string
  ) {
    try {
      const cleanPhone =
        property?.owner_phone
          ?.replace(
            /\D/g,
            ""
          ) || "";

      const whatsappMessage =
        `مرحباً ${property?.owner_name || ""} 👋\n\n` +
        `يوجد طلب حجز جديد على عقارك:\n\n` +
        `🏠 ${property?.title}\n` +
        `📅 من ${inDate} إلى ${outDate}\n\n` +
        `👤 اسم المستأجر: ${name}\n` +
        `📞 رقم المستأجر: ${phone}`;

      const whatsappLink =
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      const messageText =
        `🚨 طلب حجز جديد\n\n` +
        `🏠 العقار:\n${property?.title || ""}\n\n` +
        `📍 الموقع:\n${property?.location || ""}\n\n` +
        `👤 المستأجر:\n${name}\n\n` +
        `📞 الهاتف:\n${phone}\n\n` +
        `📅 الوصول:\n${inDate}\n\n` +
        `📅 المغادرة:\n${outDate}\n\n` +
        `📲 رابط مراسلة المؤجر:\n${whatsappLink}`;

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
      console.error(err);
    }
  }

  async function handleBooking() {
    if (
      !guestName.trim() ||
      !guestPhone.trim() ||
      !checkIn ||
      !checkOut
    ) {
      alert(
        "يرجى تعبئة جميع البيانات."
      );

      return;
    }

    const checkInDate =
      new Date(checkIn);

    const checkOutDate =
      new Date(checkOut);

    if (
      checkOutDate <=
      checkInDate
    ) {
      alert(
        "تاريخ المغادرة يجب أن يكون بعد الوصول."
      );

      return;
    }

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
            },
          ]);

      if (error) {
        console.error(error);

        alert(
          `فشل الحجز: ${error.message}`
        );

        setLoading(false);

        return;
      }

      await sendTelegramNotification(
        guestName.trim(),
        guestPhone.trim(),
        checkIn,
        checkOut
      );

      alert(
        "تم استلام طلب الحجز بنجاح."
      );

      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");

      setViewMode("details");
    } catch (err) {
      console.error(err);

      alert(
        "حدث خطأ أثناء إرسال الطلب."
      );
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        جاري تحميل العقار...

      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        العقار غير موجود
      </div>
    );
  }

  // قائمة الصور المتاحة
  const images = property?.images_list?.length
    ? property.images_list
    : [property?.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"];

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setShowLightbox(true);
  };

  // حاسبة الأسعار الديناميكية
  let nights = 0;
  let totalPrice = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalPrice = nights * (property?.price || 0);
    }
  }

  return (
    <main
      className="bg-[#FAFAFA] min-h-screen px-4 pt-6 pb-28 sm:py-10"
      dir="rtl"
    >

      <div className="max-w-5xl mx-auto">

        {/* معرض الصور المطور */}
        <div className="mb-8">
          {/* نسخة الموبايل (سلايدر منزلق باللمس) */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-3 px-4 -mx-4 scrollbar-none pb-2">
            {images.map((image: string, index: number) => (
              <div 
                key={index} 
                className="w-[85vw] flex-shrink-0 snap-start rounded-2xl overflow-hidden border h-[240px] relative cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img src={image} className="w-full h-full object-cover" alt={`${property.title} - ${index + 1}`} />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {index + 1} / {images.length}
                </div>
              </div>
            ))}
          </div>

          {/* نسخة الكمبيوتر (شبكة صور احترافية) */}
          {images.length === 1 && (
            <div className="hidden md:block h-[450px] w-full rounded-3xl overflow-hidden border cursor-pointer" onClick={() => openLightbox(0)}>
              <img src={images[0]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
            </div>
          )}

          {images.length === 2 && (
            <div className="hidden md:grid grid-cols-2 gap-3 h-[450px] w-full rounded-3xl overflow-hidden cursor-pointer">
              <div className="h-full overflow-hidden border" onClick={() => openLightbox(0)}>
                <img src={images[0]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
              <div className="h-full overflow-hidden border" onClick={() => openLightbox(1)}>
                <img src={images[1]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
            </div>
          )}

          {images.length >= 3 && (
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[450px] w-full rounded-3xl overflow-hidden cursor-pointer relative">
              <div className="col-span-2 row-span-2 h-full overflow-hidden border" onClick={() => openLightbox(0)}>
                <img src={images[0]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
              <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(1)}>
                <img src={images[1]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
              <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(2)}>
                <img src={images[2]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
              {images.length >= 4 ? (
                <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(3)}>
                  <img src={images[3]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
                </div>
              ) : (
                <div className="col-span-1 h-full bg-gray-50 border flex items-center justify-center text-gray-400 font-bold text-sm">
                  لا يوجد صور إضافية
                </div>
              )}
              {images.length >= 5 ? (
                <div className="col-span-1 h-full overflow-hidden border relative" onClick={() => openLightbox(4)}>
                  <img src={images[4]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
                  {images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-lg">
                      + {images.length - 5} صور
                    </div>
                  )}
                </div>
              ) : (
                <div className="col-span-1 h-full bg-gray-50 border flex items-center justify-center text-gray-400 font-bold text-sm">
                  لا يوجد صور إضافية
                </div>
              )}
            </div>
          )}
        </div>

        {/* الكارد */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">

          {/* الهيدر */}
          <div className="flex flex-wrap items-start justify-between gap-5 border-b pb-6">

            <div>

              <h1 className="text-3xl font-black">

                {property.title}

              </h1>

              <p className="mt-2 text-sm text-gray-500">

                {property.location}
                {" - "}
                {
                  property.governorate
                }

              </p>

            </div>

            <div className="rounded-2xl bg-[#E6F4F1] px-6 py-4 text-center">

              <p className="text-3xl font-black text-[#2D6A5F]">

                $
                {property.price}

              </p>

              <p className="text-xs mt-1">

                USD / ليلة

              </p>

            </div>

          </div>

          {/* Tabs */}
          <div className="flex mt-6 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
            <button
              onClick={() => setViewMode("details")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                viewMode === "details"
                  ? "bg-white text-[#2D6A5F] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 تفاصيل العقار
            </button>
            <button
              onClick={() => setViewMode("book")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                viewMode === "book"
                  ? "bg-[#3FAF9B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📅 طلب حجز العقار
            </button>
          </div>

          {/* التفاصيل */}
          {viewMode === "details" && (
            <div className="mt-10 space-y-8">

              {/* الوصف */}
              <section>
                <h2 className="text-2xl font-black mb-4">
                  الوصف
                </h2>
                <div className="rounded-3xl bg-[#F9FAFB] p-6">
                  <p className="leading-[2.2] whitespace-pre-line">
                    {property.description ||
                      "لا يوجد وصف"}
                  </p>
                </div>
              </section>

              {/* التجهيزات */}
              <section>
                <h2 className="text-2xl font-black mb-4">
                  التجهيزات والخدمات
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {property.amenities
                    ?.split(",")
                    .map(
                      (
                        item: string,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="rounded-2xl border bg-white px-4 py-3"
                        >
                          ✓ {item.trim()}
                        </div>
                      )
                    )}
                </div>
              </section>

              {/* المعلومات */}
              <section>
                <h2 className="text-2xl font-black mb-4">
                  معلومات العقار
                </h2>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  <div className="rounded-2xl border p-3 sm:p-5 text-center bg-gray-50/50">
                    <p className="text-[10px] sm:text-sm text-gray-500">
                      الغرف
                    </p>
                    <h3 className="text-lg sm:text-3xl font-black mt-1">
                      {property.rooms_count}
                    </h3>
                  </div>
                  <div className="rounded-2xl border p-3 sm:p-5 text-center bg-gray-50/50">
                    <p className="text-[10px] sm:text-sm text-gray-500">
                      الأسرة
                    </p>
                    <h3 className="text-lg sm:text-3xl font-black mt-1">
                      {property.beds_count}
                    </h3>
                  </div>
                  <div className="rounded-2xl border p-3 sm:p-5 text-center bg-gray-50/50">
                    <p className="text-[10px] sm:text-sm text-gray-500">
                      الحمامات
                    </p>
                    <h3 className="text-lg sm:text-3xl font-black mt-1">
                      {property.bathrooms_count}
                    </h3>
                  </div>
                </div>
              </section>

              {/* زر طلب حجز بارز جداً في نهاية التفاصيل */}
              <div className="pt-6 border-t border-gray-100 flex justify-center mt-8">
                <button
                  onClick={() => setViewMode("book")}
                  className="w-full sm:w-2/3 h-14 rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] text-white font-black text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  ابدأ بطلب الحجز الآن
                </button>
              </div>

            </div>
          )}

          {/* الحجز */}
          {viewMode ===
            "book" && (

            <div className="mt-8 grid gap-5">

              <input
                type="text"
                placeholder="اسم المستأجر"
                value={guestName}
                onChange={(e) =>
                  setGuestName(
                    e.target.value
                  )
                }
                className="rounded-2xl border px-4 py-4"
              />

              <input
                type="text"
                placeholder="رقم الهاتف"
                value={guestPhone}
                onChange={(e) =>
                  setGuestPhone(
                    e.target.value
                  )
                }
                className="rounded-2xl border px-4 py-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block mb-2 font-bold">

                    تاريخ الوصول

                  </label>

                  <DatePicker
                    selected={
                      checkIn
                        ? new Date(checkIn)
                        : null
                    }
                    onChange={(date: any) =>
                      setCheckIn(
                        date
                          ?.toISOString()
                          ?.split("T")[0]
                      )
                    }
                    excludeDates={
                      getBlockedDates()
                    }
                    minDate={
                      new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ الوصول"
                    className="w-full rounded-2xl border px-4 py-4"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-bold">

                    تاريخ المغادرة

                  </label>

                  <DatePicker
                    selected={
                      checkOut
                        ? new Date(checkOut)
                        : null
                    }
                    onChange={(date: any) =>
                      setCheckOut(
                        date
                          ?.toISOString()
                          ?.split("T")[0]
                      )
                    }
                    excludeDates={
                      getBlockedDates()
                    }
                    minDate={
                      checkIn
                        ? new Date(checkIn)
                        : new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ المغادرة"
                    className="w-full rounded-2xl border px-4 py-4"
                  />

                </div>

              </div>

              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                الأيام المحجوزة غير قابلة للاختيار.
              </div>

              {/* حاسبة الأسعار الديناميكية */}
              {nights > 0 && (
                <div className="bg-[#F8FFFD] border border-[#D1FAE5] p-5 rounded-2xl text-right flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>عدد الليالي:</span>
                    <span className="font-bold text-[#111827]">{nights} ليالٍ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>سعر الليلة الواحدة:</span>
                    <span className="font-bold text-[#111827]">${property.price} USD</span>
                  </div>
                  <div className="border-t border-[#D1FAE5] pt-2.5 flex justify-between items-center">
                    <span className="text-base font-bold text-[#166534]">الإجمالي المقدر للحجز:</span>
                    <span className="text-2xl font-black text-[#2D6A5F]">${totalPrice} USD</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full rounded-2xl bg-[#3FAF9B] py-4 text-white font-black hover:bg-[#2F8E7D] transition disabled:bg-gray-300"
              >
                {loading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
              </button>

            </div>
          )}

        </div>
      </div>

      {/* عارض الصور المطور Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4">
          {/* زر الإغلاق */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 left-6 text-white/80 hover:text-white font-bold text-2xl z-10"
          >
            ✕
          </button>

          {/* زر السابق */}
          {images.length > 1 && (
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-xl shadow z-10 transition"
            >
              ❯
            </button>
          )}

          {/* الصورة المعروضة */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center p-4">
            <img
              src={images[activeImageIndex]}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl select-none animate-in zoom-in-95 duration-200"
              alt="معرض صور العقار"
            />
            {/* مؤشر الصفحة */}
            <p className="text-white/60 text-sm font-bold mt-4">
              صورة {activeImageIndex + 1} من {images.length}
            </p>
          </div>

          {/* زر التالي */}
          {images.length > 1 && (
            <button
              onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-xl shadow z-10 transition"
            >
              ❮
            </button>
          )}
        </div>
      )}
      {/* شريط الحجز العائم للموبايل فقط */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-5 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold">السعر لليلة</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#2D6A5F]">${property.price}</span>
            <span className="text-[10px] text-gray-500">USD</span>
          </div>
        </div>
        <button
          onClick={() => {
            setViewMode("book");
            setTimeout(() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }, 100);
          }}
          className="bg-[#3FAF9B] text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md hover:bg-[#2F8E7D] transition-all"
        >
          {viewMode === "book" ? "أدخل بياناتك بالأسفل" : "احجز الآن"}
        </button>
      </div>

    </main>
  );
}
