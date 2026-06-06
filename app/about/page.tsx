export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 sm:px-6 py-14 sm:py-20" dir="rtl">
      <div className="mx-auto max-w-6xl">

        {/* المقدمة والعنوان الرئيسي التسويقي */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#ECFDF5] px-5 py-2 text-sm font-bold text-[#3FAF9B]">
            Yalla Hala | يلا هلا
          </span>
          <h1 className="mt-7 text-4xl sm:text-6xl font-black text-[#111827] leading-tight">
            من نحن
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg sm:text-xl leading-10 text-[#4B5563] font-medium">
            منصة <span className="text-[#3FAF9B] font-bold">"يلا هلا"</span> هي الوجهة الرقمية الأولى والرائدة في سوريا المتخصصة في إدارة وتسهيل حجوزات <span className="text-[#3FAF9B] font-bold">العقارات السكنية والإقامات قصيرة الأجل</span>. نربط بين الباحثين عن إقامة استثنائية وأصحاب العقارات الشغوفين، لتقديم تجربة حجز عصرية، آمنة وموثوقة كلياً.
          </p>
        </div>

        {/* أقسام تفاصيل المنصة - الكروت الثلاثة الذكية */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {/* كرت: فكرة المنصة */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl text-right flex flex-col justify-between">
            <div>
              <div className="mb-6 text-5xl">🏡</div>
              <h2 className="text-2xl font-black text-[#111827]">
                فكرة المنصة
              </h2>
              <p className="mt-5 leading-8 text-[#4B5563] text-sm sm:text-base font-medium">
                لقد انطلقنا من حاجة السوق السوري الماسة لوجود مظلة رقمية موحدة تجمع الفلل، المزارع، الشاليهات، والشقق المعدة للإقامات قصيرة الأجل. هدفنا هو إنهاء عشوائية الحجوزات التقليدية، وتوفير خيارات متنوعة ومصورة بواقعية ودقة تامة لتلبي تطلعات الأفراد والعائلات.
              </p>
            </div>
          </section>

          {/* كرت الإقناع: ماذا نوفر للمستأجرين؟ */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl text-right flex flex-col justify-between">
            <div>
              <div className="mb-6 text-5xl">🔍</div>
              <h2 className="text-2xl font-black text-[#3FAF9B]">
                لماذا تحجز عبرنا؟
              </h2>
              <p className="text-xs text-gray-400 mt-1 mb-4 font-bold">للزوار والباحثين عن إقامة</p>
              <ul className="space-y-3 leading-7 text-[#4B5563] text-sm font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">شفافية مطلقة وموثوقية:</strong> استعراض العقارات بتفاصيلها الحقيقية وأسعارها المحدثة دون أي تلاعب أو عمولات مخفية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">حماية أيام عطلتك:</strong> نظام جدولة وفحص يضمن عدم تداخل المواعيد ويؤمن لك استلام العقار بالوقت المحدد.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">تواصل مباشر:</strong> واجهة استخدام حديثة وسريعة تضعك على تواصل مباشر مع مسؤولي العقار لتأكيد حجزك.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* كرت الإقناع: ماذا نوفر للمؤجرين؟ */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl text-right flex flex-col justify-between">
            <div>
              <div className="mb-6 text-5xl">📈</div>
              <h2 className="text-2xl font-black text-[#CF9E59]">
                لماذا تعرض عقارك معنا؟
              </h2>
              <p className="text-xs text-amber-500/80 mt-1 mb-4 font-bold">لأصحاب العقارات والمستثمرين</p>
              <ul className="space-y-3 leading-7 text-[#4B5563] text-sm font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">مضاعفة نسب الإشغال:</strong> نضع عقارك أمام آلاف الباحثين عن إقامات يومية وأسبوعية في مختلف المحافظات السورية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">إدارة ذكية وحفظ للوقت:</strong> لوحة تحكم واستمارات تمكنك من استقبال طلبات الحجز وتنظيم مواعيدك بسلاسة واحترافية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong className="text-gray-950">تسويق رقمي متكامل:</strong> نعرض ميزات عقارك وصوره بهيكلية بصرية جذابة ترفع من قيمته التسويقية وتزيد أرباحك.</span>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* رؤيتنا الطموحة */}
        <section className="mt-12 rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm text-center max-w-4xl mx-auto">
          <div className="mb-4 text-4xl">✨</div>
          <h2 className="text-2xl font-black text-[#111827]">رؤيتنا المستقبلية</h2>
          <p className="mt-4 leading-8 text-[#4B5563] text-sm sm:text-base font-medium max-w-2xl mx-auto">
            أن نكون المنصة والحل التقني الأول المعتمد للسياحة والضيافة داخل سوريا، لبناء مجتمع يعتمد على الثقة المتبادلة والخدمة الممتازة، لتكون منصة يلا هلا دائماً بمثابة <span className="text-[#3FAF9B] font-bold">"بيتك الفاخر البعيد عن بيتك"</span>.
          </p>
        </section>

        {/* قسم تواصل معنا */}
        <section className="mt-20 rounded-[36px] border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">
              تواصل معنا
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-8 text-[#6B7280] max-w-2xl mx-auto font-medium">
              سواء كنت مستأجراً يبحث عن إجابة، أو صاحب عقار ترغب في توثيق شراكتك معنا، يسعدنا جداً تواصلك المباشر مع فريق الدعم الفني عبر القنوات الرسمية:
            </p>
          </div>

          {/* ⚡ الـ Grid رباعي البطاقات لوسائل التواصل */}
          <div className="mt-12 max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {/* بطاقة البريد الإلكتروني */}
            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center">
              <div className="mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-105 transition duration-300">
                <svg className="w-12 h-12 text-[#3FAF9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25 2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111827]">
                البريد الإلكتروني الرسمي
              </h3>
              <p className="mt-3 text-base font-bold text-[#2D6A5F] hover:text-[#3FAF9B] cursor-pointer transition break-all">
                contact@yallahala.com
              </p>
            </div>

            {/* بطاقة واتساب المباشر */}
            <a
              href="https://wa.me/46790081236"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center group"
            >
              <div className="mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-105 transition duration-300">
                <svg className="w-12 h-12 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.944 14.068.92 11.451.92 6.015.92 1.593 5.29 1.59 10.72c-.001 1.684.449 3.323 1.302 4.774l-.979 3.578 3.734-.968z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">
                واتساب الدعم الفني
              </h3>
              {/* 🟢 تم تثبيت اتجاه الرقم هنا لـ LTR ليظهر الزائد على اليسار بشكل مثالي */}
              <p dir="ltr" className="mt-3 text-xl font-bold text-green-600 tracking-wide">
                +46790081236
              </p>
            </a>

            {/* بطاقة فيسبوك */}
            <a
              href="https://www.facebook.com/share/1EbeNX97UR/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center group"
            >
              <div className="mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-105 transition duration-300">
                <svg className="w-12 h-12 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">
                صفحتنا على فيسبوك
              </h3>
              <p className="mt-3 text-lg font-bold text-blue-600 hover:text-blue-700 transition">
                Yalla Hala
              </p>
            </a>

            {/* بطاقة إنستغرام */}
            <a
              href="https://www.instagram.com/yallahala.sy?igsh=MTZwZWpscG5mZDkwcg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center group"
            >
              <div className="mb-4 w-12 h-12 flex items-center justify-center group-hover:scale-105 transition duration-300">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <radialGradient id="ig-grad-about" cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <path fill="url(#ig-grad-about)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">
                حسابنا على إنستغرام
              </h3>
              <p dir="ltr" className="mt-3 text-lg font-bold text-pink-600 hover:text-pink-700 transition">
                @yallahala.sy
              </p>
            </a>

          </div>
        </section>

      </div>
    </main>
  );
}
