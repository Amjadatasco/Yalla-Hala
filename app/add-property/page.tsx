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

  const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
  const TELEGRAM_CHAT_ID = "629151535";

  async function sendTelegramNewPropertyNotification() {
    try {
      const messageText = 
        `🆕 *إشعار: عقار جديد مضاف ينتظر المراجعة!* 🆕\n\n` +
        `🏠 *العقار:* ${title}\n` +
        `🗂️ *النوع:* ${selectedType} | 📍 *المحافظة:* ${selectedGov}\n` +
        `🗺️ *المنطقة:* ${location} - ${neighborhood || "غير محدد"}\n` +
        `💰 *السعر المطلوب:* $${price} / ليلة\n\n` +
        `👤 *صاحب العقار (المؤجر):* ${ownerName}\n` +
        `📞 *رقم هاتف المؤجر:* ${ownerPhone}\n` +
        `✉️ *الإيميل:* ${ownerEmail || "لا يوجد"}\n\n` +
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
    if (!ownerName.trim() || !ownerPhone.trim() || !title.trim() || !price || !selectedGov || !selectedType || !location.trim()) {
      alert("⚠️ خطأ: يرجى تعبئة كافة الحقول الإلزامية المطلوبة المحددة بالنجمة (*) أولاً.");
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
            أضف معلومات العقار بشكل احترافي دقيق، وسيتم مراجعته من قبل مسؤولي منصة يلا هلا قبل النشر الفعلي. الحقول المميزة بـ (<span className="text-red-500">*</span>) هي حقول إجبارية.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-sm space-y-6">
          
          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">
            📋 بيانات مالك العقار للتواصل <span className="text-red-500 text-xs font-normal">(إجباري)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">اسم صاحب العقار الكامل <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
                placeholder="مثال: أحمد محمد"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">رقم الهاتف الفعال (واتساب) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
                placeholder="مثال: 0933xxxxxx"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-500">البريد الإلكتروني <span className="text-gray-400 font-normal">(اختياري)</span></label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
                placeholder="البريد الإلكتروني"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">
            🏠 مواصفات وموقع المسكن <span className="text-red-500 text-xs font-normal">(إجباري)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">عنوان العقار أو اسم تسويقي <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
                placeholder="مثال: شاليه الريحان السكني الفاخر"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">نوع العقار من القائمة <span className="text-red-500">*</span></label>
              <select 
                required
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B] text-gray-700 font-medium cursor-pointer"
              >
                <option value="">اختر نوع العقار</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">المحافظة <span className="text-red-500">*</span></label>
              <select 
                required
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B] text-gray-700 font-medium cursor-pointer"
              >
                <option value="">اختر المحافظة السورية</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">المدينة أو البلدة <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
                placeholder="مثال: حمص، مشتى الحلو..."
              />
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-500">الحي أو الشارع أو المعلم المقارب <span className="text-gray-400 font-normal">(اختياري)</span></label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B]"
                placeholder="مثال: بجانب الساحة الرئيسية"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700">التكلفة لليلة بالدولار ($) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none transition focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
                placeholder="مثال: 150"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">📋 التجهيزات وعدد الغرف الداخلي <span className="text-gray-400 text-xs font-normal">(اختياري)</span></h2>
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