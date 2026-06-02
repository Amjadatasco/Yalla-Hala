import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">

      <div className="text-center">

        <h1 className="text-8xl font-extrabold text-[#111827]">
          404
        </h1>

        <h2 className="mt-6 text-4xl font-bold text-[#111827]">
          الصفحة غير موجودة
        </h2>

        <p className="mt-4 text-lg text-[#6B7280]">
          الصفحة التي تبحث عنها غير متوفرة
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-2xl bg-[#3FAF9B] px-8 py-4 text-lg font-bold text-white"
        >
          العودة للرئيسية
        </Link>

      </div>

    </main>
  );
}
