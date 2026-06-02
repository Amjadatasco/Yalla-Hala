"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const governorates = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة",
];

const propertyTypes = [
  "شقة",
  "فيلا",
  "مزرعة",
  "غرفة",
  "شاليه",
];

// القائمة الافتراضية للتجهيزات والخدمات المناسبة لسوريا
const defaultAmenitiesList = [
  "مسبح",
  "مسبح أطفال",
  "غسالة",
  "غسالة صحون",
  "مشوى",
  "سياخ للشوي",
  "تراس",
  "كراسي وطاولات",
  "ألعاب أطفال",
  "مكيف",
  "مطبخ مجهز",
  "ماء ساخن",
  "كهرباء 24 ساعة",
  "إنترنت (واي فاي)",
  "منظومة طاقة شمسية",
  "مولد كهربائي",
  "خزان مياه إضافي",
  "تدفئة (شوفاج/مازوت)",
  "كراج سيارات",
  "حارس عقار"
];

// دالة ضغط الصور وتحويلها إلى WebP برمجياً لدى العميل
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // أقصى حجم للأبعاد هو 1200 بكسل
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp",
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.82 // ضغط بجودة 82% وهي مثالية جداً للتسريع وتوفير الحجم
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AddPropertyPage() {
  // بيانات المؤجر
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // بيانات العقار
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [location, setLocation] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");

  // المواصفات
  const [rooms, setRooms] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");

  // الوصف
  const [description, setDescription] = useState("");

  // التجهيزات والخدمات المحددة والمخصصة
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  // الصور
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // تحميل
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  // تيليغرام
  const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
  const TELEGRAM_CHAT_ID = "629151535";

  // تفعيل / إلغاء تحديد التجهيزات
  const handleToggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  // إضافة خدمة مخصصة جديدة من قبل المستخدم
  const handleAddCustomAmenity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedValue = customInput.trim();
    if (!trimmedValue) return;

    // منع التكرار في القائمة
    if (!defaultAmenitiesList.includes(trimmedValue) && !customAmenities.includes(trimmedValue)) {
      setCustomAmenities((prev) => [...prev, trimmedValue]);
    }

    // تحديدها تلقائياً
    if (!selectedAmenities.includes(trimmedValue)) {
      setSelectedAmenities((prev) => [...prev, trimmedValue]);
    }

    setCustomInput("");
  };

  // إشعار تيليغرام
  async function sendTelegramNewPropertyNotification() {
    try {
      const messageText =
        `🆕 عقار جديد بانتظار المراجعة\n\n` +
        `🏠 العقار:\n${title}\n\n` +
        `🗂️ النوع:\n${selectedType}\n\n` +
        `📍 المحافظة:\n${selectedGov}\n\n` +
        `🗺️ الموقع:\n${location}\n\n` +
        `👤 اسم المؤجر:\n${ownerName}\n\n` +
        `📞 رقم الهاتف:\n${ownerPhone}\n\n` +
        `💰 السعر:\n$${price} USD\n\n` +
        `🕒 وقت الدخول:\n${checkInTime}\n\n` +
        `🕒 وقت الخروج:\n${checkOutTime}\n\n` +
        `🛠️ التجهيزات المحددة:\n${selectedAmenities.join(" - ") || "لا يوجد"}\n\n` +
        `🟡 الحالة:\nPending`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
          }),
        }
      );
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  }

  // تنظيف الفورم
  function clearForm() {
    setOwnerName("");
    setOwnerPhone("");
    setOwnerEmail("");

    setTitle("");
    setSelectedType("");
    setSelectedGov("");

    setLocation("");
    setNeighborhood("");
    setPrice("");

    setRooms("");
    setBeds("");
    setBathrooms("");
    setCheckInTime("14:00");
    setCheckOutTime("12:00");

    setDescription("");
    setSelectedAmenities([]);
    setCustomAmenities([]);
    setCustomInput("");

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setImageFiles([]);
  }

  // إضافة العقار
  async function handleAddProperty() {
    if (
      !ownerName.trim() ||
      !ownerPhone.trim() ||
      !title.trim() ||
      !price ||
      !selectedGov ||
      !selectedType ||
      !location.trim()
    ) {
      alert("⚠️ يرجى تعبئة كافة الحقول الإلزامية أولاً.");
      return;
    }
    if (imageFiles.length > 15) {
      alert("الحد الأقصى المسموح هو 15 صورة.");
      return;
    }

    for (const file of imageFiles) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`الصورة ${file.name} أكبر من 10MB`);
        return;
      }
    }

    try {
      setLoading(true);

      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("يجب تسجيل الدخول أولاً.");
        setLoading(false);
        return;
      }

      // روابط الصور
      let imageUrls: string[] = [];
      setUploadedCount(0);

      // رفع الصور
      if (imageFiles.length > 0) {
        const uploadedImages = await Promise.all(
          imageFiles.map(async (imageFile) => {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("property-images")
              .upload(fileName, imageFile, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
              .from("property-images")
              .getPublicUrl(uploadData.path);

            setUploadedCount((prev) => prev + 1);
            return publicUrlData.publicUrl;
          })
        );
        imageUrls = uploadedImages;
      }

      // حفظ العقار (تحويل التجهيزات إلى نص مفصول بفواصل لقاعدة البيانات)
      const { error } = await supabase.from("properties").insert([
        {
          title: title.trim(),
          type: selectedType,
          governorate: selectedGov,
          location: location.trim(),
          neighborhood: neighborhood.trim(),
          price: Number(price),
          description: description.trim(),
          amenities: selectedAmenities.join(", "), // يتم تخزينها كنص مفصول بفواصل
          rooms_count: rooms ? Number(rooms) : null,
          beds_count: beds ? Number(beds) : null,
          bathrooms_count: bathrooms ? Number(bathrooms) : null,
          owner_name: ownerName.trim(),
          owner_phone: ownerPhone.trim(),
          owner_email: ownerEmail.trim(),
          image: imageUrls[0] || "",
          images_list: imageUrls,
          status: "pending",
          user_id: user.id,
          address: checkInTime,
          city: checkOutTime,
        },
      ]);

      if (error) {
        console.error(error);
        alert(`حدث خطأ أثناء حفظ العقار: ${error.message}`);
        setLoading(false);
        return;
      }

      // إشعار تيليغرام
      await sendTelegramNewPropertyNotification();

      alert("تم استلام العقار بنجاح، وسيتم مراجعة الطلب قبل نشره على المنصة.");
      clearForm();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-10 sm:py-14"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl">

        {/* العنوان */}
        <div className="mb-10 text-right">
          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight">
            أضف عقارك هنا
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280]">
            أضف معلومات العقار بشكل احترافي، وسيتم مراجعته قبل النشر.
          </p>
        </div>

        {/* الفورم */}
        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-sm space-y-6">

          {/* بيانات المؤجر */}
          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">
            📋 بيانات المؤجر
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="اسم المؤجر الكامل"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="رقم الهاتف"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />
          </div>

          {/* بيانات العقار */}
          <h2 className="text-lg font-bold text-[#111827] border-b pb-2 text-right">
            🏠 بيانات العقار
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان العقار"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            >
              <option value="">اختر نوع العقار</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="المدينة أو البلدة"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="الحي أو الشارع"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            {/* السعر */}
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-gray-700 font-sans">
                السعر بالدولار الأمريكي لليلة الواحدة
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 20 دولار لليلة الواحدة"
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
              />
            </div>
          </div>

          {/* المواصفات */}
          <div className="grid gap-4 grid-cols-3">
            <input
              type="number"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="عدد الغرف"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />
            <input
              type="number"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              placeholder="عدد الأسرة"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="عدد الحمامات"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />
          </div>

          {/* أوقات الدخول والخروج */}
          <div className="grid gap-4 grid-cols-2 text-right">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                🕒 وقت الدخول (Check-in)
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                🕒 وقت الخروج (Check-out)
              </label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
              />
            </div>
          </div>

          {/* الوصف */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف العقار"
            className="min-h-[120px] rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B]"
          />

          {/* قسم التجهيزات والخدمات الجديد بالتصميم الفاخر والذكي */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm text-right space-y-4">
            <h2 className="text-lg font-bold text-[#111827] pb-1">
              🛠️ التجهيزات والخدمات المتوفرة
            </h2>
            <p className="text-xs text-[#6B7280]">
              حدد التجهيزات المتوفرة في عقارك ليظهر في فلاتر البحث بدقة.
            </p>

            {/* شبكة التجهيزات على شكل Chips تفاعلية */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {[...defaultAmenitiesList, ...customAmenities].map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 select-none ${
                      isSelected
                        ? "border-[#3FAF9B] bg-[#F0FDF4] text-[#166534] shadow-sm"
                        : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <span className="truncate">{amenity}</span>
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs transition-all ${
                        isSelected
                          ? "border-[#3FAF9B] bg-[#3FAF9B] text-white scale-100"
                          : "border-gray-300 bg-white text-transparent scale-90"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>

            {/* حقل إضافة تجهيزات مخصصة (أخرى) */}
            <div className="pt-4 border-t border-dashed border-[#E5E7EB] flex flex-col gap-2 max-w-md mr-auto ml-0">
              <label className="text-xs font-bold text-gray-700">
                إضافة خدمات أو تجهيزات أخرى غير مدرجة:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="مثال: مدفأة مازوت، إنترنت فضائي..."
                  className="flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomAmenity()}
                  className="rounded-xl bg-[#3FAF9B] hover:bg-[#2F8E7D] px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>

          {/* الصور */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-right text-lg font-bold text-[#111827]">
              🖼️ صور العقار
            </h2>

            <label
              htmlFor="property-image"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#3FAF9B] bg-[#F8FFFD] px-4 text-center"
            >
              <div className="mb-2 text-4xl text-[#3FAF9B]">⬆</div>
              <h3 className="text-base font-bold text-[#111827]">رفع الصور</h3>
              <p className="mt-2 text-xs text-[#6B7280]">يمكنك اختيار عدة صور للعقار</p>
              <input
                id="property-image"
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  
                  // تنظيف المعاينات السابقة
                  imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                  setImagePreviews([]);
                  setImageFiles([]);
                  
                  try {
                    const compressedFiles = await Promise.all(
                      files.map((file) => compressImage(file))
                    );
                    setImageFiles(compressedFiles);
                    const previews = compressedFiles.map((file) => URL.createObjectURL(file));
                    setImagePreviews(previews);
                  } catch (err) {
                    console.error("Compression error:", err);
                    setImageFiles(files);
                    const previews = files.map((file) => URL.createObjectURL(file));
                    setImagePreviews(previews);
                  }
                }}
                className="hidden"
              />
            </label>

            {/* عرض الصور المختارة */}
            {imageFiles.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-gray-50/50 p-4 text-right">
                <p className="text-sm font-black text-[#111827] mb-4 flex items-center justify-start gap-1.5 flex-row-reverse">
                  <span>تم اختيار {imageFiles.length} صورة بنجاح</span>
                  <span>📸</span>
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                    >
                      <img
                        src={imagePreviews[index]}
                        alt={`معاينة ${file.name}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = imageFiles.filter((_, i) => i !== index);
                          setImageFiles(updatedFiles);
                          if (imagePreviews[index]) {
                            URL.revokeObjectURL(imagePreviews[index]);
                          }
                          const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
                          setImagePreviews(updatedPreviews);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition hover:scale-110"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[9px] px-1 py-0.5 rounded font-bold">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* زر الإرسال */}
          <button
            onClick={handleAddProperty}
            disabled={loading}
            className="w-full rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-bold text-white transition disabled:bg-gray-400"
          >
            {loading
              ? `جاري رفع الصور وحفظ العقار... (${uploadedCount}/${imageFiles.length})`
              : "إرسال العقار للمراجعة"}
          </button>

        </div>
      </div>
    </main>
  );
}
