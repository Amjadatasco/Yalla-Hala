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
                لماذا تحجز عبرنا？
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

          {/* ⚡ الـ Grid ثنائي البطاقات المحدث بنصوص احترافية */}
          <div className="mt-12 max-w-3xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2">
            
            {/* بطاقة البريد الإلكتروني */}
            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-8 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center">
              <div className="mb-4 text-5xl">📧</div>
              <h3 className="text-lg font-black text-[#111827]">
                البريد الإلكتروني الرسمي
              </h3>
              <p className="mt-3 text-base sm:text-lg font-bold text-[#2D6A5F] hover:text-[#3FAF9B] cursor-pointer transition break-all">
                contact@yallahala.com
              </p>
            </div>

            {/* بطاقة واتساب المباشر */}
            <a 
              href="https://wa.me/46790081236"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-8 text-center shadow-sm hover:border-[#3FAF9B] transition duration-300 flex flex-col justify-center items-center group"
            >
              <div className="mb-4 text-5xl group-hover:scale-105 transition duration-300">💬</div>
              <h3 className="text-lg font-bold text-[#111827]">
                واتساب
              </h3>
              <p className="mt-3 text-xl font-bold text-green-600 dir-ltr tracking-wide">
                +46790081236
              </p>
            </a>

          </div>
        </section>

      </div>
    </main>
  );
}