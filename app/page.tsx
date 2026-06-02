"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const governorates = [
  "دمشق", "ريف دمشق", "حلب", "إدلب", "اللاذقية", "طرطوس",
  "حمص", "حماة", "السويداء", "درعا", "القنيطرة",
  "دير الزور", "الحسكة", "الرقة"
];

const propertyTypes = [
  "شقة", "فيلا", "مزرعة", "غرفة", "شاليه"
];

const filterAmenities = [
  { label: "🏊 مسبح", value: "مسبح" },
  { label: "☀️ طاقة شمسية", value: "طاقة شمسية" },
  { label: "❄️ مكيف", value: "مكيف" },
  { label: "🌐 إنترنت", value: "إنترنت" },
  { label: "🚰 مياه إضافية", value: "خزان مياه" }
];


export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestsCount, setGuestsCount] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // تحميل المفضلة عند التشغيل
  useEffect(() => {
    const saved = localStorage.getItem("yallahala_wishlist");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // إضافة أو إزالة من المفضلة
  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    let updated = [];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("yallahala_wishlist", JSON.stringify(updated));
  };

  const propertiesToDisplay = showFavoritesOnly
    ? properties.filter((p) => favorites.includes(p.id))
    : properties;

  // إعادة تحميل تلقائي عند تغيير الفلاتر السريعة
  useEffect(() => {
    loadProperties();
  }, [selectedGovernorate, selectedType, selectedAmenity]);

  // 🛠️ الهندسة الذكية المحدثة لمنع الحجوزات المزدوجة وإخفاء العقار المحجوز تلقائياً
  async function loadProperties() {
    setLoading(true);
    try {
      let bookedPropertyIds: string[] = [];

      // 1. إذا حدد المستخدم تاريخ وصول ومغادرة، نبحث أولاً عن العقارات المشغولة
      if (checkInDate && checkOutDate) {
        const { data: overlappedBookings, error: bookingError } = await supabase
          .from("bookings")
          .select("property_id")
          .eq("status", "confirmed") // الحجوزات المقبولة والمؤكدة من الإدارة فقط
          .or(`check_in.lte.${checkOutDate},check_out.gte.${checkInDate}`);

        if (!bookingError && overlappedBookings) {
          // استخراج الـ IDs الفريدة للعقارات المحجوزة في هذه الفترة
          bookedPropertyIds = overlappedBookings.map((b: any) => String(b.property_id));
        }
      }

      // 2. بناء استعلام جلب العقارات المعتمد
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "approved") // العقارات المعتمدة من الإدارة فقط
        .order("created_at", { ascending: false });

      // فلاتر المحافظة والنوع العادية
      if (selectedGovernorate) {
        query = query.eq("governorate", selectedGovernorate);
      }
      if (selectedType) {
        query = query.eq("type", selectedType);
      }
      // فلتر الخدمات السريع
      if (selectedAmenity) {
        query = query.ilike("amenities", `%${selectedAmenity}%`);
      }

      // 3. السحر التقني: إذا كان هناك عقارات محجوزة ومستخرجة، نقوم باستبعادها كلياً من القائمة (NOT IN)
      if (bookedPropertyIds.length > 0) {
        query = query.not("id", "in", `(${bookedPropertyIds.join(",")})`);
      }

      const { data, error } = await query;
      if (!error && data) {
        setProperties(data);
      }
    } catch (err) {
      console.error("خطأ أثناء فلترة وجلب العقارات المتاحة:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]" dir="rtl">

      {/* ترحيب البطل */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8 text-center relative z-10">
        <span className="inline-block rounded-full bg-[#E6F4F1] px-5 py-2 text-sm font-bold text-[#3FAF9B] mb-4 shadow-sm">
          منصة يلا هلا السياحية
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] leading-tight">
          احجز مكانك المثالي في سوريا مع يلا هلا
        </h1>
        <p className="mt-4 text-xl font-bold text-[#CF9E59]">
          "بيتك البعيد عن بيتك"
        </p>
        <p className="mt-2 text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto">
          استكشف شققاً، فيلات، وشاليهات سياحية في جميع المحافظات السورية بأفضل الأسعار.
        </p>
      </section>

      {/* شريط البحث المطور */}
      <section className="max-w-6xl mx-auto px-4 mb-16 relative z-20">
        <div className="bg-[#2D6A5F] p-5 rounded-[28px] shadow-xl">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-center">

            {/* 1. زر البحث */}
            <div className="lg:col-span-2">
              <button
                onClick={loadProperties}
                className="w-full h-12 bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition duration-200 text-sm shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                ابحث الآن
              </button>
            </div>

            {/* 2. عدد الضيوف */}
            <div className="lg:col-span-2 bg-white rounded-xl px-3 h-12 flex items-center shadow-sm">
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-transparent text-right text-xs sm:text-sm text-[#4B5563] font-medium outline-none cursor-pointer"
              >
                <option value="">عدد الضيوف</option>
                <option value="1">ضيف واحد</option>
                <option value="2">ضيفين</option>
                <option value="3">3 ضيوف</option>
                <option value="4">4+ ضيوف</option>
              </select>
            </div>

            {/* 3. تاريخ الوصول */}
            <div className="lg:col-span-2 bg-white rounded-xl px-3 h-12 flex flex-col justify-center shadow-sm">
              <span className="text-[9px] text-gray-400 text-right font-bold">تاريخ الوصول</span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-right text-xs text-[#4B5563] outline-none cursor-pointer"
              />
            </div>

            {/* 4. تاريخ المغادرة */}
            <div className="lg:col-span-2 bg-white rounded-xl px-3 h-12 flex flex-col justify-center shadow-sm">
              <span className="text-[9px] text-gray-400 text-right font-bold">تاريخ المغادرة</span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-right text-xs text-[#4B5563] outline-none cursor-pointer"
              />
            </div>

            {/* 5. نوع العقار */}
            <div className="lg:col-span-2 bg-white rounded-xl px-3 h-12 flex items-center shadow-sm">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-right text-xs sm:text-sm text-[#4B5563] font-medium outline-none cursor-pointer"
              >
                <option value="">نوع العقار</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* 6. المدينة / المنطقة */}
            <div className="lg:col-span-2 bg-white rounded-xl px-3 h-12 flex items-center shadow-sm">
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full bg-transparent text-right text-xs sm:text-sm text-[#4B5563] font-medium outline-none cursor-pointer"
              >
                <option value="">المدينة/المنطقة</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* أزرار التصفية السريعة (Filter Chips) */}
      <section className="max-w-6xl mx-auto px-4 mb-10 text-right -mt-8 relative z-20">
        <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-center">
          <span className="text-xs font-bold text-gray-500 ml-1.5 hidden sm:inline">تصفية سريعة:</span>
          {filterAmenities.map((amenity) => {
            const isSelected = selectedAmenity === amenity.value;
            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() => {
                  setSelectedAmenity(isSelected ? "" : amenity.value);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm border ${
                  isSelected
                    ? "bg-[#3FAF9B] border-[#3FAF9B] text-white scale-105"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {amenity.label}
              </button>
            );
          })}
          {selectedAmenity && (
            <button
              onClick={() => setSelectedAmenity("")}
              className="text-xs font-bold text-red-500 hover:text-red-600 mr-2 hover:underline"
            >
              إلغاء التصفية ✕
            </button>
          )}

          {/* زر تصفية المفضلة */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm border flex items-center gap-1.5 ${
              showFavoritesOnly
                ? "bg-red-500 border-red-500 text-white scale-105"
                : "bg-white border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100"
            }`}
          >
            ❤️ المفضلة ({favorites.length})
          </button>
        </div>
      </section>

      {/* عرض شبكة البطاقات */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 relative z-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold text-[#111827]">العقارات المتاحة للطلب</h2>
          <p className="text-xs font-bold text-[#6B7280]">المكتشفة: {propertiesToDisplay.length}</p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-base font-bold text-[#3FAF9B] animate-pulse">جاري جلب عقارات يلا هلا...</div>
        ) : propertiesToDisplay.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-[#111827]">لا يوجد عقارات متاحة حالياً</h3>
            <p className="mt-2 text-sm text-[#6B7280]">يرجى تعديل تواريخ البحث أو المحاولة مجدداً في وقت لاحق.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {propertiesToDisplay.map((property) => (
              <article key={property.id} className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between relative group">
                <div className="relative">
                  <img
                    src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
                    alt={property.title}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-[#E6F4F1] text-[#3FAF9B] px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/20">
                    {property.type}
                  </span>

                  {/* شارة الطاقة الشمسية إن وجدت */}
                  {property.amenities?.includes("طاقة شمسية") && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1 border border-white/20">
                      ☀️ طاقة شمسية
                    </span>
                  )}

                  {/* زر المفضلة */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, property.id)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow flex items-center justify-center transition-all z-10 duration-200"
                  >
                    <span className={`text-sm transition-transform duration-200 hover:scale-125 ${favorites.includes(property.id) ? "text-red-500" : "text-gray-400"}`}>
                      {favorites.includes(property.id) ? "❤️" : "🤍"}
                    </span>
                  </button>
                </div>

                <div className="p-5 text-right flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-end gap-1 mb-1">
                      <span className="text-xl font-black text-[#CF9E59]">${property.price}</span>
                      <span className="text-[10px] text-gray-400">/ ليلة</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] line-clamp-1">{property.title}</h3>
                    <p className="mt-1 text-xs text-[#6B7280]">{property.location}</p>

                    {/* مواصفات سريعة للعقار */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 font-bold justify-start flex-row-reverse border-t border-gray-50 pt-2.5">
                      {property.rooms_count && <span>🚪 {property.rooms_count} غرف</span>}
                      {property.beds_count && <span>🛏️ {property.beds_count} أسرة</span>}
                      {property.bathrooms_count && <span>🛁 {property.bathrooms_count} حمامات</span>}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/property/${property.id}`}
                      className="rounded-xl border border-[#3FAF9B] text-[#3FAF9B] font-bold py-2 text-center text-xs hover:bg-[#F2FAF8] transition"
                    >
                      التفاصيل
                    </Link>
                    <Link
                      href={`/property/${property.id}?action=book`}
                      className="rounded-xl bg-[#3FAF9B] text-white font-bold py-2 text-center text-xs hover:bg-[#2F8E7D] transition shadow-sm"
                    >
                      احجز الآن
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
