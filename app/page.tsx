"use client";

import { useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState({
    type: "",
    city: "",
    checkIn: "",
    checkOut: "",
  });

  const propertyTypes = ["شقة", "فيلا", "غرفة", "شاليه", "استوديو", "مزرعة"];
  const cities = [
    "جميع المدن",
    "دمشق",
    "حمص",
    "حلب",
    "اللاذقية",
    "طرطوس",
    "حماة",
    "إدلب",
    "السويداء",
    "درعا",
    "دير الزور",
    "الرقة",
    "الحسكة",
  ];

  const handleSearch = () => {
    const message = `مرحبًا، أريد البحث عن عقار عبر Yalla Hala

نوع العقار: ${search.type || "غير محدد"}
المدينة: ${search.city || "غير محددة"}
Check-in: ${search.checkIn || "غير محدد"}
Check-out: ${search.checkOut || "غير محدد"}`;

    window.open(
      `https://wa.me/963995688838?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm text-[var(--brand-muted)] shadow-sm">
            ابحث بسهولة عن مكان إقامة مناسب داخل سوريا
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
            ابحث عن
            <span className="block text-[var(--brand-primary)]">شقة أو فيلا أو غرفة</span>
            <span className="block">بشكل واضح وسريع</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--brand-muted)]">
            الصفحة الرئيسية مخصصة فقط للبحث، حتى تكون التجربة أسهل وأوضح للباحث عن
            السكن. اختر نوع العقار والمدينة وتواريخ الوصول والمغادرة، ثم أرسل طلبك.
          </p>
        </div>

        <div className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
          <h2 className="mb-6 text-2xl font-extrabold">ابحث عن العقار المناسب</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-muted)]">
                نوع العقار
              </label>
              <select
                value={search.type}
                onChange={(e) => setSearch({ ...search, type: e.target.value })}
                className="w-full rounded-2xl border border-[var(--brand-line)] bg-white px-4 py-3.5 outline-none transition focus:border-[var(--brand-primary)]"
              >
                <option value="">اختر النوع</option>
                {propertyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-muted)]">
                المدينة
              </label>
              <select
                value={search.city}
                onChange={(e) => setSearch({ ...search, city: e.target.value })}
                className="w-full rounded-2xl border border-[var(--brand-line)] bg-white px-4 py-3.5 outline-none transition focus:border-[var(--brand-primary)]"
              >
                <option value="">اختر المدينة</option>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-muted)]">
                Check-in
              </label>
              <input
                lang="en"
                type="date"
                value={search.checkIn}
                onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                className="w-full rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--brand-muted)]">
                Check-out
              </label>
              <input
                lang="en"
                type="date"
                value={search.checkOut}
                onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                className="w-full rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="mt-5 w-full rounded-2xl bg-[var(--brand-primary)] py-4 text-base font-bold text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            ابحث الآن
          </button>

          <a
            href="https://wa.me/963995688838?text=مرحبًا، أريد إرسال طلب حجز عبر Yalla Hala"
            target="_blank"
            className="mt-3 block w-full rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-soft)] py-4 text-center text-base font-bold text-[var(--brand-dark)] transition hover:opacity-90"
          >
            زر الحجز
          </a>
        </div>
      </section>
    </main>
  );
}