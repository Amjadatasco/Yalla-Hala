export default function AboutPage() {

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-16">

      <div className="max-w-5xl mx-auto">

        <div className="text-center">

          <h1 className="text-5xl sm:text-7xl font-extrabold text-[#111827]">

            من نحن

          </h1>

          <p className="mt-8 text-xl text-[#6B7280] leading-10 max-w-3xl mx-auto">

            Yalla Hala منصة متخصصة بالإقامات القصيرة
            داخل سوريا، تساعد المستخدمين على العثور
            على شقق وفيلات ومزارع وشاليهات بسهولة
            وموثوقية.

          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#E5E7EB] text-center">

            <h2 className="text-3xl font-extrabold text-[#111827]">

              رؤيتنا

            </h2>

            <p className="mt-5 leading-9 text-[#6B7280]">

              بناء منصة حديثة تسهّل الوصول إلى
              أماكن إقامة موثوقة داخل سوريا.

            </p>

          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#E5E7EB] text-center">

            <h2 className="text-3xl font-extrabold text-[#111827]">

              مهمتنا

            </h2>

            <p className="mt-5 leading-9 text-[#6B7280]">

              ربط أصحاب العقارات بالمسافرين
              بطريقة سهلة وآمنة وسريعة.

            </p>

          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#E5E7EB] text-center">

            <h2 className="text-3xl font-extrabold text-[#111827]">

              الجودة

            </h2>

            <p className="mt-5 leading-9 text-[#6B7280]">

              مراجعة العقارات وتحسين التجربة
              لضمان جودة وموثوقية أعلى.

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}