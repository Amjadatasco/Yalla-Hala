"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const scenes = [
  {
    id: 1,
    image: "/promo/scene1.jpg",
    text1: "تبحث عن عطلة مثالية؟",
    text2: "استكشف أفخم الشاليهات والعقارات السياحية",
    duration: 5000,
  },
  {
    id: 2,
    image: "/promo/scene2.jpg",
    text1: "بضغطة زر واحدة..",
    text2: "احجز شاليهك المفضل وادفع مباشرة عبر التطبيق",
    duration: 5000,
  },
  {
    id: 3,
    image: "/promo/scene3.jpg",
    text1: "راحة بالك تهمنا",
    text2: "نضمن لك مستأجرين موثقين وعطلة آمنة لعائلتك",
    duration: 5000,
  },
  {
    id: 4,
    image: "", // No image, just logo
    text1: "يلا هلا",
    text2: "بيتك البعيد عن بيتك.. حمل التطبيق الآن!",
    duration: 5000,
  },
];

export default function PromoVideoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentSceneIndex < scenes.length) {
      timer = setTimeout(() => {
        if (currentSceneIndex === scenes.length - 1) {
          setIsFinished(true);
          setIsPlaying(false);
        } else {
          setCurrentSceneIndex((prev) => prev + 1);
        }
      }, scenes[currentSceneIndex].duration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex]);

  const startVideo = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setCurrentSceneIndex(0);
  };

  const currentScene = scenes[currentSceneIndex];

  return (
    <div dir="rtl" className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col">
      {/* Background Images */}
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSceneIndex && !isFinished
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          {scene.image ? (
            <>
              <Image
                src={scene.image}
                alt="Scene"
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
            </div>
          )}
        </div>
      ))}

      {/* Content Overlay */}
      {isPlaying && !isFinished && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-12 z-10">
          <style>{`
            @keyframes slideUpFade {
              0% { opacity: 0; transform: translateY(40px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-text-title {
              animation: slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-text-subtitle {
              opacity: 0;
              animation: slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
            }
          `}</style>
          <h1
            key={`title-${currentScene.id}`}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-text-title drop-shadow-2xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            {currentScene.text1}
          </h1>
          <p
            key={`subtitle-${currentScene.id}`}
            className="text-2xl md:text-3xl font-medium text-white drop-shadow-xl animate-text-subtitle max-w-3xl leading-relaxed"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            {currentScene.text2}
          </p>
        </div>
      )}

      {/* Start / Replay Overlay */}
      {(!isPlaying || isFinished) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              الفيديو الترويجي لـ يلا هلا
            </h2>
            <p className="text-gray-300 text-lg">
              اضغط تشغيل وابدأ بتسجيل الشاشة للحصول على الفيديو
            </p>
          </div>
          <button
            onClick={startVideo}
            className="group flex items-center gap-3 text-white px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl"
            style={{ backgroundColor: 'var(--brand-primary)', boxShadow: '0 10px 25px -5px rgba(46, 111, 119, 0.4)' }}
          >
            {isFinished ? (
              <>
                <svg className="w-6 h-6 group-hover:-rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إعادة التشغيل
              </>
            ) : (
              <>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                تشغيل الفيديو
              </>
            )}
          </button>

          <Link
            href="/"
            className="mt-8 text-white/70 hover:text-white underline underline-offset-4"
          >
            العودة للرئيسية
          </Link>
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20">
          <div
            className="h-full transition-all ease-linear"
            style={{
              backgroundColor: 'var(--brand-accent)',
              width: `${((currentSceneIndex + 1) / scenes.length) * 100}%`,
              transitionDuration: `${currentScene.duration}ms`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
