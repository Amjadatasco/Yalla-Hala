"use client";

import { useState, useEffect, use } from "react";
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
        
        const MAX_SIZE = 900;
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
          0.75
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function EditPropertyPage({ params }: any) {
  const resolvedParams = "then" in params ? use(params) : params;

  // الحالات العامة
  const [property, setProperty] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

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
  const [currency, setCurrency] = useState("USD");
  const [supports12h, setSupports12h] = useState(false);
  const [price12h, setPrice12h] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");

  // المواصفات
  const [rooms, setRooms] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");

  // الوصف والتجهيزات
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  // الصور القديمة والجديدة
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
  const TELEGRAM_CHAT_ID = "629151535";

  useEffect(() => {
    if (resolvedParams?.id) {
      loadProperty();
    }
  }, [resolvedParams?.id]);

  async function loadProperty() {
    try {
      setPageLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;
      
      if (data) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || (data.user_id !== user.id && user.email !== "0995688838@yallahala.local")) {
          alert("⚠️ غير مصرح لك بتعديل هذا العقار.");
          window.location.href = "/";
          return;
        }

        setProperty(data);
        setOwnerName(data.owner_name || "");
        setOwnerPhone(data.owner_phone || "");
        setOwnerEmail(data.owner_email || "");
        setTitle(data.title || "");
        setSelectedType(data.type || "");
        setSelectedGov(data.governorate || "");
        setLocation(data.location || "");
        setNeighborhood(data.neighborhood || "");
        setPrice(data.price ? String(data.price) : "");
        setCurrency(data.longitude === 1 ? "SYP" : "USD");
        setSupports12h(data.latitude ? true : false);
        setPrice12h(data.latitude ? String(data.latitude) : "");
        setWeekendPrice(data.rooms ? String(data.rooms) : "");
        setRooms(data.rooms_count ? String(data.rooms_count) : "");
        setBeds(data.beds_count ? String(data.beds_count) : "");
        setBathrooms(data.bathrooms_count ? String(data.bathrooms_count) : "");
        setCheckInTime(data.address || "14:00");
        setCheckOutTime(data.city || "12:00");
        setDescription(data.description || "");
        
        if (data.amenities) {
          const list = data.amenities.split(",").map((item: string) => item.trim());
          setSelectedAmenities(list);
          const custom = list.filter((item: string) => !defaultAmenitiesList.includes(item));
          setCustomAmenities(custom);
        }

        if (data.images_list && Array.isArray(data.images_list)) {
          setExistingImageUrls(data.images_list);
        } else if (data.image) {
          setExistingImageUrls([data.image]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحميل بيانات العقار.");
    } finally {
      setPageLoading(false);
    }
  }

  const getInputClass = (val: string) => {
    const base = "rounded-xl border px-4 py-3.5 text-right text-sm outline-none transition duration-200 ";
    if (triedSubmit && (!val || !val.trim())) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] bg-white focus:border-[#3FAF9B]";
  };

  const getSelectClass = (val: string) => {
    const base = "rounded-xl border px-4 py-3.5 text-right text-sm outline-none transition duration-200 ";
    if (triedSubmit && !val) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] bg-white focus:border-[#3FAF9B]";
  };

  const handleToggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleAddCustomAmenity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedValue = customInput.trim();
    if (!trimmedValue) return;

    if (!defaultAmenitiesList.includes(trimmedValue) && !customAmenities.includes(trimmedValue)) {
      setCustomAmenities((prev) => [...prev, trimmedValue]);
    }

    if (!selectedAmenities.includes(trimmedValue)) {
      setSelectedAmenities((prev) => [...prev, trimmedValue]);
    }

    setCustomInput("");
  };

  async function sendTelegramEditNotification() {
    try {
      const formattedPrice = currency === "SYP" ? `${Number(price).toLocaleString()} ل.س` : `$${price} USD`;
      const formattedPrice12h = supports12h ? (currency === "SYP" ? `${Number(price12h).toLocaleString()} ل.س` : `$${price12h} USD`) : "";

      const messageText =
        `✏️ تم تعديل عقار وبانتظار المراجعة\n\n` +
        `🏠 العقار:\n${title}\n\n` +
        `🗂️ النوع:\n${selectedType}\n\n` +
        `📍 المحافظة:\n${selectedGov}\n\n` +
        `🗺️ الموقع:\n${location}\n\n` +
        `👤 اسم المؤجر:\n${ownerName}\n\n` +
        `📞 رقم الهاتف:\n${ownerPhone}\n\n` +
        `💰 السعر بالليلة:\n${formattedPrice}\n\n` +
        `☀️ إيجار 12 ساعة:\n${supports12h ? `نعم (${formattedPrice12h})` : "غير مدعوم"}\n\n` +
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

  async function handleEditProperty() {
    setTriedSubmit(true);

    if (
      !ownerName.trim() ||
      !ownerPhone.trim() ||
      !title.trim() ||
      !price ||
      !selectedGov ||
      !selectedType ||
      !location.trim() ||
      (supports12h && !price12h.trim())
    ) {
      alert("⚠️ يرجى تعبئة كافة الحقول الإلزامية أولاً.");
      return;
    }

    const totalImagesCount = existingImageUrls.length + imageFiles.length;
    if (totalImagesCount > 6) {
      alert("⚠️ الحد الأقصى المسموح به للصور هو 6 فقط.");
      return;
    }

    if (totalImagesCount === 0) {
      alert("⚠️ يجب اختيار صورة واحدة على الأقل للعقار.");
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("يجب تسجيل الدخول أولاً.");
        setLoading(false);
        return;
      }

      // رفع الصور الجديدة
      let newUploadedUrls: string[] = [];
      setUploadedCount(0);

      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const imageFile = imageFiles[i];
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(uploadData.path);

          newUploadedUrls.push(publicUrlData.publicUrl);
          setUploadedCount(i + 1);
        }
      }

      // دمج الصور القديمة المتبقية والجديدة المرفوعة
      const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];

      const isAdminUser = user.email === "0995688838@yallahala.local";
      const newStatus = isAdminUser ? property.status : "pending";

      const { error } = await supabase
        .from("properties")
        .update({
          title: title.trim(),
          type: selectedType,
          governorate: selectedGov,
          location: location.trim(),
          neighborhood: neighborhood.trim(),
          price: Number(price),
          description: description.trim(),
          amenities: selectedAmenities.join(", "),
          rooms_count: rooms ? Number(rooms) : null,
          beds_count: beds ? Number(beds) : null,
          bathrooms_count: bathrooms ? Number(bathrooms) : null,
          owner_name: ownerName.trim(),
          owner_phone: ownerPhone.trim(),
          owner_email: ownerEmail.trim(),
          image: finalImageUrls[0] || "",
          images_list: finalImageUrls,
          status: newStatus,
          address: checkInTime,
          city: checkOutTime,
          latitude: supports12h && price12h ? Number(price12h) : null,
          longitude: currency === "SYP" ? 1 : 0,
          rooms: weekendPrice ? weekendPrice : null, // تحديث سعر نهاية الأسبوع في عمود rooms
        })
        .eq("id", property.id);

      if (error) {
        throw error;
      }

      if (!isAdminUser) {
        await sendTelegramEditNotification();
        alert("تم تعديل بيانات العقار بنجاح، وهو بانتظار مراجعة الإدارة مجدداً.");
      } else {
        alert("تم حفظ التعديلات بنجاح.");
      }

      window.location.href = isAdminUser ? "/admin-dashboard" : "/owner-dashboard";
    } catch (err: any) {
      console.error(err);
      alert(`حدث خطأ أثناء تعديل العقار: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-gray-500">جاري تحميل بيانات العقار...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-10 sm:py-14" dir="rtl">
      <div className="mx-auto max-w-5xl">
        
        {/* العنوان */}
        <div className="mb-10 text-right">
          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight">
            تعديل بيانات عقارك
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280]">
            قم بتحديث وتعديل حقول العقار أدناه، ثم احفظ التغييرات.
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
              className={getInputClass(ownerName)}
            />
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="رقم الهاتف"
              className={getInputClass(ownerPhone)}
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
              placeholder="اسم العقار (مثال: شقة ديلوكس، شاليه النخيل)"
              className={getInputClass(title)}
            />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={getSelectClass(selectedType)}
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
              className={getSelectClass(selectedGov)}
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
              className={getInputClass(location)}
            />

            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="الحي أو الشارع"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            {/* السعر والعملة */}
            <div className="md:col-span-2 grid gap-4 grid-cols-3">
              <div className="col-span-2 flex flex-col gap-1.5 text-right">
                <label className="text-xs font-bold text-gray-700 font-sans">
                  السعر لليلة الواحدة
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={currency === "SYP" ? "مثال: 500000 ليرة" : "مثال: 20 دولار"}
                  className={getInputClass(price)}
                />
              </div>
              <div className="flex flex-col gap-1.5 text-right">
                <label className="text-xs font-bold text-gray-700">
                  العملة
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B] transition duration-200"
                >
                  <option value="USD">دولار أمريكي ($)</option>
                  <option value="SYP">ليرة سورية (ل.س)</option>
                </select>
              </div>
            </div>

            {/* سعر نهاية الأسبوع الاختياري */}
            <div className="md:col-span-2 grid gap-4 grid-cols-3">
              <div className="col-span-2 flex flex-col gap-1.5 text-right">
                <label className="text-xs font-bold text-gray-700 font-sans">
                  سعر نهاية الأسبوع (يومي الجمعة والسبت) بالليلة <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="number"
                  value={weekendPrice}
                  onChange={(e) => setWeekendPrice(e.target.value)}
                  placeholder={currency === "SYP" ? "مثال: 600000 ليرة" : "مثال: 25 دولار"}
                  className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B] bg-white focus:ring-1 focus:ring-[#3FAF9B]"
                />
              </div>
              <div className="flex flex-col justify-end text-right pb-1">
                <span className="text-[10px] text-gray-400 leading-tight font-bold">
                  * اترك الحقل فارغاً إذا كان السعر متطابقاً طوال أيام الأسبوع.
                </span>
              </div>
            </div>

            {/* خيار إيجار 12 ساعة */}
            <div className="md:col-span-2 border border-gray-100 bg-[#F9FAFB] rounded-2xl p-4 flex flex-col gap-3 text-right">
              <label className="flex items-center gap-2.5 font-bold text-gray-800 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={supports12h}
                  onChange={(e) => {
                    setSupports12h(e.target.checked);
                    if (!e.target.checked) setPrice12h("");
                  }}
                  className="w-4 h-4 accent-[#3FAF9B] cursor-pointer"
                />
                <span>هل يدعم هذا العقار خيار إيجار 12 ساعة (نصف يوم)؟</span>
              </label>

              {supports12h && (
                <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-gray-700">
                    السعر لفترة 12 ساعة (نصف يوم) ({currency === "SYP" ? "بالليرة السورية" : "بالدولار الأمريكي"})
                  </label>
                  <input
                    type="number"
                    value={price12h}
                    onChange={(e) => setPrice12h(e.target.value)}
                    placeholder={currency === "SYP" ? "مثال: 250000 ليرة" : "مثال: 10 دولارات"}
                    required={supports12h}
                    className={getInputClass(price12h)}
                  />
                </div>
              )}
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

          {/* التجهيزات والخدمات */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm text-right space-y-4">
            <h2 className="text-lg font-bold text-[#111827] pb-1">
              🛠️ التجهيزات والخدمات المتوفرة
            </h2>
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

            <div className="pt-4 border-t border-dashed border-[#E5E7EB] flex gap-2 max-w-md mr-auto ml-0">
              <div className="flex gap-2 w-full">
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
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-right text-lg font-bold text-[#111827]">
              🖼️ صور العقار
            </h2>

            {/* عرض الصور الحالية */}
            {existingImageUrls.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700 mb-2">الصور الحالية المرفوعة:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {existingImageUrls.map((url, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                    >
                      <img src={url} alt="معاينة" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition hover:scale-110"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* رفع صور إضافية */}
            <label
              htmlFor="property-image"
              className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#3FAF9B] bg-[#F8FFFD] px-4 text-center"
            >
              {compressing ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin"></div>
                  <h3 className="text-sm font-bold text-[#111827]">جاري ضغط وتجهيز الصور...</h3>
                </div>
              ) : (
                <>
                  <div className="mb-2 text-3xl text-[#3FAF9B]">⬆</div>
                  <h3 className="text-sm font-bold text-[#111827]">إضافة صور جديدة</h3>
                  <p className="mt-1 text-[10px] text-[#6B7280]">المجموع الأقصى المسموح به هو 6 صور للموقع ككل</p>
                </>
              )}
              <input
                id="property-image"
                type="file"
                accept="image/*"
                multiple
                disabled={compressing}
                onChange={async (e) => {
                  let files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  const remainingQuota = 6 - existingImageUrls.length;
                  if (files.length > remainingQuota) {
                    alert(`⚠️ يمكنك رفع ${remainingQuota} صور إضافية كحد أقصى.`);
                    files = files.slice(0, remainingQuota);
                  }

                  setCompressing(true);
                  try {
                    const compressedFiles: File[] = [];
                    for (const file of files) {
                      const compressed = await compressImage(file);
                      compressedFiles.push(compressed);
                    }
                    setImageFiles([...imageFiles, ...compressedFiles]);
                    const previews = compressedFiles.map((file) => URL.createObjectURL(file));
                    setImagePreviews([...imagePreviews, ...previews]);
                  } catch (err) {
                    console.error("Compression error:", err);
                    setImageFiles([...imageFiles, ...files]);
                    const previews = files.map((file) => URL.createObjectURL(file));
                    setImagePreviews([...imagePreviews, ...previews]);
                  } finally {
                    setCompressing(false);
                  }
                }}
                className="hidden"
              />
            </label>

            {/* معاينة الصور الجديدة */}
            {imageFiles.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-bold text-[#3FAF9B] mb-2">الصور الجديدة المضافة:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {imageFiles.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
                    >
                      <img src={imagePreviews[index]} alt="جديد" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = imageFiles.filter((_, i) => i !== index);
                          setImageFiles(updatedFiles);
                          URL.revokeObjectURL(imagePreviews[index]);
                          setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* زر التعديل */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 rounded-2xl border border-gray-300 hover:bg-gray-50 py-4 text-base font-bold text-gray-700 transition"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleEditProperty}
              disabled={loading}
              className="flex-[2] rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-bold text-white transition disabled:bg-gray-400"
            >
              {loading
                ? `جاري حفظ التعديلات... (${uploadedCount}/${imageFiles.length})`
                : "حفظ التعديلات وعرض المراجعة"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
