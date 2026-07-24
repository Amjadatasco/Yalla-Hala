"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // تسجيل الـ Service Worker لـ PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("Service Worker registered successfully with scope: ", registration.scope);
        },
        (err) => {
          console.log("Service Worker registration failed: ", err);
        }
      );
    }

    // التحقق من نظام iOS لإظهار الإرشادات
    if (typeof window !== "undefined") {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
      const isDismissed = localStorage.getItem("ios_pwa_prompt_dismissed");
      
      if (isIOS && !isStandalone && !isDismissed) {
        setShowIOSPrompt(true);
      }
    }

    // إمساك حدث التثبيت الخاص بالأندرويد
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidPrompt(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowAndroidPrompt(false);
      console.log("PWA installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 45000); // check every 45s
    return () => clearInterval(interval);
  }, [user]);

  async function checkNotifications() {
    try {
      const list: any[] = [];
      const ADMIN_EMAIL = "0995688838@yallahala.local";

      // 1. If Admin or Owner
      if (user) {
        const isAdmin = user.email === ADMIN_EMAIL;
        if (isAdmin) {
          // Fetch pending bookings count
          const { data: pendingBookings, error } = await supabase
            .from("bookings")
            .select("id, guest_name, created_at, property_id")
            .eq("status", "pending")
            .order("id", { ascending: false });

          if (!error && pendingBookings) {
            // Fetch property titles
            const propIds = pendingBookings.map((b) => b.property_id);
            const { data: props } = await supabase
              .from("properties")
              .select("id, title")
              .in("id", propIds);

            pendingBookings.forEach((b) => {
              const prop = props?.find((p) => p.id === b.property_id);
              list.push({
                id: `booking-${b.id}`,
                title: "طلب حجز جديد بانتظار الموافقة 📅",
                message: `المستأجر ${b.guest_name} طلب حجز عقار "${prop?.title || "عقار"}"`,
                time: b.created_at,
                link: "/admin-dashboard"
              });
            });
          }
        } else {
          // Owner: fetch their properties
          const { data: ownerProps } = await supabase
            .from("properties")
            .select("id, title")
            .eq("user_id", user.id);

          if (ownerProps && ownerProps.length > 0) {
            const propIds = ownerProps.map((p) => p.id);
            const { data: ownerPendingBookings, error } = await supabase
              .from("bookings")
              .select("id, guest_name, created_at, property_id")
              .eq("status", "pending")
              .in("property_id", propIds)
              .order("id", { ascending: false });

            if (!error && ownerPendingBookings) {
              ownerPendingBookings.forEach((b) => {
                const prop = ownerProps.find((p) => p.id === b.property_id);
                list.push({
                  id: `booking-${b.id}`,
                  title: "طلب حجز معلق لعقارك ⏳",
                  message: `الزبون ${b.guest_name} بانتظار تأكيدك لعقار "${prop?.title}"`,
                  time: b.created_at,
                  link: "/owner-dashboard"
                });
              });
            }
          }
        }
      }

      // 2. Check guest bookings in localStorage
      if (typeof window !== "undefined") {
        const localBookings = JSON.parse(localStorage.getItem("yallahala_guest_bookings") || "[]");
        if (localBookings.length > 0) {
          const bookingIds = localBookings.map((b: any) => b.id);
          const { data: dbBookings } = await supabase
            .from("bookings")
            .select("id, status, property_id")
            .in("id", bookingIds);

          if (dbBookings && dbBookings.length > 0) {
            const updatedLocalBookings = [...localBookings];
            let changed = false;

            for (const localB of updatedLocalBookings) {
              const dbB = dbBookings.find((d) => d.id === localB.id);
              if (dbB && dbB.status !== localB.status) {
                localB.status = dbB.status;
                changed = true;

                if (dbB.status === "confirmed") {
                  list.push({
                    id: `confirmed-${dbB.id}`,
                    title: "🎉 تم تأكيد حجزك بنجاح!",
                    message: `تم قبول وتأكيد طلب حجزك لعقار "${localB.propertyTitle}" من قبل المالك.`,
                    time: new Date().toISOString(),
                    link: "/track"
                  });
                } else if (dbB.status === "rejected") {
                  list.push({
                    id: `rejected-${dbB.id}`,
                    title: "⚠️ تم رفض طلب حجزك",
                    message: `نعتذر منك، تم رفض طلب حجزك لعقار "${localB.propertyTitle}".`,
                    time: new Date().toISOString(),
                    link: "/track"
                  });
                }
              }
            }

            if (changed) {
              localStorage.setItem("yallahala_guest_bookings", JSON.stringify(updatedLocalBookings));
            }
          }
        }
      }

      // Sort notifications by time
      list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      // Save previous notifications length to compare unread
      const prevCount = parseInt(localStorage.getItem("yallahala_notifications_read_count") || "0");
      setNotifications(list);
      setUnreadNotificationsCount(Math.max(0, list.length - prevCount));
    } catch (e) {
      console.error("Notifications error:", e);
    }
  }

  function handleMarkNotificationsRead() {
    localStorage.setItem("yallahala_notifications_read_count", String(notifications.length));
    setUnreadNotificationsCount(0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleAndroidInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to PWA install: ${outcome}`);
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>
          منصة يلا هلا | حجوزات الشاليهات والعقارات السياحية في سوريا
        </title>

        <meta
          name="description"
          content="بيتك البعيد عن بيتك. تصفح واحجز أفضل الشاليهات، الفلل، والمزارع للإقامات قصيرة الأجل في سوريا بكل سهولة وأمان ونظام إشعارات فوري."
        />

        <meta
          name="keywords"
          content="يلا هلا, حجز شاليهات سوريا, شاليهات اللاذقية, شاليهات طرطوس, مزارع ريف دمشق, شاليهات اللاذقية للايجار, مزارع للايجار في سوريا, فلل حمص, عقارات سياحية سوريا, إقامة قصيرة الأجل"
        />

        {/* وسوم Open Graph لتسهيل وتحسين شكل مشاركة الروابط على فيسبوك وواتساب */}
        <meta property="og:title" content="منصة يلا هلا | حجوزات الشاليهات والعقارات السياحية في سوريا" />
        <meta property="og:description" content="تصفح واحجز أفضل الشاليهات، الفلل، والمزارع للإقامات قصيرة الأجل في سوريا بكل سهولة وأمان ونظام إشعارات فوري." />
        <meta property="og:image" content="https://yallahala.com/logo.jpg" />
        <meta property="og:url" content="https://yallahala.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SY" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D6A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="يلا هلا" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>

      <body className="bg-[#FAFAFA] text-[#1F2937] overflow-x-hidden antialiased">

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-V5QW92L6J0"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">

              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-white border border-gray-100 transition-transform duration-300 group-hover:scale-105 shadow-sm">

                <img
                  src="/logo.jpg"
                  alt="Yalla Hala Logo"
                  className="h-full w-full object-contain p-0.5"
                />

              </div>

              <div className="flex flex-col justify-center text-right items-start">

                <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight group-hover:text-[#2D6A5F] transition duration-200 leading-none text-right w-full">
                  Yalla Hala
                </h1>

                <p className="text-[10px] sm:text-xs font-bold text-[#CF9E59] mt-1.5 tracking-wide leading-none text-right w-full">
                  بيتك البعيد عن بيتك
                </p>

              </div>

            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#4B5563]">

              <Link
                href="/"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                الرئيسية
              </Link>

              <Link
                href="/add-property"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                أضف عقارك
              </Link>

              <Link
                href="/track"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                تتبع حجزي 🔍
              </Link>

              <Link
                href="/about"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                من نحن
              </Link>

            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3 shrink-0 relative">

              {/* أيقونة الإشعارات لنسخة الكمبيوتر */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    if (!showNotificationsDropdown) {
                      handleMarkNotificationsRead();
                    }
                  }}
                  className="p-2.5 rounded-full hover:bg-gray-150 text-gray-600 hover:text-[#2D6A5F] transition relative focus:outline-none cursor-pointer"
                >
                  🔔
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* قائمة الإشعارات المنسدلة للكمبيوتر */}
                {showNotificationsDropdown && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 text-right animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-[#F8FFFD] px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-row-reverse">
                      <span className="font-black text-xs text-[#2D6A5F]">🔔 مركز الإشعارات</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        مسح الكل
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-xs text-gray-400 text-center font-bold">لا توجد إشعارات حالياً.</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link}
                            onClick={() => setShowNotificationsDropdown(false)}
                            className="block px-4 py-3 hover:bg-gray-50/80 transition text-right"
                          >
                            <h5 className="font-extrabold text-xs text-gray-900 leading-tight">{n.title}</h5>
                            <p className="text-[10px] text-gray-500 font-bold mt-1 leading-normal">{n.message}</p>
                            <span className="text-[8px] text-gray-400 font-medium mt-1 block">
                              {new Date(n.time).toLocaleTimeString("ar-SY", { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-2 bg-[#E6F4F1] px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                    <span className="text-xs font-bold text-[#2D6A5F]">
                      {user.user_metadata?.full_name || "مرحباً بك"}
                    </span>
                  </div>

                  <Link
                    href="/owner-dashboard"
                    className="bg-[#2D6A5F] hover:bg-[#24564d] text-white text-xs font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    لوحة التحكم
                  </Link>

                  <Link
                    href="/user-dashboard"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white text-xs font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    حجوزاتي
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-[#2D6A5F] hover:text-[#3FAF9B] transition duration-200 px-2 py-1"
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/register"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm px-5 py-2.5 rounded-full transition duration-200 shadow-sm"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}

            </div>

            {/* Mobile Notifications & Menu Button Container */}
            <div className="md:hidden flex items-center gap-2">
              
              {/* أيقونة الإشعارات للموبايل */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    if (!showNotificationsDropdown) {
                      handleMarkNotificationsRead();
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition relative focus:outline-none cursor-pointer"
                >
                  🔔
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* قائمة الإشعارات للموبايل */}
                {showNotificationsDropdown && (
                  <div className="fixed left-4 right-4 mt-2 bg-white rounded-2xl border border-gray-150 shadow-2xl overflow-hidden z-50 text-right">
                    <div className="bg-[#F8FFFD] px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-row-reverse">
                      <span className="font-black text-xs text-[#2D6A5F]">🔔 مركز الإشعارات</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        مسح الكل
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-xs text-gray-400 text-center font-bold">لا توجد إشعارات حالياً.</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link}
                            onClick={() => setShowNotificationsDropdown(false)}
                            className="block px-4 py-3 hover:bg-gray-50 transition text-right"
                          >
                            <h5 className="font-extrabold text-xs text-gray-900 leading-tight">{n.title}</h5>
                            <p className="text-[10px] text-gray-500 font-bold mt-1 leading-normal">{n.message}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-[#2D6A5F] focus:outline-none"
                aria-label="Toggle Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

            </div>

          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (

            <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-inner">

              <nav className="flex flex-col gap-3 font-bold text-sm text-[#4B5563]">

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  الرئيسية
                </Link>

                <Link
                  href="/add-property"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  أضف عقارك
                </Link>

                <Link
                  href="/track"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  تتبع حجزي 🔍
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  من نحن
                </Link>

              </nav>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">

                {user ? (

                  <>
                    <div className="flex items-center justify-between bg-[#E6F4F1] px-4 py-2 rounded-xl border border-emerald-100">

                      <span className="text-xs font-bold text-[#2D6A5F]">
                        {user.user_metadata?.full_name || "مرحباً بك"}
                      </span>

                    </div>

                    <Link
                      href="/owner-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#2D6A5F] text-white font-bold py-2 rounded-full transition"
                    >
                      لوحة التحكم
                    </Link>

                    <Link
                      href="/user-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#CF9E59] text-white font-bold py-2 rounded-full transition"
                    >
                      حجوزاتي
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full transition"
                    >
                      خروج
                    </button>
                  </>

                ) : (

                  <div className="flex flex-col gap-2">

                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center text-sm font-bold text-[#2D6A5F] py-2 border border-[#2D6A5F] rounded-full transition"
                    >
                      تسجيل الدخول
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm py-2.5 rounded-full transition shadow-sm"
                    >
                      إنشاء حساب
                    </Link>

                  </div>

                )}

              </div>

            </div>

          )}

        </header>

        {/* PAGE CONTENT */}
        <main>
          {children}
        </main>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">

          <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">

            <div className="text-right">

              <div className="flex items-center gap-4 mb-4">

                <div className="h-12 w-12 bg-white/10 rounded-xl p-1.5">

                  <img
                    src="/logo.jpg"
                    alt="Yalla Hala Logo"
                    className="h-full w-full object-contain brightness-110"
                  />

                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  Yalla Hala
                </h3>

              </div>

              <p className="leading-7 text-sm text-gray-200">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية بأسلوب حديث وتجربة سهلة وسريعة.
              </p>

              {/* شبكات التواصل الاجتماعي */}
              <div className="mt-6 flex items-center gap-3 justify-start">
                <a
                  href="https://www.facebook.com/share/1EbeNX97UR/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  title="تابعنا على فيسبوك"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/yallahala.sy?igsh=MTZwZWpscG5mZDkwcg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  title="تابعنا على إنستغرام"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>

            </div>

            <div className="text-right">

              <h3 className="text-lg font-bold text-white mb-4">
                روابط سريعة
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-200">

                <Link href="/" className="hover:text-white transition">
                  تصفح العقارات
                </Link>

                <Link
                  href="/add-property"
                  className="hover:text-white transition"
                >
                  أضف عقارك
                </Link>

                <Link
                  href="/about"
                  className="hover:text-white transition"
                >
                  من نحن
                </Link>

                <Link
                  href="/terms"
                  className="hover:text-white transition"
                >
                  شروط الاستخدام
                </Link>

                <Link
                  href="/privacy"
                  className="hover:text-white transition"
                >
                  سياسة الخصوصية
                </Link>

              </div>

            </div>

            <div className="text-right">

              <h3 className="text-lg font-bold text-white mb-4">
                الدعم والتواصل
              </h3>

              <div className="space-y-3 text-sm text-gray-200 flex flex-col">

                <p className="hover:underline cursor-pointer">
                  contact@yallahala.com
                </p>

                <a
                  href="https://wa.me/46790081236"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-emerald-300 transition font-bold mt-1"
                >

                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.944 14.068.92 11.451.92 6.015.92 1.593 5.29 1.59 10.72c-.001 1.684.449 3.323 1.302 4.774l-.979 3.578 3.734-.968z" />
                  </svg>

                  <span>واتساب:</span>

                  <span dir="ltr" className="tracking-wide">
                    +46790081236
                  </span>

                </a>

                <a
                  href="https://www.facebook.com/share/1EbeNX97UR/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-gray-200 transition font-bold mt-1"
                >
                  <svg className="w-4 h-4 fill-current text-white/90" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>فيسبوك:</span>
                  <span className="font-normal text-xs text-gray-300">Yalla Hala</span>
                </a>

                <a
                  href="https://www.instagram.com/yallahala.sy?igsh=MTZwZWpscG5mZDkwcg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-gray-200 transition font-bold mt-1"
                >
                  <svg className="w-4 h-4 fill-current text-white/90" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>إنستغرام:</span>
                  <span dir="ltr" className="font-normal text-xs text-gray-300">@yallahala.sy</span>
                </a>

              </div>

            </div>

          </div>

          <div className="border-t border-[#23534A] py-5 text-center text-xs text-gray-300">
            © 2026 Yalla Hala. All rights reserved.
          </div>

        </footer>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V5QW92L6J0"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-V5QW92L6J0', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="4754c078-41b3-472a-9d24-a04874d18646"
          strategy="lazyOnload"
        />

        {/* زر الدعم الفني العائم الواتساب */}
        <a
          href="https://wa.me/46790081236?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AF%D8%B9%D9%85%20%D9%8A%D9%84%D8%A7%20%D9%87%D9%84%D8%A7%20%F0%9F%91%8B"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-bounce"
          style={{ animationDuration: '4s' }}
          title="تواصل مع الدعم الفني"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.944 14.068.92 11.451.92 6.015.92 1.593 5.29 1.59 10.72c-.001 1.684.449 3.323 1.302 4.774l-.979 3.578 3.734-.968z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 ease-out font-bold text-[11px] whitespace-nowrap">
            الدعم الفني
          </span>
        </a>

        {/* نافذة التثبيت الإرشادية الخاصة بـ iOS */}
        {showIOSPrompt && (
          <div className="fixed bottom-4 left-4 right-4 z-50 p-1 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-[28px] border border-gray-100 shadow-2xl p-6 text-right relative">
              <button
                onClick={() => {
                  setShowIOSPrompt(false);
                  localStorage.setItem("ios_pwa_prompt_dismissed", "true");
                }}
                className="absolute top-4 left-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 flex-row-reverse border-b border-gray-100 pb-3.5 mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#2D6A5F] text-xl shrink-0">
                  📲
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900">تثبيت تطبيق يلا هلا على الآيفون</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">تصفح أسرع وحجوزات فورية مباشرة من شاشتك</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                لتثبيت التطبيق على جهاز الآيفون الخاص بك، يرجى اتباع الآتي:
              </p>
              
              <ul className="mt-3.5 space-y-3 text-xs text-gray-700 font-bold pr-1">
                <li className="flex items-center gap-2.5 flex-row-reverse">
                  <span className="w-5 h-5 rounded-full bg-[#E6F4F1] text-[#2D6A5F] flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                  <span>اضغط على زر **مشاركة** <span className="inline-block bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-[10px]">↩️</span> في متصفح سفاري بالأسفل.</span>
                </li>
                <li className="flex items-center gap-2.5 flex-row-reverse">
                  <span className="w-5 h-5 rounded-full bg-[#E6F4F1] text-[#2D6A5F] flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <span>اختر **إضافة إلى الشاشة الرئيسية** <span className="inline-block bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-[10px]">➕</span> من القائمة.</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  setShowIOSPrompt(false);
                  localStorage.setItem("ios_pwa_prompt_dismissed", "true");
                }}
                className="w-full mt-5 py-3 rounded-2xl bg-[#2D6A5F] hover:bg-[#1E4E45] text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                فهمت، شكراً
              </button>
            </div>
          </div>
        )}

        {/* نافذة التثبيت المباشرة الخاصة بالأندرويد */}
        {showAndroidPrompt && (
          <div className="fixed bottom-4 left-4 right-4 z-50 p-1 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-[28px] border border-gray-100 shadow-2xl p-6 text-right relative flex flex-col gap-4">
              <button
                onClick={() => setShowAndroidPrompt(false)}
                className="absolute top-4 left-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 flex-row-reverse border-b border-gray-100 pb-3.5 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#2D6A5F] text-xl shrink-0">
                  🤖
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900 font-sans">تثبيت تطبيق يلا هلا للأندرويد</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">ثبّت التطبيق بضغطة زر واحدة لتصفح وحجوزات أسرع</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                هل تريد إضافة تطبيق يلا هلا إلى شاشتك الرئيسية للوصول السريع والآمن في أي وقت؟
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleAndroidInstallClick}
                  className="flex-1 py-3 rounded-2xl bg-[#2D6A5F] hover:bg-[#1E4E45] text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  📥 تثبيت التطبيق الآن
                </button>
                <button
                  onClick={() => setShowAndroidPrompt(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-xs transition cursor-pointer"
                >
                  ليس الآن
                </button>
              </div>
            </div>
          </div>
        )}

      </body>
    </html>
  );
}
