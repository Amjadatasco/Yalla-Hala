"use client";

import { useState } from "react";

export default function Home() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendWhatsApp = () => {
    const message = `طلب إضافة عقار جديد

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

شروط الحجز:
${form.rules}`;

    const url = `https://wa.me/963995688838?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

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

  const propertyTypes = ["شقة", "فيلا", "غرفة", "شاليه", "مزرعة", "استوديو"];

  const featured = [
    {
      title: "شقة عائلية مريحة",
      city: "حمص",
      type: "شقة",
      guests: "4 أشخاص",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "فيلا هادئة بإطلالة جميلة",
      city: "اللاذقية",
      type: "فيلا",
      guests: "6 أشخاص",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "غرفة مناسبة للمسافرين",
      city: "دمشق",
      type: "غرفة",
      guests: "شخصان",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Yalla Hala</h1>
            <p className="mt-1 text-sm text-slate-600">بيتك البعيد من بيتك</p>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm">
            <a href="#home" className="rounded-2xl bg-slate-900 px-4 py-2 text-white">
              الرئيسية
            </a>
            <a href="#about" className="rounded-2xl border bg-white px-4 py-2 hover:bg-slate-100">
              من نحن
            </a>
            <a href="#submit" className="rounded-2xl border bg-white px-4 py-2 hover:bg-slate-100">
              أضف عقارك
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="mx-auto max-w-6xl px-4 pb-8 pt-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-slate-200 px-3 py-1 text-sm">
                منصة حجز بسيطة داخل سوريا
              </span>
              <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                ابحث عن <span className="underline decoration-4 underline-offset-4">شقة أو فيلا أو غرفة</span> بسهولة
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                منصة عربية بسيطة لعرض العقارات المؤقتة في المدن السورية، مع نموذج واضح لإضافة العقار وطريقة حجز
                منظمة وسهلة.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <h3 className="mb-4 text-xl font-semibold">ابحث عن العقار المناسب</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">نوع العقار</label>
                  <select className="w-full rounded-2xl border bg-white px-4 py-3">
                    <option>اختر النوع</option>
                    {propertyTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">المدينة</label>
                  <select className="w-full rounded-2xl border bg-white px-4 py-3">
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">تاريخ الوصول</label>
                  <input type="date" className="w-full rounded-2xl border px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm">تاريخ المغادرة</label>
                  <input type="date" className="w-full rounded-2xl border px-4 py-3" />
                </div>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-slate-900 py-3 text-base font-medium text-white transition hover:opacity-95">
                ابحث الآن
              </button>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                هذه نسخة أولية للواجهة، ويمكن لاحقًا ربط البحث بقاعدة بيانات حقيقية وإظهار النتائج مباشرة.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-bold">عقارات مميزة</h3>
            <span className="text-sm text-slate-500">أمثلة أولية للعرض</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
                <div className="p-5">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{item.city}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{item.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{item.guests}</span>
                  </div>
                  <button className="mt-5 w-full rounded-2xl border py-3 transition hover:bg-slate-100">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="border-y bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-3xl font-bold">من نحن</h3>
              <p className="mb-4 leading-8 text-slate-700">
                Yalla Hala هي منصة عربية بسيطة تساعد الناس على إيجاد شقق وفلل وغرف للإقامة المؤقتة داخل سوريا
                بطريقة واضحة وسهلة.
              </p>
              <p className="mb-4 leading-8 text-slate-700">
                هدفنا أن نجمع العقارات المناسبة في مكان واحد، وأن يكون التواصل أكثر تنظيمًا بين طالب الحجز وصاحب
                العقار.
              </p>
              <p className="leading-8 text-slate-700">
                تتم مراجعة الطلبات يدويًا قبل النشر من أجل تقديم محتوى أفضل وبناء ثقة أكبر في بداية المشروع.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-100 p-5">
                <h4 className="mb-2 text-lg font-semibold">طريقة العمل</h4>
                <p className="text-sm leading-7 text-slate-700">
                  يتم استقبال طلبات إضافة العقارات أولًا، ثم مراجعتها، ثم نشرها على الموقع بعد الموافقة.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5">
                <h4 className="mb-2 text-lg font-semibold">سياسة البداية</h4>
                <p className="text-sm leading-7 text-slate-700">
                  أول 100 عقار مجاني بشكل دائم، وبعد ذلك يمكن اعتماد عمولة 10% من قيمة الإيجار.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5">
                <h4 className="mb-2 text-lg font-semibold">آلية الحجز</h4>
                <p className="text-sm leading-7 text-slate-700">
                  عند الاتفاق على الحجز يتم التواصل مع صاحب العقار وتأكيد التفاصيل وفق الآلية المعتمدة.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5">
                <h4 className="mb-2 text-lg font-semibold">وسائل الدفع</h4>
                <p className="text-sm leading-7 text-slate-700">
                  يمكن ترتيب الدفع عبر Home Crypto داخل سوريا، وأيضًا عبر PayPal عند الإمكان.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="submit" className="mx-auto max-w-6xl px-4 py-14">
          <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-3 text-3xl font-bold">أضف عقارك</h3>
            <p className="mb-8 leading-7 text-slate-600">
              أرسل تفاصيل عقارك كاملة، وبعد مراجعة الطلب سيتم التواصل معك في حال الموافقة على نشره في الموقع.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="الاسم الكامل"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="phone"
                placeholder="رقم الهاتف أو واتساب"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="email"
                placeholder="البريد الإلكتروني"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <select
                name="type"
                onChange={handleChange}
                className="rounded-2xl border bg-white px-4 py-3"
              >
                <option value="">نوع العقار</option>
                {propertyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                name="city"
                onChange={handleChange}
                className="rounded-2xl border bg-white px-4 py-3"
              >
                <option value="">المدينة</option>
                {cities.slice(1).map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>

              <input
                name="area"
                placeholder="المنطقة أو الحي"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="price"
                placeholder="السعر لليلة أو للشهر"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="guests"
                placeholder="الحد الأقصى للضيوف"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="rooms"
                placeholder="عدد الغرف"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
              <input
                name="images"
                placeholder="رابط صور العقار أو Google Drive"
                onChange={handleChange}
                className="rounded-2xl border px-4 py-3"
              />
            </div>

            <textarea
              name="description"
              placeholder="وصف العقار: الأثاث، التكييف، التدفئة، المطبخ، الإنترنت، الإطلالة، مواقف السيارات..."
              onChange={handleChange}
              className="mt-4 min-h-[130px] w-full rounded-2xl border px-4 py-3"
            />

            <textarea
              name="rules"
              placeholder="شروط المالك: العربون، مدة الإلغاء، أوقات الدخول والخروج، المسموح والممنوع..."
              onChange={handleChange}
              className="mt-4 min-h-[110px] w-full rounded-2xl border px-4 py-3"
            />

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-7 text-slate-700">
              <p>مهم: إرسال الطلب لا يعني النشر المباشر. تتم مراجعة العقار أولًا، ثم يتم التواصل مع المالك عند القبول.</p>
              <p>تثبيت الحجز يكون حسب آلية المنصة المتفق عليها، والهدف هو تنظيم العملية بطريقة واضحة للطرفين.</p>
            </div>

            <button
              onClick={sendWhatsApp}
              className="mt-6 w-full rounded-2xl bg-green-600 py-3 text-base font-medium text-white transition hover:opacity-95"
            >
              إرسال الطلب عبر واتساب
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
          <div>
            <h4 className="text-lg font-bold">Yalla Hala</h4>
            <p className="mt-1 text-sm text-slate-600">بيتك البعيد من بيتك</p>
          </div>
          <div className="text-sm leading-7 text-slate-600">
            منصة أولية لعرض العقارات المؤقتة في سوريا بطريقة سهلة وواضحة.
          </div>
        </div>
      </footer>
    </div>
  );
}