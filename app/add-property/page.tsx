"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const governorates = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", 
  "طرطوس", "إدلب", "درعا", "السويداء", "القنيطرة", 
  "دير الزور", "الرقة", "الحسكة",
];

const propertyTypes = ["شقة", "فيلا", "مزرعة", "غرفة", "شاليه"];

export default function AddPropertyPage() {
  // حالات برمجية لربط حقول المالك والبيانات الناقصة في الكود القديم
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [location, setLocation] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // 🚀 دمج الحسابات الشخصية الخاصة بك لتلقي إشعارات العقارات الجديدة
  const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
  const TELEGRAM_CHAT_ID = "629151535";

  // دالة مخصصة لإرسال تقرير فوري إلى تليجرام عند رفع عقار جديد
  async function sendTelegramNewPropertyNotification() {
    try {
      const messageText = 
        `🆕 *إشعار: عقار جديد مضاف ينتظر المراجعة!* 🆕\n\n` +
        `👤 *صاحب العقار:* ${ownerName}\n` +
        `📞 *الهاتف:* ${ownerPhone}\n` +
        `✉️ *الإيميل:* ${ownerEmail || "لا يوجد"}\n\n` +
        `🏠 *عنوان العقار:* ${title}\n` +
        `🗂️ *النوع:* ${selectedType} | 📍 *المحافظة:* ${selectedGov}\n` +
        `🗺️ *المنطقة:* ${location} - ${neighborhood || "غير محدد"}\n` +
        `💰 *السعر المطلوب:* $${price} / ليلة\n\n` +
        `🛏️ *المواصفات:* ${rooms || 0} غرف | ${beds || 0} أسرة | ${bathrooms || 0} حمامات\n` +
        `📝 *التجهيزات:* ${amenities || "لم تذكر"}\n\n` +
        `⏳ _يرجى الدخول للوحة التحكم لمراجعة العقار وتفعيل النشر._`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "Markdown"
        })
      });
    } catch (err) {
      console.error("Telegram property notification failed:", err);
    }
  }

  async function handleAddProperty() {
    if (!ownerName.trim() || !ownerPhone.trim() || !title.trim() || !price || !selectedGov || !selectedType) {
      alert("يرجى ملء البيانات الأساسية: (اسم المالك، الهاتف، عنوان العقار، السعر، المحافظة، ونوع العقار).");
      return;
    }

    try {
      setLoading(true);
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error(uploadError);
            alert(`فشل رفع الصورة: ${imageFile.name}`);
            setLoading(false);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(uploadData.path);

          imageUrls.push(publicUrlData.publicUrl);
        }
      }

      const { error } = await supabase
        .from("properties")
        .insert([
          {
            title: title.trim(),
            type: selectedType,
            governorate: selectedGov,
            location: location.trim(),
            neighborhood: neighborhood.trim(),
            price: Number(price),
            description: description.trim(),
            amenities: amenities.trim(),
            rooms_count: rooms ? Number(rooms) : null,
            beds_count: beds ? Number(beds) : null,
            bathrooms_count: bathrooms ? Number(bathrooms) : null,
            owner_name: ownerName.trim(),
            owner_phone: ownerPhone.trim(),
            owner_email: ownerEmail.trim(),
            image: imageUrls[0] || "",
            images_list: imageUrls,
            status: "pending",
          },
        ]);

      if (error) {
        console.error("Supabase insert error:", error);
        alert(`حدث خطأ أثناء حفظ العقار: ${error.message}`);
        setLoading(false);
        return;
      }

      // تفعيل الإشعار الفوري وإرساله إلى حساب تليجرام الخاص بك
      await sendTelegramNewPropertyNotification();

      alert("🎉 تم إرسال عقارك بنجاح! سيتم مراجعته وتفعيله من قبل الإدارة فوراً.");
      
      clearForm();
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  }

  function clearForm() {
    setOwnerName(""); setOwnerPhone(""); setOwnerEmail("");
    setTitle(""); setSelectedType(""); setSelectedGov("");
    setLocation(""); setNeighborhood(""); setPrice("");
    setRooms(""); setBeds(""); setBathrooms("");
    setDescription(""); setAmenities(""); setImageFiles([]);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-10 sm:py-14" dir="rtl">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-right">
          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight">
            أضف عقارك السكني
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280]">
            أضف معلومات العقار بشكل احترافي دقيق، وسيتم مراجعته من قبل مسؤولي منصة يلا هلا قبل النشر الفعلي.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-sm space-y-6">
          
          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">📋 بيانات مالك العقار للتواصل</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم صاحب العقار الكامل"
            />
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="رقم الهاتف الفعال (واتساب)"
            />
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="البريد الإلكتروني (اختياري)"
            />
          </div>

          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">🏠 مواصفات وموقع المسكن</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم العقار التجاري أو عنوان تسويقي مختصر"
            />

            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] text-gray-700 font-medium cursor-pointer"
            >
              <option value="">اختر نوع العقار</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select 
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] text-gray-700 font-medium cursor-pointer"
            >
              <option value="">اختر المحافظة السورية</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="المدينة أو البلدة"
            />
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="الحي أو الشارع أو المعلم المقارب"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
              placeholder="التكلفة التقديرية بالدولار / ليلة"
            />
          </div>

          <div className="grid gap-4 grid-cols-3">
            <input
              type="number"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الغرف الإجمالي"
            />
            <input
              type="number"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الأسرة المتوفرة"
            />
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الحمامات"
            />
          </div>

          <div className="grid gap-4 mt-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none transition focus:border-[#3FAF9B] leading-6"
              placeholder="اكتب وصفاً جذاباً وتفصيلياً عن المسكن وإطلالته ومميزاته الفريدة..."
            />
            <textarea
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="min-h-[90px] rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none transition focus:border-[#3FAF9B] leading-6"
              placeholder="التجهيزات الخدمية المتوفرة (مثال: إنترنت سريع، تكييف مستقل، منظومة طاقة شمسية، مياه ساخنة، مطبخ متكامل...)"
            />
          </div>

          {/* بوكس تحميل الصور */}
          <div className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-right text-lg font-bold text-[#111827]">🖼️ ألبوم صور العقار الحية</h2>
            <p className="mb-4 text-right text-xs text-[#6B7280]">يمكنك تحديد واختيار مجموعة صور واضحة وواقعية لرفع جاذبية العقار.</p>
            
            <label
              htmlFor="property-image"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#3FAF9B] bg-[#F8FFFD] px-4 text-center transition hover:bg-[#F1FFFB]"
            >
              <div className="mb-2 text-4xl text-[#3FAF9B]">⬆</div>
              <h3 className="text-base font-bold text-[#111827]">رفع ألبوم الصور</h3>
              <p className="mt-1 text-xs text-[#4B5563]">اضغط لتحديد الصور من ملفات جهازك المسموحة (JPG, PNG, WEBP)</p>
              <input
                id="property-image"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                className="hidden"
              />
            </label>

            {imageFiles.length > 0 && (
              <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-right">
                <p className="text-xs font-bold text-[#111827] mb-2">📎 الملفات المرفوعة حالياً ({imageFiles.length}):</p>
                <ul className="text-xs text-[#6B7280] space-y-1">
                  {imageFiles.map((file, idx) => (
                    <li key={idx} className="truncate">• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <h2 className="mb-2 text-right text-sm font-bold text-gray-800">⚠️ شروط النشر والمراجعة القانونية:</h2>
            <ul className="text-xs text-gray-500 space-y-2 text-right leading-5">
              <li>• يجب أن تكون كافة المعلومات حقيقية وتحت مسؤولية صاحب العقار القانونية.</li>
              <li>• يمنع تماماً رفع عقارات وهمية، مكررة، أو بصور مضللة لا تعكس واقع العقار.</li>
              <li>• تخضع طلبات الرفع لمراجعة دقيقة من الإدارة، ويتم تفعيلها على المنصة بعد الموافقة.</li>
            </ul>
          </div>

          <button
            onClick={handleAddProperty}
            disabled={loading}
            className="w-full rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-bold text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "جاري رفع الصور وتأمين البيانات..." : "إرسال العقار للمراجعة الفورية"}
          </button>

        </div>
      </div>
    </main>
  );
}