export default function AboutPage() {

  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 sm:px-6 py-14 sm:py-20">

      <div className="mx-auto max-w-6xl">

        <div className="text-center">

          <span className="inline-block rounded-full bg-[#ECFDF5] px-5 py-2 text-sm font-bold text-[#3FAF9B]">

            Yalla Hala

          </span>

          <h1 className="mt-7 text-5xl sm:text-7xl font-extrabold text-[#111827] leading-tight">

            من نحن

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg sm:text-2xl leading-10 text-[#6B7280]">

            منصة متخصصة بالإقامات القصيرة داخل سوريا،
            تساعد المستخدمين على العثور على شقق وفيلات
            ومزارع وشاليهات بسهولة وموثوقية وتجربة حديثة.

          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-6 text-5xl">

              🏡

            </div>

            <h2 className="text-3xl font-extrabold text-[#111827]">

              فكرة المنصة

            </h2>

            <p className="mt-5 leading-9 text-[#4B5563]">

              جمع العقارات القصيرة الإقامة في منصة
              واحدة تتيح للمستخدم البحث بسهولة
              والوصول إلى خيارات إقامة متنوعة
              داخل سوريا.

            </p>

          </section>

          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-6 text-5xl">

              🔍

            </div>

            <h2 className="text-3xl font-extrabold text-[#111827]">

              ماذا نوفر؟

            </h2>

            <ul className="mt-5 space-y-4 leading-8 text-[#4B5563]">

              <li>
                • تجربة بحث سهلة وسريعة
              </li>

              <li>
                • عرض عقارات بشكل احترافي
              </li>

              <li>
                • تواصل مباشر مع أصحاب العقارات
              </li>

              <li>
                • واجهة حديثة ومتوافقة مع الهاتف
              </li>

            </ul>

          </section>

          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <div className="mb-6 text-5xl">

              ✨

            </div>

            <h2 className="text-3xl font-extrabold text-[#111827]">

              رؤيتنا

            </h2>

            <p className="mt-5 leading-9 text-[#4B5563]">

              بناء منصة حديثة وموثوقة تجعل
              الوصول إلى أماكن الإقامة داخل
              سوريا أكثر سهولة واحترافية.

            </p>

          </section>

        </div>

        <section className="mt-20 rounded-[36px] border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">

          <div className="text-center">

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#111827]">

              تواصل معنا

            </h2>

            <p className="mt-5 text-lg leading-9 text-[#6B7280] max-w-2xl mx-auto">

              لأي استفسار أو رغبة بإضافة عقار
              أو التعاون معنا يمكنك التواصل مباشرة.

            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">

            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-7 text-center">

              <div className="mb-5 text-4xl">

                📧

              </div>

              <h3 className="text-2xl font-extrabold text-[#111827]">

                البريد الإلكتروني

              </h3>

              <p className="mt-4 text-lg text-[#6B7280]">

                contact@yallahala.com

              </p>

            </div>

            <div className="rounded-[28px] border border-[#E5E7EB] bg-[#FAFAFA] p-7 text-center">

              <div className="mb-5 text-4xl">

                📱

              </div>

              <h3 className="text-2xl font-extrabold text-[#111827]">

                واتساب

              </h3>

              <p className="mt-4 text-lg text-[#6B7280]">

                أضف رقم الواتساب الخاص بك

              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}