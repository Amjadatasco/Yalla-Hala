import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yalla Hala",
  description: "بيتك البعيد من بيتك",
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative h-11 w-11 rounded-2xl bg-[var(--brand-primary)] shadow-sm">
        <div className="absolute inset-x-2 top-2 h-3 rounded-t-full bg-white/95" />
        <div className="absolute inset-x-3 top-4 h-4 rounded-sm bg-white/95" />
        <div className="absolute bottom-2 left-1/2 h-3 w-2 -translate-x-1/2 rounded-sm bg-[var(--brand-primary)]" />
      </div>
      <div className="text-right">
        <div className="text-xl font-extrabold tracking-tight text-[var(--brand-dark)]">
          Yalla Hala
        </div>
        <div className="text-xs text-[var(--brand-muted)]">بيتك البعيد من بيتك</div>
      </div>
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[var(--brand-bg)] text-[var(--brand-dark)] antialiased">
        <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <Logo />

            <nav className="hidden items-center gap-2 md:flex">
              <Link
                href="/"
                className="rounded-full bg-[var(--brand-dark)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[var(--brand-line)] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-soft)]"
              >
                من نحن
              </Link>
              <Link
                href="/add-property"
                className="rounded-full border border-[var(--brand-line)] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--brand-soft)]"
              >
                أضف عقارك
              </Link>
              <a
                href="https://wa.me/963995688838?text=مرحبًا، أريد إرسال طلب حجز عبر Yalla Hala"
                target="_blank"
                className="rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                احجز الآن
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-[var(--brand-line)] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <h4 className="text-lg font-extrabold text-[var(--brand-dark)]">Yalla Hala</h4>
              <p className="mt-1 text-sm text-[var(--brand-muted)]">بيتك البعيد من بيتك</p>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
              منصة أولية للسكن المؤقت في سوريا، بتجربة واضحة ومرتبة وآمنة قدر الإمكان
              للطرفين.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}