"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";


// مكون تقويم الحجوزات التفاعلي المرئي
function PropertyCalendar({
  existingBookings,
  checkIn,
  checkOut,
  onSelectDate,
  price
}: {
  existingBookings: any[];
  checkIn: string;
  checkOut: string;
  onSelectDate: (dateStr: string) => void;
  price: number;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
    "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];
    
    const isPast = dateStr < todayStr;
    
    let isBooked = false;
    for (const booking of existingBookings) {
      if (dateStr >= booking.check_in && dateStr <= booking.check_out) {
        isBooked = true;
        break;
      }
    }

    const isSelected = dateStr === checkIn || dateStr === checkOut;
    
    let isInRange = false;
    if (checkIn && checkOut && dateStr > checkIn && dateStr < checkOut) {
      isInRange = true;
    }

    return { isPast, isBooked, isSelected, isInRange, dateStr };
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm text-right max-w-md mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-4 flex-row-reverse">
        <h3 className="font-bold text-gray-800 text-sm">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg bg-gray-50 border hover:bg-gray-100 flex items-center justify-center font-bold text-xs"
          >
            ❯
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg bg-gray-50 border hover:bg-gray-100 flex items-center justify-center font-bold text-xs"
          >
            ❮
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 mb-2">
        <span>أحد</span>
        <span>اثنين</span>
        <span>ثلاثاء</span>
        <span>أربعاء</span>
        <span>خميس</span>
        <span>جمعة</span>
        <span>سبت</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const { isPast, isBooked, isSelected, isInRange, dateStr } = getDayStatus(date);
          const dayNum = date.getDate();

          let btnClass = "w-full aspect-square rounded-xl text-[11px] font-bold transition flex items-center justify-center flex-col ";
          
          if (isPast) {
            btnClass += "bg-gray-50 text-gray-350 cursor-not-allowed opacity-40";
          } else if (isBooked) {
            btnClass += "bg-red-50 text-red-600 border border-red-100/50 cursor-not-allowed line-through";
          } else if (isSelected) {
            btnClass += "bg-[#2D6A5F] text-white shadow-sm scale-105";
          } else if (isInRange) {
            btnClass += "bg-[#E6F4F1] text-[#2D6A5F] font-black";
          } else {
            btnClass += "bg-emerald-50/50 hover:bg-[#F2FAF8] text-[#166534] border border-emerald-100/30 cursor-pointer";
          }

          return (
            <button
              key={`day-${index}`}
              type="button"
              disabled={isPast || isBooked}
              onClick={() => onSelectDate(dateStr)}
              className={btnClass}
              title={isBooked ? "محجوز بالفعل" : isPast ? "تاريخ مضى" : `اضغط للاختيار: ${dateStr}`}
            >
              <span>{dayNum}</span>
              {isSelected && dateStr === checkIn && <span className="text-[7px] leading-none mt-0.5">وصول</span>}
              {isSelected && dateStr === checkOut && <span className="text-[7px] leading-none mt-0.5">مغادرة</span>}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center items-center mt-5 text-[10px] font-bold text-gray-500 border-t pt-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-100 block"></span>
          <span>متاح</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-100 block"></span>
          <span>محجوز</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[#2D6A5F] block"></span>
          <span>محدد</span>
        </div>
      </div>
    </div>
  );
}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastBookingInfo, setLastBookingInfo] = useState<any>(null);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [bookingType, setBookingType] = useState<"nightly" | "12h">("nightly");

  useEffect(() => {
    setCheckIn("");
    setCheckOut("");
  }, [bookingType]);

  const [triedBookingSubmit, setTriedBookingSubmit] = useState(false);
  const [triedReviewSubmit, setTriedReviewSubmit] = useState(false);

  const getBookingInputClass = (val: string) => {
    const base = "rounded-2xl border px-4 py-4 w-full text-right outline-none transition-all duration-200 ";
    if (triedBookingSubmit && (!val || !val.trim())) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-gray-200 focus:border-[#3FAF9B]";
  };

  const getReviewInputClass = (val: string, isTextArea = false) => {
    const base = `${isTextArea ? "w-full min-h-[80px]" : ""} rounded-xl border bg-white px-4 py-2.5 text-right text-xs outline-none transition-all duration-200 `;
    if (triedReviewSubmit && (!val || !val.trim())) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  const handleSelectCalendarDate = (dateStr: string) => {
    if (bookingType === "12h") {
      setCheckIn(dateStr);
      setCheckOut(dateStr);
    } else {
      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(dateStr);
        setCheckOut("");
      } else {
        if (dateStr > checkIn) {
          if (isDatesOverlapping(checkIn, dateStr)) {
            alert("⚠️ لا يمكن اختيار هذه الفترة لوجود أيام محجوزة داخلها.");
            return;
          }
          setCheckOut(dateStr);
        } else {
          setCheckIn(dateStr);
        }
      }
    }
  };

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    setTriedReviewSubmit(true);
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert("⚠️ يرجى تعبئة جميع الحقول لإضافة تقييمك.");
      
      setTimeout(() => {
        const firstInvalid = document.querySelector(".border-red-500");
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          (firstInvalid as HTMLElement).focus?.();
        }
      }, 100);
      return;
    }

    try {
      setSubmittingReview(true);

      const newReview = {
        guestName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: new Date().toISOString()
      };

      const currentReviews = property.images ? [...property.images] : [];
      const updatedReviews = [...currentReviews, JSON.stringify(newReview)];

      const { error } = await supabase
        .from("properties")
        .update({ images: updatedReviews })
        .eq("id", property.id);

      if (error) {
        throw error;
      }

      setProperty({
        ...property,
        images: updatedReviews
      });

      alert("🎉 شكراً لك! تم إضافة تقييمك بنجاح.");
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      console.error("Add Review Error:", err);
      alert("حدث خطأ أثناء إضافة تقييمك، يرجى المحاولة لاحقاً.");
    } finally {
      setSubmittingReview(false);
    }
  }

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

      if (booking.check_in === booking.check_out || newIn === newOut) {
        if (startNew <= endExisting && endNew >= startExisting) {
          return true;
        }
      } else {
        if (
          startNew <
            endExisting &&
          endNew >
            startExisting
        ) {
          return true;
        }
      }
    }

    return false;
  }

  async function sendTelegramNotification(
    name: string,
    phone: string,
    inDate: string,
    outDate: string,
    bType: "nightly" | "12h",
    tPrice: number
  ) {
    try {
      const cleanPhone =
        property?.owner_phone
          ?.replace(
            /\D/g,
            ""
          ) || "";

      const formattedPrice = property?.longitude === 1 ? `${Number(tPrice).toLocaleString()} ل.س` : `$${tPrice} USD`;

      const whatsappMessage =
        `مرحباً ${property?.owner_name || ""} 👋\n\n` +
        `يوجد طلب حجز جديد على عقارك:\n\n` +
        `🏠 ${property?.title}\n` +
        (bType === "12h"
          ? `📅 تاريخ الإقامة: يوم ${inDate} (إيجار 12 ساعة - نصف يوم)\n\n`
          : `📅 من ${inDate} إلى ${outDate} (مبيت)\n\n`) +
        `👤 اسم المستأجر: ${name}\n` +
        `📞 رقم المستأجر: ${phone}\n` +
        `💰 السعر المقدر: ${formattedPrice}`;

      const whatsappLink =
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      const messageText =
        `🚨 طلب حجز جديد\n\n` +
        `🏠 العقار:\n${property?.title || ""}\n\n` +
        `📍 الموقع:\n${property?.location || ""}\n\n` +
        `👤 المستأجر:\n${name}${bType === "12h" ? " (إيجار 12 ساعة)" : ""}\n\n` +
        `📞 الهاتف:\n${phone}\n\n` +
        `📅 نوع الحجز:\n${bType === "12h" ? "إيجار 12 ساعة (نصف يوم)" : "مبيت كامل (ليلة)"}\n\n` +
        (bType === "12h"
          ? `📅 تاريخ الإقامة:\n${inDate}\n\n`
          : `📅 الوصول:\n${inDate}\n\n📅 المغادرة:\n${outDate}\n\n`) +
        `💰 السعر الإجمالي: ${formattedPrice}\n\n` +
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
    setTriedBookingSubmit(true);

    if (
      !guestName.trim() ||
      !guestPhone.trim() ||
      !checkIn ||
      !checkOut
    ) {
      alert(
        "يرجى تعبئة جميع البيانات وتحديد تواريخ الإقامة على التقويم."
      );

      setTimeout(() => {
        const firstInvalid = document.querySelector(".border-red-500");
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          (firstInvalid as HTMLElement).focus?.();
        }
      }, 100);

      return;
    }

    const checkInDate =
      new Date(checkIn);

    const checkOutDate =
      new Date(checkOut);

    if (
      bookingType !== "12h" &&
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
                bookingType === "12h"
                  ? `${guestName.trim()} (إيجار 12 ساعة)`
                  : guestName.trim(),

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
        checkOut,
        bookingType,
        totalPrice
      );

      setLastBookingInfo({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        checkIn,
        checkOut,
        bookingType
      });

      setShowSuccessModal(true);

      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");
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
    if (bookingType === "12h") {
      totalPrice = property?.latitude || 0;
    } else {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalPrice = nights * (property?.price || 0);
      }
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
                <img src={image} className="w-full h-full object-cover" alt={`${property.title} - ${index + 1}`} loading="lazy" />
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
                <img src={images[1]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} loading="lazy" />
              </div>
            </div>
          )}

          {images.length >= 3 && (
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[450px] w-full rounded-3xl overflow-hidden cursor-pointer relative">
              <div className="col-span-2 row-span-2 h-full overflow-hidden border" onClick={() => openLightbox(0)}>
                <img src={images[0]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} />
              </div>
              <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(1)}>
                <img src={images[1]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} loading="lazy" />
              </div>
              <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(2)}>
                <img src={images[2]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} loading="lazy" />
              </div>
              {images.length >= 4 ? (
                <div className="col-span-1 h-full overflow-hidden border" onClick={() => openLightbox(3)}>
                  <img src={images[3]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} loading="lazy" />
                </div>
              ) : (
                <div className="col-span-1 h-full bg-gray-50 border flex items-center justify-center text-gray-400 font-bold text-sm">
                  لا يوجد صور إضافية
                </div>
              )}
              {images.length >= 5 ? (
                <div className="col-span-1 h-full overflow-hidden border relative" onClick={() => openLightbox(4)}>
                  <img src={images[4]} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt={property.title} loading="lazy" />
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

              {/* شارة متوسط التقييم */}
              <div className="flex items-center gap-1.5 mt-2 flex-row-reverse justify-end">
                {(() => {
                  let revList: any[] = [];
                  if (property.images && Array.isArray(property.images)) {
                    try {
                      revList = property.images.map((r: string) => JSON.parse(r));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  if (revList.length > 0) {
                    const avg = (revList.reduce((acc, curr) => acc + curr.rating, 0) / revList.length).toFixed(1);
                    return (
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                        <span className="text-amber-500">★</span>
                        <span>{avg}</span>
                        <span className="text-[10px] text-gray-400 font-medium">({revList.length} تقييم)</span>
                      </div>
                    );
                  } else {
                    return (
                      <span className="text-[10px] font-black bg-[#E6F4F1] text-[#3FAF9B] px-2.5 py-0.5 rounded-md">
                        ⭐ جديد
                      </span>
                    );
                  }
                })()}
              </div>

            </div>

            <div className="rounded-2xl bg-[#E6F4F1] px-6 py-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-[#2D6A5F]">
                {property.longitude === 1 ? `${Number(property.price).toLocaleString()} ل.س` : `$${property.price}`}
              </p>
              <p className="text-xs mt-1 font-semibold">
                {property.longitude === 1 ? "ليرة سورية" : "USD"} / ليلة
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

                {/* أوقات الدخول والخروج */}
                {(property.address || property.city) && (
                  <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4 flex items-center justify-around text-center gap-4">
                    {property.address && (
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 block mb-0.5">🕒 وقت الدخول (Check-in)</span>
                        <span className="text-sm sm:text-base font-black text-[#2D6A5F]">{property.address}</span>
                      </div>
                    )}
                    {(property.address && property.city) && <div className="h-6 w-[1px] bg-gray-200"></div>}
                    {property.city && (
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 block mb-0.5">🕒 وقت الخروج (Check-out)</span>
                        <span className="text-sm sm:text-base font-black text-[#2D6A5F]">{property.city}</span>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* تقويم الحجوزات التفاعلي المرئي */}
              <section className="pt-8 border-t border-gray-100 text-right">
                <h2 className="text-2xl font-black mb-4">📅 تقويم توفر العقار والحجز المباشر</h2>
                <p className="text-xs text-gray-500 mb-5">
                  انقر على تاريخ وصولك ثم تاريخ مغادرتك لتحديد تواريخ الإقامة وحساب الإجمالي فورياً:
                </p>
                <PropertyCalendar
                  existingBookings={existingBookings}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDate={handleSelectCalendarDate}
                  price={property.price}
                />
              </section>

              {/* قسم التقييمات والآراء */}
              <section className="pt-8 border-t border-gray-100 text-right">
                <h2 className="text-2xl font-black mb-6">التقييمات وآراء النزلاء ⭐️</h2>
                
                {/* قائمة الآراء */}
                {(() => {
                  let reviewsList: any[] = [];
                  if (property.images && Array.isArray(property.images)) {
                    try {
                      reviewsList = property.images.map((r: string) => JSON.parse(r));
                    } catch (e) {
                      console.error(e);
                    }
                  }

                  return (
                    <div className="space-y-4">
                      {reviewsList.length === 0 ? (
                        <p className="text-xs text-gray-500 bg-gray-50 p-6 rounded-2xl text-center font-semibold">
                          لا توجد تقييمات لهذا العقار بعد. كن أول من يضيف تقييماً! ✍️
                        </p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {reviewsList.map((rev, index) => (
                            <div key={index} className="bg-gray-50/50 border rounded-2xl p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2 flex-row-reverse">
                                  <span className="font-bold text-xs text-gray-900">{rev.guestName}</span>
                                  <span className="text-xs text-amber-500">
                                    {"★".repeat(rev.rating)}
                                    {"☆".repeat(5 - rev.rating)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                              </div>
                              <div className="text-[9px] text-gray-400 mt-3 text-left">
                                {new Date(rev.createdAt).toLocaleDateString("ar-SY", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric"
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* نموذج إضافة تقييم */}
                <form onSubmit={handleAddReview} className="bg-[#F9FAFB] rounded-3xl border border-gray-100 p-5 sm:p-6 mt-8 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">أضف تقييمك وتجربتك ✍️</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="اسمك الكامل"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className={getReviewInputClass(reviewName)}
                    />
                    <div className="flex items-center justify-start gap-2 flex-row-reverse">
                      <span className="text-xs font-bold text-gray-500">التقييم:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`text-xl transition-all ${
                              star <= reviewRating ? "text-amber-500" : "text-gray-300 hover:text-amber-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    placeholder="اكتب تجربتك بالتفصيل..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className={getReviewInputClass(reviewComment, true)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#2D6A5F] hover:bg-[#205149] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow disabled:bg-gray-300"
                    >
                      {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                    </button>
                  </div>
                </form>
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
                className={getBookingInputClass(guestName)}
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
                className={getBookingInputClass(guestPhone)}
              />

              {/* خيار نوع الإقامة إذا كان مدعوماً */}
              {property.latitude && property.latitude > 0 && (
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-gray-700">نوع الإقامة المطلوبة:</span>
                  <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setBookingType("nightly")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        bookingType === "nightly"
                          ? "bg-white text-[#2D6A5F] shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      🏨 مبيت كامل (بالليلة)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("12h")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        bookingType === "12h"
                          ? "bg-[#2D6A5F] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      ☀️ إيجار 12 ساعة (نصف يوم)
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                    * سعر المبيت بالليلة: <span className="font-bold text-[#2D6A5F]">{property.longitude === 1 ? `${Number(property.price).toLocaleString()} ل.س` : `$${property.price} USD`}</span> | سعر الـ 12 ساعة: <span className="font-bold text-[#2D6A5F]">{property.longitude === 1 ? `${Number(property.latitude).toLocaleString()} ل.س` : `$${property.latitude} USD`}</span>
                  </p>
                </div>
              )}

              {/* اختيار التواريخ من التقويم مباشرة */}
              <div
                tabIndex={0}
                className={`border rounded-3xl p-5 bg-gray-50/50 space-y-4 transition-all duration-200 outline-none ${
                  triedBookingSubmit && (!checkIn || !checkOut) ? "border-red-500 bg-red-50/5 focus:ring-2 focus:ring-red-500" : "border-gray-100 focus:ring-2 focus:ring-[#3FAF9B]"
                }`}
              >
                <div className="text-right">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {bookingType === "12h" ? "📅 اختر يوم إيجار الـ 12 ساعة:" : "📅 حدد فترة إقامتك على التقويم:"}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {bookingType === "12h"
                      ? "انقر على اليوم الذي تريد حجزه لـ 12 ساعة (الأخضر متاح، والأحمر محجوز)."
                      : "انقر على يوم وصولك (أخضر)، ثم يوم مغادرتك لتحديد التواريخ."}
                  </p>
                </div>
                
                <PropertyCalendar
                  existingBookings={existingBookings}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDate={handleSelectCalendarDate}
                  price={property.price}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">
                      {bookingType === "12h" ? "📅 يوم الإيجار" : "📅 تاريخ الوصول"}
                    </span>
                    {checkIn ? (
                      <span className="text-xs font-black text-[#2D6A5F]">{checkIn}</span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">بانتظار التحديد...</span>
                    )}
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">
                      {bookingType === "12h" ? "📅 يوم الإيجار" : "📅 تاريخ المغادرة"}
                    </span>
                    {checkOut ? (
                      <span className="text-xs font-black text-[#2D6A5F]">{checkOut}</span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">بانتظار التحديد...</span>
                    )}
                  </div>
                </div>

                {(checkIn || checkOut) && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn("");
                        setCheckOut("");
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
                    >
                      ✕ إعادة تعيين التواريخ
                    </button>
                  </div>
                )}
              </div>

              {/* حاسبة الأسعار الديناميكية */}
              {((bookingType === "nightly" && nights > 0) || (bookingType === "12h" && checkIn)) && (
                <div className="bg-[#F8FFFD] border border-[#D1FAE5] p-5 rounded-2xl text-right flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>نوع الحجز:</span>
                    <span className="font-bold text-[#111827]">
                      {bookingType === "12h" ? "إيجار 12 ساعة (نصف يوم)" : `مبيت (${nights} ليالٍ)`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>سعر الوحدة:</span>
                    <span className="font-bold text-[#111827]">
                      {property.longitude === 1 
                        ? `${Number(bookingType === "12h" ? property.latitude : property.price).toLocaleString()} ل.س` 
                        : `$${bookingType === "12h" ? property.latitude : property.price} USD`}
                    </span>
                  </div>
                  <div className="border-t border-[#D1FAE5] pt-2.5 flex justify-between items-center">
                    <span className="text-base font-bold text-[#166534]">الإجمالي المقدر للحجز:</span>
                    <span className="text-2xl font-black text-[#2D6A5F]">
                      {property.longitude === 1 ? `${totalPrice.toLocaleString()} ل.س` : `$${totalPrice} USD`}
                    </span>
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
            {property.longitude === 1 ? (
              <>
                <span className="text-xl font-black text-[#2D6A5F]">{Number(property.price).toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 font-bold mr-1">ل.س</span>
              </>
            ) : (
              <>
                <span className="text-xl font-black text-[#2D6A5F]">${property.price}</span>
                <span className="text-[10px] text-gray-500">USD</span>
              </>
            )}
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

      {/* مودال نجاح الحجز وتوجيه الواتساب للمؤجر */}
      {showSuccessModal && lastBookingInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
          <div className="w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 text-3xl font-bold mb-4">
              ✓
            </div>
            <h3 className="text-2xl font-black text-gray-900">تم تقديم طلبك بنجاح!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              تم إرسال طلب حجزك للإدارة. لتسريع عملية تأكيد وتثبيت الحجز، يرجى التواصل مع صاحب العقار مباشرة عبر الواتساب لتنسيق التفاصيل والدفع:
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 my-5 text-right text-xs space-y-1.5 text-gray-600">
              <div>🏠 <span className="font-bold text-gray-900">العقار:</span> {property.title}</div>
              <div>📅 <span className="font-bold text-gray-900">تاريخ الإقامة:</span> {lastBookingInfo.bookingType === "12h" ? `يوم ${lastBookingInfo.checkIn} (إيجار 12 ساعة - نصف يوم)` : `من ${lastBookingInfo.checkIn} إلى ${lastBookingInfo.checkOut}`}</div>
              <div>👤 <span className="font-bold text-gray-900">الاسم:</span> {lastBookingInfo.guestName}</div>
            </div>
            <div className="space-y-3">
              <a
                href={(() => {
                  if (!lastBookingInfo || !property) return "#";
                  let cleanPhone = property.owner_phone ? property.owner_phone.replace(/\D/g, "") : "";
                  if (cleanPhone.startsWith("09")) {
                    cleanPhone = "963" + cleanPhone.substring(1);
                  } else if (cleanPhone.startsWith("9") && !cleanPhone.startsWith("963")) {
                    cleanPhone = "963" + cleanPhone;
                  }
                  const message = 
                    `مرحباً ${property.owner_name || "صاحب العقار"} 👋\n\n` +
                    `لقد قمت بطلب حجز عقارك [ ${property.title} ] عبر منصة يلا هلا السياحية، وأود التنسيق معك بخصوص التفاصيل والدفع:\n\n` +
                    `👤 اسم المستأجر: ${lastBookingInfo.guestName}\n` +
                    `📞 هاتف المستأجر: ${lastBookingInfo.guestPhone}\n` +
                    (lastBookingInfo.bookingType === "12h"
                      ? `📅 تاريخ الإقامة: يوم ${lastBookingInfo.checkIn} (إيجار 12 ساعة - نصف يوم)\n`
                      : `📅 تاريخ الوصول: ${lastBookingInfo.checkIn}\n📅 تاريخ المغادرة: ${lastBookingInfo.checkOut}\n`) +
                    `💰 السعر المقدر: ${property.longitude === 1 ? `${totalPrice.toLocaleString()} ل.س` : `$${totalPrice} USD`}`;
                  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-13 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg duration-200"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.386 9.805-9.79.002-2.618-1.01-5.079-2.859-6.93C16.37 2.05 13.91 1.037 11.29 1.037c-5.4.002-9.799 4.393-9.802 9.794-.001 1.705.462 3.37 1.337 4.815L1.817 22.03l6.59-1.745zM17.03 14.537c-.275-.137-1.62-.8-1.87-.892-.252-.093-.437-.137-.62.137-.183.275-.71.892-.87 1.077-.16.183-.32.205-.595.068-.275-.137-1.162-.428-2.214-1.366-.818-.73-1.37-1.632-1.53-1.905-.16-.275-.017-.424.12-.56.124-.124.275-.32.413-.48.137-.16.183-.275.275-.457.093-.183.047-.343-.023-.48-.068-.137-.62-1.492-.85-2.043-.224-.537-.474-.464-.649-.473-.167-.008-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4s1 2.79 1.12 2.95c.12.16 1.97 3.01 4.77 4.22.67.29 1.19.46 1.59.59.67.21 1.28.18 1.77.11.54-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.12-.26-.19-.54-.33z"/></svg>
                مراسلة صاحب العقار لتثبيت الحجز
              </a>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setLastBookingInfo(null);
                  setViewMode("details");
                }}
                className="w-full h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
              >
                إغلاق والعودة للتفاصيل
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
