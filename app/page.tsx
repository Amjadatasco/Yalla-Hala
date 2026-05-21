"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const governorates = [
  "دمشق", "ريف دمشق", "حلب", "اللاذقية", "طرطوس", 
  "حمص", "حماة", "السويداء", "درعا", "القنيطرة", 
  "دير الزور", "الحسكة", "الرقة"
];

const propertyTypes = [
  "شقة", "فيلا", "شاليه", "جناح", "بيت عربي"
];

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات الفلترة والتصفية
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestsCount, setGuestsCount] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (selectedGovernorate) {
        query = query.eq("governorate", selectedGovernorate);
      }
      if (selectedType) {
        query = query.eq("type", selectedType);
      }

      const { data, error } = await query;
      if (!error && data) {
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* قسم الهيرو / الترحيب */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <span className="inline-block rounded-full bg-[#ECFDF5] px-5 py-2 text-sm font-bold text-[#3FAF9B] mb-4 shadow-sm animate-pulse">
          منصة يلا هلا السياحية
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111827] leading-tight tracking-tight">
          احجز مكانك المثالي في سوريا مع يلا هلا
        </h1>
        <p className="mt-4 text-xl sm:text-2xl font-medium text-[#CF9E59]">
          "بيتك البعيد عن بيتك"
        </p>
        <p className="mt-3 text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto">
          استكشف شققاً، فيلات، وشاليهات سياحية في جميع المحافظات السورية بأفضل الأسعار.
        </p>
      </section>

      {/* شريط البحث المتقدم الفاخر المقوس */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-[#1E5349] p-4 rounded-[40px] shadow-2xl">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-12 items-center">
            
            {/* زر البحث */}
            <div className="md:col-span-2">
              <button
                onClick={loadProperties}
                className="w-full h-14 bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold rounded-[30px] flex items-center justify-center gap-2 transition duration-300 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                ابحث الآن
              </button>
            </div>

            {/* عدد الضيوف */}
            <div className="md:col-span-2 bg-white rounded-[30px] px-4 h-14 flex items-center shadow-sm">
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-transparent text-right text-[#4B5563] font-medium outline-none cursor-pointer appearance-none"
              >
                <option value="">عدد الضيوف</option>
                <option value="1">ضيف واحد</option>
                <option value="2">ضيفين</option>
                <option value="3">3 ضيوف</option>
                <option value="4">4+ ضيوف</option>
              </select>
            </div>

            {/* تاريخ المغادرة */}
            <div className="md:col-span-2 bg-white rounded-[30px] px-4 h-14 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] text-gray-400 text-right font-bold">تاريخ المغادرة</span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-right text-sm text-[#4B5563] font-medium outline-none cursor-pointer"
              />
            </div>

            {/* تاريخ الوصول */}
            <div className="md:col-span-2 bg-white rounded-[30px] px-4 h-14 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] text-gray-400 text-right font-bold">تاريخ الوصول</span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-right text-sm text-[#4B5563] font-medium outline-none cursor-pointer"
              />
            </div>

            {/* نوع العقار */}
            <div className="md:col-span-2 bg-white rounded-[30px] px-4 h-14 flex items-center shadow-sm">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-right text-[#4B5563] font-medium outline-none cursor-pointer"
              >
                <option value="">نوع العقار</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* المدينة / المنطقة */}
            <div className="md:col-span-2 bg-white rounded-[30px] px-4 h-14 flex items-center shadow-sm">
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full bg-transparent text-right text-[#4B5563] font-medium outline-none cursor-pointer"
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

      {/* قسم شبكة العقارات المتاحة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-5 mb-10">
          <h2 className="text-3xl font-extrabold text-[#111827]">العقارات المميزة المتاحة</h2>
          <p className="text-sm font-semibold text-[#6B7280]">العدد الإجمالي: {properties.length}</p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-xl font-bold text-[#3FAF9B] animate-pulse">جاري تحميل بيتك البعيد...</div>
        ) : properties.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-16 text-center shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#111827]">لم نجد عقارات تطابق بحثك</h3>
            <p className="mt-4 text-[#6B7280]">جرّب تغيير خيارات الفلترة أو تصفح المحافظات الأخرى.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <article key={property.id} className="overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between">
                <div className="relative">
                  <img
                    src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
                    alt={property.title}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-[#ECFDF5] text-[#3FAF9B] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {property.type}
                  </span>
                </div>

                <div className="p-6 text-right flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-end gap-1 mb-2">
                      <span className="text-2xl font-black text-[#CF9E59]">${property.price}</span>
                      <span className="text-xs text-gray-400">/ ليلة</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#111827] line-clamp-1">{property.title}</h3>
                    <p className="mt-2 text-sm text-[#6B7280] flex items-center justify-end gap-1">
                      {property.location}
                      <svg className="w-4 h-4 text-[#3FAF9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </p>
                    {property.governorate && (
                      <div className="mt-4 flex justify-end">
                        <span className="bg-[#F3F4F6] px-3 py-1 rounded-full text-xs text-gray-600 font-medium">{property.governorate}</span>
                      </div>
                    )}
                    {property.description && (
                      <p className="mt-4 text-xs leading-6 text-[#4B5563] line-clamp-2">{property.description}</p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href={`/property/${property.id}`}
                      className="rounded-2xl border-2 border-[#3FAF9B] text-[#3FAF9B] font-bold py-3 text-center text-sm hover:bg-[#F0FDF4] transition"
                    >
                      عرض التفاصيل
                    </Link>
                    <Link
                      href={`/property/${property.id}?book=true`}
                      className="rounded-2xl bg-[#3FAF9B] text-white font-bold py-3 text-center text-sm hover:bg-[#2F8E7D] transition shadow-sm"
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