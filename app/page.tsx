"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { ssr: false });

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
  const [maxPrice, setMaxPrice] = useState(250);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const [displayLimit, setDisplayLimit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState("newest");

  // تحميل بيانات المستخدم الحالية لمنع إظهار زر التسجيل للمسجلين بالفعل
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
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

  const basePropertiesToDisplay = showFavoritesOnly
    ? properties.filter((p) => favorites.includes(p.id))
    : properties;

  const propertiesToDisplay = [...basePropertiesToDisplay].sort((a, b) => {
    if (sortBy === "price_asc") {
      return Number(a.price) - Number(b.price);
    } else if (sortBy === "price_desc") {
      return Number(b.price) - Number(a.price);
    } else if (sortBy === "rating_desc") {
      const getAvgRating = (prop: any) => {
        let reviewsList: any[] = [];
        if (prop.images && Array.isArray(prop.images)) {
          try {
            reviewsList = prop.images.map((r: string) => JSON.parse(r));
          } catch (e) {
            console.error(e);
          }
        }
        if (reviewsList.length === 0) return 0;
        return reviewsList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewsList.length;
      };
      return getAvgRating(b) - getAvgRating(a);
    }
    return 0;
  });

  // إعادة تحميل تلقائي عند تغيير الفلاتر السريعة
  useEffect(() => {
    setDisplayLimit(12);
    loadProperties(12);
  }, [selectedGovernorate, selectedType, selectedAmenity, maxPrice]);

  // 🛠️ الهندسة الذكية المحدثة لمنع الحجوزات المزدوجة وإخفاء العقار المحجوز تلقائياً
  async function loadProperties(currentLimit = displayLimit) {
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

      // 2. بناء استعلام جلب العقارات المعتمد - تحديد الأعمدة لمنع البطء والتحميل الزائد للبيانات
      let query = supabase
        .from("properties")
        .select("id, title, location, price, image, type, governorate, rooms_count, beds_count, bathrooms_count, longitude, amenities, images, rooms")
        .eq("status", "approved") // العقارات المعتمدة من الإدارة فقط
        .order("created_at", { ascending: false })
        .limit(currentLimit + 1);

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
      // فلتر السعر الأقصى
      if (maxPrice < 250) {
        query = query.or(`price.lte.${maxPrice},longitude.eq.1`);
      }

      // 3. السحر التقني: إذا كان هناك عقارات محجوزة ومستخرجة، نقوم باستبعادها كلياً من القائمة (NOT IN)
      if (bookedPropertyIds.length > 0) {
        query = query.not("id", "in", `(${bookedPropertyIds.join(",")})`);
      }

      const { data, error } = await query;
      if (!error && data) {
        if (data.length > currentLimit) {
          setProperties(data.slice(0, currentLimit));
          setHasMore(true);
        } else {
          setProperties(data);
          setHasMore(false);
        }
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
        
        {/* أزرار الحث على الإجراء (CTAs) ثنائية التوجه */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <button
            onClick={() => {
              const element = document.getElementById("search-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="rounded-full bg-[#2D6A5F] hover:bg-[#204e46] text-white font-bold px-6 py-3.5 text-sm transition shadow-sm cursor-pointer"
          >
            🔍 ابحث واحجز الآن
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById("owners-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="rounded-full bg-white hover:bg-gray-50 text-[#2D6A5F] border border-[#2D6A5F]/20 font-bold px-6 py-3.5 text-sm transition shadow-xs cursor-pointer"
          >
            📈 اعرض عقارك معنا مجاناً
          </button>
        </div>
      </section>

      {/* كارت تسجيل الحساب السريع للموبايل (يظهر فقط إذا كان المستخدم غير مسجل دخول وعلى الهواتف) */}
      {!user && (
        <div className="md:hidden mx-4 mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#CF9E59]/10 to-[#2D6A5F]/10 border border-[#CF9E59]/25 text-right flex flex-col gap-3 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 text-lg shrink-0">
              ✨
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-950">أنشئ حسابك المجاني في دقيقة!</h3>
              <p className="text-[11px] text-gray-500 font-bold mt-1 leading-4">
                سجل الآن لتتمكن من حجز الشاليهات والمزارع بسهولة، أو لعرض عقارك السياحي والبدء في استقبال الحجوزات والطلبات.
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="w-full text-center bg-[#CF9E59] hover:bg-[#b58543] text-white font-black text-xs py-3.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>👤 إنشاء حساب جديد مجاناً</span>
          </Link>
          <div className="text-center border-t border-gray-100 pt-2.5">
            <span className="text-[10px] text-gray-400 font-bold">
              لديك حساب بالفعل؟ <Link href="/login" className="text-[#2D6A5F] underline hover:text-[#3FAF9B] transition">تسجيل الدخول من هنا</Link>
            </span>
          </div>
        </div>
      )}

      {/* شريط البحث المطور للموبايل والكمبيوتر */}
      <section id="search-section" className="max-w-6xl mx-auto px-4 mb-8 relative z-20">
        {/* نسخة الموبايل المدمجة الفاخرة */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full h-15 bg-white rounded-2xl border border-gray-150 shadow-md px-4 flex items-center justify-between flex-row-reverse text-right transition hover:shadow-lg duration-200"
          >
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#3FAF9B] text-lg font-bold">
                🔍
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">أين تريد الذهاب في سوريا؟</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {selectedGovernorate || "أي مكان"} • {selectedType || "أي عقار"} • {maxPrice < 250 ? `أقل من $${maxPrice}` : "أي سعر"}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black text-[#2D6A5F] bg-[#E6F4F1] px-2.5 py-1.5 rounded-lg">
              تصفية سريعة
            </span>
          </button>
        </div>

        {/* نسخة الكمبيوتر (الغريد الأصلي) */}
        <div className="hidden md:block bg-[#2D6A5F] p-5 rounded-[28px] shadow-xl">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-center">

            {/* 1. زر البحث */}
            <div className="lg:col-span-2">
              <button
                onClick={() => {
                  setDisplayLimit(12);
                  loadProperties(12);
                }}
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

          {/* شريط نطاق السعر تفاعلي */}
          <div className="mt-4 pt-4 border-t border-[#3FAF9B]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-white px-2">
            <div className="flex items-center gap-2 flex-row-reverse w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-gray-200">الحد الأقصى للسعر بالليلة:</span>
              <span className="text-sm font-black text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">${maxPrice} USD</span>
            </div>
            <div className="w-full sm:w-80 flex items-center gap-3">
              <span className="text-[10px] text-gray-300 font-bold">$10</span>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-300"
              />
              <span className="text-[10px] text-gray-300 font-bold">$250+</span>
            </div>
          </div>

        </div>
      </section>

      {/* تصنيفات المحافظات سريعة التمرير (أفقية) للموبايل والكمبيوتر */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 relative z-20">
        <div className="relative">
          {/* دلالة السحب: تدرج لوني خفيف جهة اليسار يوضح وجود عناصر إضافية يختفي عند بدء السحب */}
          {showScrollHint && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 pointer-events-none md:hidden animate-in fade-in duration-300"></div>
              {/* شارة صغيرة للدلالة على السحب تظهر فقط على الموبايل */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-gray-500 text-[10px] font-bold bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-sm border border-gray-150 flex items-center gap-1 animate-pulse md:hidden pointer-events-none">
                <span>◀ اسحب للمزيد</span>
              </div>
            </>
          )}

          <div
            onScroll={(e) => {
              if (Math.abs(e.currentTarget.scrollLeft) > 10) {
                setShowScrollHint(false);
              }
            }}
            className="flex overflow-x-auto gap-2 pb-2.5 flex-row-reverse text-right no-scrollbar scroll-smooth"
          >
            <button
              onClick={() => setSelectedGovernorate("")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border shadow-xs ${
                selectedGovernorate === ""
                  ? "bg-[#2D6A5F] border-[#2D6A5F] text-white scale-105"
                  : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              }`}
            >
              🗺️ كل المحافظات
            </button>
            {governorates.map((gov) => {
              const isSelected = selectedGovernorate === gov;
              return (
                <button
                  key={gov}
                  onClick={() => setSelectedGovernorate(isSelected ? "" : gov)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border shadow-xs ${
                    isSelected
                      ? "bg-[#2D6A5F] border-[#2D6A5F] text-white scale-105"
                      : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  📍 {gov}
                </button>
              );
            })}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
          <div className="text-right">
            <h2 className="text-2xl font-extrabold text-[#111827]">العقارات المتاحة للطلب</h2>
            <p className="text-xs font-bold text-[#6B7280] mt-1">العقارات المكتشفة: {propertiesToDisplay.length}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* فرز وترتيب */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500">ترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 outline-none focus:border-[#2D6A5F]"
              >
                <option value="newest">📅 الأحدث أولاً</option>
                <option value="price_asc">📈 السعر: من الأقل للأعلى</option>
                <option value="price_desc">📉 السعر: من الأعلى للأقل</option>
                <option value="rating_desc">⭐ التقييم: الأعلى أولاً</option>
              </select>
            </div>

            {/* وضع العرض */}
            <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-[#2D6A5F] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                📋 قائمة
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  viewMode === "map"
                    ? "bg-white text-[#2D6A5F] shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                📍 خريطة
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-base font-bold text-[#3FAF9B] animate-pulse">جاري جلب عقارات يلا هلا...</div>
        ) : propertiesToDisplay.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-[#111827]">لا يوجد عقارات متاحة حالياً</h3>
            <p className="mt-2 text-sm text-[#6B7280]">يرجى تعديل تواريخ البحث أو المحاولة مجدداً في وقت لاحق.</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="w-full h-[550px] mb-8 rounded-3xl overflow-hidden shadow-sm border border-gray-200">
            <PropertyMap properties={propertiesToDisplay} />
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {propertiesToDisplay.map((property) => (
              <article key={property.id} className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between relative group">
                <div className="relative">
                  <img
                    src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=60&w=600&auto=format&fit=crop"}
                    alt={property.title}
                    loading="lazy"
                    decoding="async"
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
                    <div className="flex items-center justify-between gap-1 mb-2">
                      {/* التقييم */}
                      {(() => {
                        let reviews: any[] = [];
                        if (property.images && Array.isArray(property.images)) {
                          try {
                            reviews = property.images.map((r: string) => JSON.parse(r));
                          } catch (e) {
                            console.error(e);
                          }
                        }
                        if (reviews.length > 0) {
                          const avg = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
                          return (
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                              <span className="text-amber-500">★</span>
                              <span>{avg}</span>
                              <span className="text-[10px] text-gray-400 font-medium">({reviews.length} تقييم)</span>
                            </div>
                          );
                        } else {
                          return (
                            <span className="text-[10px] font-black bg-[#E6F4F1] text-[#3FAF9B] px-2 py-0.5 rounded-md">
                              ⭐ جديد
                            </span>
                          );
                        }
                      })()}

                      <div className="flex flex-col items-end justify-center">
                        {property.rooms ? (
                          <>
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-[10px] text-gray-400 font-bold">عادي:</span>
                              <span className="text-base font-black text-[#CF9E59]">
                                {property.longitude === 1 ? `${Number(property.price).toLocaleString()} ل.س` : `$${property.price}`}
                              </span>
                              <span className="text-[9px] text-gray-400">/ ليلة</span>
                            </div>
                            <div className="flex items-baseline justify-end gap-1 -mt-1">
                              <span className="text-[10px] text-amber-600 font-bold">عطلة:</span>
                              <span className="text-xs font-black text-amber-600">
                                {property.longitude === 1 ? `${Number(property.rooms).toLocaleString()} ل.س` : `$${property.rooms}`}
                              </span>
                              <span className="text-[9px] text-amber-600/70">/ ليلة</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-xl font-black text-[#CF9E59]">
                              {property.longitude === 1 ? `${Number(property.price).toLocaleString()} ل.س` : `$${property.price}`}
                            </span>
                            <span className="text-[10px] text-gray-400">/ ليلة</span>
                          </div>
                        )}
                      </div>
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

          {/* زر عرض المزيد */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => {
                  const newLimit = displayLimit + 12;
                  setDisplayLimit(newLimit);
                  loadProperties(newLimit);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-50 text-[#2D6A5F] border border-gray-200 font-bold px-8 py-3.5 text-sm transition shadow-sm cursor-pointer"
              >
                🔄 عرض المزيد من العقارات
              </button>
            </div>
          )}
        </>
      )}
    </section>

      {/* قسم الملاك والمؤجرين (إغراءات مالية وإحصائيات تفاعلية) */}
      <section id="owners-section" className="bg-gradient-to-b from-white to-[#F0FDF4]/30 border-t border-b border-gray-100 py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* عنوان القسم */}
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-[#E6F4F1] px-5 py-2 text-sm font-bold text-[#2D6A5F] mb-4 shadow-xs">
              💰 أصحاب العقارات والمؤجرين
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight">
              هل تمتلك عقاراً في سوريا؟ حوله إلى مصدر عوائد مالية ممتازة!
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto font-medium">
              انضم إلى مئات المؤجرين على منصة يلا هلا، واعرض شقتك، فيلتك أو شاليهك أمام آلاف الزوار شهرياً مجاناً وبدون أي عمولات مخفية.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
            
            {/* مميزات العرض للملاك */}
            <div className="space-y-5 text-right">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 border-r-4 border-[#3FAF9B] pr-3 mb-2">
                لماذا يعرض الملاك عقاراتهم على يلا هلا؟
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
                  <span className="text-2xl mb-2 block">📈</span>
                  <h4 className="font-bold text-sm text-gray-900">مضاعفة نسب الإشغال</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-5">نضمن وصول عقارك لآلاف السياح والمغتربين والباحثين عن إقامات قصيرة الأجل.</p>
                </div>
                
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
                  <span className="text-2xl mb-2 block">⚡</span>
                  <h4 className="font-bold text-sm text-gray-900">إشعارات تيليغرام فورية</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-5">ستتلقى طلبات الحجز فور إرسالها برسائل مباشرة على هاتفك لسرعة الرد والقبول.</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
                  <span className="text-2xl mb-2 block">📱</span>
                  <h4 className="font-bold text-sm text-gray-900">لوحة تحكم ذكية ومجانية</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-5">تحكّم بأسعارك، أيام الإشغال، والتقويم التفاعلي لعقارك بسهولة بالغة.</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
                  <span className="text-2xl mb-2 block">💸</span>
                  <h4 className="font-bold text-sm text-gray-900">عمولة 0% على التسجيل</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-5">التسجيل وعرض العقار مجاني تماماً، وأرباحك تستلمها مباشرة من الزبون بالكامل.</p>
                </div>
              </div>
            </div>

            {/* الخطوات الثلاث والبدء */}
            <div className="space-y-6 text-right">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 border-r-4 border-[#CF9E59] pr-3 mb-2">
                3 خطوات بسيطة لبدء استقبال الحجوزات:
              </h3>
              
              <div className="flex flex-col gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
                <div className="flex gap-3 items-center flex-row-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#E6F4F1] text-[#2D6A5F] text-xs font-black flex items-center justify-center border border-[#2D6A5F]/20 shrink-0">١</span>
                  <p className="text-xs sm:text-sm text-gray-700 font-bold"><strong className="text-gray-950">أنشئ حسابك:</strong> سجل مجاناً في دقيقة برقم هاتفك.</p>
                </div>
                <div className="flex gap-3 items-center flex-row-reverse border-t border-gray-50 pt-3">
                  <span className="w-6 h-6 rounded-full bg-[#E6F4F1] text-[#2D6A5F] text-xs font-black flex items-center justify-center border border-[#2D6A5F]/20 shrink-0">٢</span>
                  <p className="text-xs sm:text-sm text-gray-700 font-bold"><strong className="text-gray-950">ارفع الصور والمواصفات:</strong> ادخل التفاصيل والأسعار اليومية المفضلة لديك.</p>
                </div>
                <div className="flex gap-3 items-center flex-row-reverse border-t border-gray-50 pt-3">
                  <span className="w-6 h-6 rounded-full bg-[#E6F4F1] text-[#2D6A5F] text-xs font-black flex items-center justify-center border border-[#2D6A5F]/20 shrink-0">٣</span>
                  <p className="text-xs sm:text-sm text-gray-700 font-bold"><strong className="text-gray-950">استقبل الحجوزات:</strong> تواصل مباشرة واستلم أرباحك فوراً عند وصول الزوار.</p>
                </div>
              </div>

              {/* زر البدء */}
              <div className="pt-2">
                <Link
                  href="/add-property"
                  className="block w-full text-center rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-sm sm:text-base font-bold text-white transition shadow-sm hover:scale-[1.01]"
                >
                  🚀 اعرض عقارك الآن وابدأ بالربح
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Mobile Search Bottom Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center md:hidden transition-all animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto flex flex-col justify-between animate-in slide-in-from-bottom-10 duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-5 flex-row-reverse">
                <h3 className="text-lg font-black text-gray-900">تخصيص البحث والتصفية</h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5 text-right">
                {/* 1. المحافظة */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">📍 المحافظة / المدينة:</label>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-right text-xs font-bold text-gray-800 outline-none focus:border-[#3FAF9B]"
                  >
                    <option value="">كل المحافظات</option>
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                {/* 2. نوع العقار */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">🏡 نوع العقار:</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-right text-xs font-bold text-gray-800 outline-none focus:border-[#3FAF9B]"
                  >
                    <option value="">كافة الأنواع</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* 3. تواريخ الوصول والمغادرة */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-700">📅 تاريخ الوصول:</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 px-3 text-right text-xs font-bold text-gray-800 outline-none focus:border-[#3FAF9B]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-700">📅 تاريخ المغادرة:</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 px-3 text-right text-xs font-bold text-gray-800 outline-none focus:border-[#3FAF9B]"
                    />
                  </div>
                </div>

                {/* 4. عدد الضيوف */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">👥 عدد الضيوف:</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-right text-xs font-bold text-gray-800 outline-none focus:border-[#3FAF9B]"
                  >
                    <option value="">غير محدد</option>
                    <option value="1">ضيف واحد</option>
                    <option value="2">ضيفين</option>
                    <option value="3">3 ضيوف</option>
                    <option value="4">4+ ضيوف</option>
                  </select>
                </div>

                {/* 5. نطاق السعر */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 flex-row-reverse">
                    <span>الحد الأقصى للسعر بالليلة:</span>
                    <span className="text-sm font-black text-[#2D6A5F] bg-emerald-50 px-2.5 py-0.5 rounded-full">${maxPrice} USD</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold">$10</span>
                    <input
                      type="range"
                      min="10"
                      max="250"
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3FAF9B]"
                    />
                    <span className="text-[10px] text-gray-400 font-bold">$250+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  setSelectedGovernorate("");
                  setSelectedType("");
                  setCheckInDate("");
                  setCheckOutDate("");
                  setGuestsCount("");
                  setMaxPrice(250);
                  setShowMobileFilters(false);
                  setDisplayLimit(12);
                  loadProperties(12);
                }}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                إلغاء التصفية
              </button>
              <button
                onClick={() => {
                  setDisplayLimit(12);
                  loadProperties(12);
                  setShowMobileFilters(false);
                }}
                className="flex-1 h-12 rounded-xl bg-[#2D6A5F] text-white font-bold text-xs"
              >
                تطبيق الفلاتر والبحث
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
