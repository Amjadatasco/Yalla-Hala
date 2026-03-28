"use client";

import { useState } from "react";

export default function AddPropertyPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    city: "",
    area: "",
    price: "",
    guests: "",
    rooms: "",
    images: "",
    description: "",
    rules: "",
  });

  const propertyTypes = ["شقة", "فيلا", "غرفة", "شاليه", "استوديو", "مزرعة"];
  const cities = [
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendWhatsApp = () => {
    const message = `طلب إضافة عقار جديد عبر Yalla Hala

الاسم: ${form.name}
رقم الهاتف: ${form.phone}
البريد الإلكتروني: ${form.email}

نوع العقار: ${form.type}
المدينة: ${form.city}
المنطقة: ${form.area}
السعر: ${form.price}
عدد الضيوف: ${form.guests}
عدد الغرف: ${form.rooms}

رابط الصور: ${form.images}

وصف العقار:
${form.description}

شروط المالك:
${form.rules}`;

    window.open(
      `https://wa.me/963995688838?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-lg md:p-8">
          <p className="text-sm text-[var(--brand-muted)]">للمالكين</p>
          <h1 className="mt-2 text-3xl font-extrabold">أضف عقارك</h1>
          <p className="mt-4 leading-8 text-[var(--brand-muted)]">
            أرسل تفاصيل العقار بشكل كامل وواضح. بعد مراجعة الطلب سيتم التواصل معك
            في حال الموافقة على النشر.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              name="name"
              placeholder="الاسم الكامل"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="phone"
              placeholder="رقم الهاتف أو واتساب"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="email"
              placeholder="البريد الإلكتروني"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <select
              name="type"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] bg-white px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            >
              <option value="">نوع العقار</option>
              {propertyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              name="city"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] bg-white px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            >
              <option value="">المدينة</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            <input
              name="area"
              placeholder="المنطقة أو الحي"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="price"
              placeholder="السعر لليلة أو للشهر"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="guests"
              placeholder="الحد الأقصى للضيوف"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="rooms"
              placeholder="عدد الغرف"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
            <input
              name="images"
              placeholder="رابط صور العقار أو Google Drive"
              onChange={handleChange}
              className="rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <textarea
            name="description"
            placeholder="وصف العقار: الأثاث، التكييف، التدفئة، المطبخ، الإنترنت، الإطلالة، مواقف السيارات..."
            onChange={handleChange}
            className="mt-4 min-h-[130px] w-full rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
          />

          <textarea
            name="rules"
            placeholder="شروط المالك وأي تفاصيل إضافية"
            onChange={handleChange}
            className="mt-4 min-h-[110px] w-full rounded-2xl border border-[var(--brand-line)] px-4 py-3.5 outline-none focus:border-[var(--brand-primary)]"
          />

          <button
            onClick={sendWhatsApp}
            className="mt-6 w-full rounded-2xl bg-[var(--brand-primary)] py-4 text-base font-bold text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            إرسال الطلب عبر واتساب
          </button>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-lg md:p-8">
            <p className="text-sm text-[var(--brand-muted)]">شروط الصور</p>
            <h2 className="mt-2 text-2xl font-extrabold">شروط قبول صور العقار</h2>

            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--brand-dark)]">
              <li>• يجب أن تكون الصور بدقة عالية وواضحة.</li>
              <li>• يجب أن تكون الزوايا واضحة وتظهر العقار بشكل حقيقي.</li>
              <li>• يجب إظهار الغرف الأساسية والحمام والمطبخ والمدخل إن أمكن.</li>
              <li>• الصور المظلمة أو غير الواضحة أو المضللة قد تؤدي إلى رفض الطلب.</li>
              <li>• إذا لم تكن الصور واضحة فلن يتم قبول العقار للنشر.</li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-lg md:p-8">
            <p className="text-sm text-[var(--brand-muted)]">شروط الخدمة</p>
            <h2 className="mt-2 text-2xl font-extrabold">شروط أساسية</h2>

            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--brand-dark)]">
              <li>• يجب أن يكون وصف العقار دقيقًا ومطابقًا للحقيقة.</li>
              <li>• لا يحق لصاحب العقار استلام المبلغ إلا بعد إتمام التأجير كما هو موصوف.</li>
              <li>• إذا كانت الخدمة غير مطابقة للوصف فقد يتم خصم جزء من الإيجار أو إلغاء التعامل.</li>
              <li>• يجب الالتزام بموعد التسليم المتفق عليه وتسليم المفاتيح بشكل منظم.</li>
              <li>• أي معلومات مضللة أو صور غير حقيقية قد تؤدي إلى رفض أو إزالة العقار.</li>
              <li>• يجب أن يكون العقار جاهزًا فعلًا للاستقبال في التواريخ المتفق عليها.</li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-[var(--brand-line)] bg-[var(--brand-soft)] p-6 shadow-sm md:p-8">
            <p className="text-sm text-[var(--brand-muted)]">آلية الحجز</p>
            <h2 className="mt-2 text-2xl font-extrabold">كيف تتم العملية</h2>

            <ol className="mt-5 space-y-3 text-sm leading-7 text-[var(--brand-dark)]">
              <li>1. الشخص الراغب بالحجز يرسل طلب حجز.</li>
              <li>2. يتم تحويل الطلب إلى صاحب العقار.</li>
              <li>3. إذا وافق صاحب العقار، يتم إبلاغ الزبون بالموافقة.</li>
              <li>4. بعدها يجب على الزبون تثبيت الحجز عبر Home Crypto أو عبر PayPal.</li>
              <li>5. عند تأكيد الدفع، تصل رسالة تثبيت الحجز.</li>
              <li>6. بعدها يتم الاتفاق مع المالك على موعد التسليم واللقاء للحصول على المفاتيح.</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}