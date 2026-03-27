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

  const propertyTypes = ["شقة", "فيلا", "غرفة", "شاليه", "استوديو", "مزرعة"];

  const featured = [
    {
      title: "شقة عائلية مريحة",
      city: "حمص",
      type: "شقة",
      guests: "4 أشخاص",
      price: "35$ / الليلة",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "فيلا هادئة بإطلالة جميلة",
      city: "اللاذقية",
      type: "فيلا",
      guests: "6 أشخاص",
      price: "120$ / الليلة",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "غرفة مناسبة للمسافرين",
      city: "دمشق",
      type: "غرفة",
      guests: "شخصان",
      price: "20$ / الليلة",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Yalla Hala
            </h1>
            <p className="mt-1 text-sm text-slate-500">بيتك البعيد من بيتك</p>
          </div>

          <nav className="hidden gap-2 md:flex">
            <a
              href="#home"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              الرئيسية
            </a>
            <a
              href="#about"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-slate-100"
            >
              من نحن
            </a>
            <a
              href="#submit"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-slate-100"
            >
              أضف عقارك
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                منصة سكن مؤقت داخل سوريا
              </span>

              <h2 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
                ابحث عن
                <span className="block text-slate-700">شقة أو فيلا أو غرفة</span>
                <span className="block">بكل سهولة</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                منصة عربية بسيطة تساعدك على العثور على سكن مناسب في المدن السورية،
                مع تجربة واضحة وسريعة وإمكانية إضافة العقارات بسهولة.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#submit"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  أضف عقارك الآن
                </a>
                <a
                  href="#featured"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium transition hover:bg-slate-100"
                >
                  شاهد العقارات
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 md:p-6">
              <h3 className="mb-5 text-xl font-bold">ابحث عن العقار المناسب</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    نوع العقار
                  </label>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400">
                    <option>اختر النوع</option>
                    {propertyTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    المدينة
                  </label>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400">
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    تاريخ الوصول
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    تاريخ المغادرة
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-slate-900 py-3.5 text-base font-semibold text-white transition hover:opacity-90">
                ابحث الآن
              </button>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                هذه نسخة أولية، ويمكن لاحقًا ربط البحث بنتائج حقيقية وعرض العقارات
                مباشرة حسب المدينة والتاريخ.
              </p>
            </div>
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500">أفضل الخيارات كبداية</p>
              <h3 className="mt-2 text-3xl font-extrabold">عقارات مميزة</h3>
            </div>
            <a href="#submit" className="text-sm font-medium text-slate-700 hover:underline">
              أضف عقارك
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold shadow">
                    {item.price}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">{item.city}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {item.type}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {item.guests}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      جاهز للحجز
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button className="flex-1 rounded-2xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:opacity-90">
                      عرض التفاصيل
                    </button>
                    <button className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium transition hover:bg-slate-100">
                      تواصل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-6 lg:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">تعرف علينا</p>
              <h3 className="mt-2 text-3xl font-extrabold">من نحن</h3>
              <p className="mt-5 leading-8 text-slate-700">
                Yalla Hala منصة عربية بسيطة تساعد الناس على إيجاد شقق وفلل وغرف
                للإقامة المؤقتة داخل سوريا، بطريقة واضحة وسهلة ومرتبة.
              </p>
              <p className="mt-4 leading-8 text-slate-700">
                نهدف إلى جمع العقارات المناسبة في مكان واحد، وتسهيل التواصل بين
                صاحب العقار وطالب الحجز، مع مراجعة المحتوى قبل النشر.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <h4 className="mb-2 text-lg font-bold">طريقة العمل</h4>
                <p className="text-sm leading-7 text-slate-600">
                  نستقبل العقارات أولًا، ثم نراجعها، ثم ننشر المناسب منها على
                  الموقع بعد الموافقة.
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-5">
                <h4 className="mb-2 text-lg font-bold">سياسة البداية</h4>
                <p className="text-sm leading-7 text-slate-600">
                  أول 100 عقار مجاني بشكل دائم، وبعدها يمكن اعتماد عمولة تشغيل
                  مستقبلًا.
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-5">
                <h4 className="mb-2 text-lg font-bold">آلية الحجز</h4>
                <p className="text-sm leading-7 text-slate-600">
                  يتم تنسيق الحجز والتأكد من التفاصيل مع صاحب العقار قبل تثبيت
                  الطلب بشكل نهائي.
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-5">
                <h4 className="mb-2 text-lg font-bold">وسائل الدفع</h4>
                <p className="text-sm leading-7 text-slate-600">
                  يمكن ترتيب الدفع عبر Home Crypto داخل سوريا أو عبر PayPal عند
                  توفر ذلك.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="submit" className="mx-auto max-w-5xl px-4 py-14 md:px-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8">
            <div className="mb-8 text-center">
              <p className="text-sm text-slate-500">للمالكين</p>
              <h3 className="mt-2 text-3xl font-extrabold">أضف عقارك</h3>
              <p className="mt-3 leading-7 text-slate-600">
                أرسل تفاصيل العقار كاملة، وبعد المراجعة سيتم التواصل معك في حال
                الموافقة على النشر.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="الاسم الكامل"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="phone"
                placeholder="رقم الهاتف أو واتساب"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="email"
                placeholder="البريد الإلكتروني"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <select
                name="type"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-slate-400"
              >
                <option value="">نوع العقار</option>
                {propertyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                name="city"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-slate-400"
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
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="price"
                placeholder="السعر لليلة أو للشهر"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="guests"
                placeholder="الحد الأقصى للضيوف"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="rooms"
                placeholder="عدد الغرف"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
              <input
                name="images"
                placeholder="رابط صور العقار أو Google Drive"
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
              />
            </div>

            <textarea
              name="description"
              placeholder="وصف العقار: الأثاث، التكييف، التدفئة، المطبخ، الإنترنت، الإطلالة، مواقف السيارات..."
              onChange={handleChange}
              className="mt-4 min-h-[130px] w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
            />

            <textarea
              name="rules"
              placeholder="شروط المالك: العربون، مدة الإلغاء، أوقات الدخول والخروج، المسموح والممنوع..."
              onChange={handleChange}
              className="mt-4 min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-slate-400"
            />

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              <p>إرسال الطلب لا يعني النشر المباشر. تتم مراجعة العقار أولًا قبل اعتماده.</p>
              <p>الهدف هو تنظيم العملية وتقديم تجربة أوضح وأفضل للطرفين.</p>
            </div>

            <button
              onClick={sendWhatsApp}
              className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-base font-bold text-white transition hover:opacity-90"
            >
              إرسال الطلب عبر واتساب
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h4 className="text-lg font-extrabold">Yalla Hala</h4>
            <p className="mt-1 text-sm text-slate-500">بيتك البعيد من بيتك</p>
          </div>
          <p className="text-sm leading-7 text-slate-500">
            منصة أولية لعرض العقارات المؤقتة داخل سوريا بطريقة سهلة وواضحة.
          </p>
        </div>
      </footer>
    </div>
  );
}