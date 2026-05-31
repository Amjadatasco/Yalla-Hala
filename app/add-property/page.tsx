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

export default function AddPropertyPage() {

  // بيانات المؤجر
  const [ownerName, setOwnerName] =
    useState("");

  const [ownerPhone, setOwnerPhone] =
    useState("");

  const [ownerEmail, setOwnerEmail] =
    useState("");

  // بيانات العقار
  const [title, setTitle] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("");

  const [selectedGov, setSelectedGov] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [neighborhood, setNeighborhood] =
    useState("");

  const [price, setPrice] =
    useState("");

  // المواصفات
  const [rooms, setRooms] =
    useState("");

  const [beds, setBeds] =
    useState("");

  const [bathrooms, setBathrooms] =
    useState("");

  // الوصف
  const [description, setDescription] =
    useState("");

  const [amenities, setAmenities] =
    useState("");

  // الصور
  const [imageFiles, setImageFiles] =
    useState<File[]>([]);

  // تحميل
  const [loading, setLoading] =
    useState(false);
const [uploadedCount, setUploadedCount] =
  useState(0);
  // تيليغرام
  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID =
    "629151535";

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

        `🟡 الحالة:\nPending`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chat_id:
              TELEGRAM_CHAT_ID,

            text: messageText,
          }),
        }
      );

    } catch (err) {

      console.error(
        "Telegram Error:",
        err
      );

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

    setDescription("");
    setAmenities("");

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

      alert(
        "⚠️ يرجى تعبئة كافة الحقول الإلزامية أولاً."
      );

      return;
    }
if (imageFiles.length > 15) {

  alert(
    "الحد الأقصى المسموح هو 15 صورة."
  );

  return;
}

for (const file of imageFiles) {

  if (file.size > 10 * 1024 * 1024) {

    alert(
      `الصورة ${file.name} أكبر من 10MB`
    );

    return;
  }

}
    try {

      setLoading(true);

      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // منع الإضافة بدون تسجيل دخول
      if (!user) {

        alert(
          "يجب تسجيل الدخول أولاً."
        );

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

    const fileExt =
      imageFile.name
        .split(".")
        .pop();

    const fileName =
      `${Date.now()}-${Math.random()}.${fileExt}`;

    const {
      data: uploadData,
      error: uploadError,
    } = await supabase.storage
      .from("property-images")
      .upload(
        fileName,
        imageFile,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {

      throw uploadError;

    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("property-images")
      .getPublicUrl(
        uploadData.path
      );

    setUploadedCount(
  (prev) => prev + 1
);

return publicUrlData.publicUrl;

  })

);

imageUrls = uploadedImages;
      }

      // حفظ العقار
      const { error } =
        await supabase
          .from("properties")
          .insert([
            {
              title:
                title.trim(),

              type:
                selectedType,

              governorate:
                selectedGov,

              location:
                location.trim(),

              neighborhood:
                neighborhood.trim(),

              price:
                Number(price),

              description:
                description.trim(),

              amenities:
                amenities.trim(),

              rooms_count:
                rooms
                  ? Number(
                      rooms
                    )
                  : null,

              beds_count:
                beds
                  ? Number(
                      beds
                    )
                  : null,

              bathrooms_count:
                bathrooms
                  ? Number(
                      bathrooms
                    )
                  : null,

              owner_name:
                ownerName.trim(),

              owner_phone:
                ownerPhone.trim(),

              owner_email:
                ownerEmail.trim(),

              image:
                imageUrls[0] ||
                "",

              images_list:
                imageUrls,

              status:
                "pending",

              // ربط العقار بالمستخدم
              user_id:
                user.id,
            },
          ]);

      // فشل الحفظ
      if (error) {

        console.error(
          error
        );

        alert(
          `حدث خطأ أثناء حفظ العقار: ${error.message}`
        );

        setLoading(false);

        return;
      }

      // إشعار تيليغرام
      await sendTelegramNewPropertyNotification();

      // رسالة نجاح
      alert(
        "تم استلام العقار بنجاح، وسيتم مراجعة الطلب قبل نشره على المنصة."
      );

      // تنظيف الفورم
      clearForm();

      // العودة للرئيسية
      window.location.href =
        "/";

    } catch (err) {

      console.error(err);

      alert(
        "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً."
      );

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

            أضف معلومات العقار بشكل احترافي،
            وسيتم مراجعته قبل النشر.

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
              onChange={(e) =>
                setOwnerName(
                  e.target.value
                )
              }
              placeholder="اسم المؤجر الكامل"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="text"
              value={ownerPhone}
              onChange={(e) =>
                setOwnerPhone(
                  e.target.value
                )
              }
              placeholder="رقم الهاتف"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="email"
              value={ownerEmail}
              onChange={(e) =>
                setOwnerEmail(
                  e.target.value
                )
              }
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
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="عنوان العقار"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value
                )
              }
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            >

              <option value="">
                اختر نوع العقار
              </option>

              {propertyTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>

            <select
              value={selectedGov}
              onChange={(e) =>
                setSelectedGov(
                  e.target.value
                )
              }
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            >

              <option value="">
                اختر المحافظة
              </option>

              {governorates.map(
                (gov) => (
                  <option
                    key={gov}
                    value={gov}
                  >
                    {gov}
                  </option>
                )
              )}

            </select>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="المدينة أو البلدة"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="text"
              value={neighborhood}
              onChange={(e) =>
                setNeighborhood(
                  e.target.value
                )
              }
              placeholder="الحي أو الشارع"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B]"
            />

            {/* السعر */}
            <div className="flex flex-col gap-1.5 text-right">

              <label className="text-xs font-bold text-gray-700">

             السعر بالدولار الأمريكي لليلة الواحدة

              </label>

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
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
              onChange={(e) =>
                setRooms(
                  e.target.value
                )
              }
              placeholder="عدد الغرف"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="number"
              value={beds}
              onChange={(e) =>
                setBeds(
                  e.target.value
                )
              }
              placeholder="عدد الأسرة"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />

            <input
              type="number"
              value={bathrooms}
              onChange={(e) =>
                setBathrooms(
                  e.target.value
                )
              }
              placeholder="عدد الحمامات"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-xs outline-none focus:border-[#3FAF9B]"
            />

          </div>

          {/* الوصف */}
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="وصف العقار"
            className="min-h-[120px] rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B]"
          />

          {/* التجهيزات */}
          <textarea
            value={amenities}
            onChange={(e) =>
              setAmenities(
                e.target.value
              )
            }
            placeholder="التجهيزات والخدمات"
            className="min-h-[90px] rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B]"
          />

          {/* الصور */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm">

            <h2 className="mb-2 text-right text-lg font-bold text-[#111827]">

              🖼️ صور العقار

            </h2>

            <label
              htmlFor="property-image"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#3FAF9B] bg-[#F8FFFD] px-4 text-center"
            >

              <div className="mb-2 text-4xl text-[#3FAF9B]">

                ⬆

              </div>

              <h3 className="text-base font-bold text-[#111827]">

                رفع الصور

              </h3>

              <p className="mt-2 text-xs text-[#6B7280]">

                يمكنك اختيار عدة صور للعقار

              </p>

              <input
                id="property-image"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles(
                    Array.from(
                      e.target.files ||
                        []
                    )
                  )
                }
                className="hidden"
              />

            </label>

            {/* عرض الصور المختارة */}
            {imageFiles.length > 0 && (

              <div className="mt-5 rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] p-4 text-right">

                <p className="text-sm font-black text-[#166534] mb-3">

                  ✅ تم اختيار {imageFiles.length} صورة بنجاح

                </p>

                <div className="space-y-2">

                  {imageFiles.map(
  (
    file,
    index
  ) => (

    <div
      key={index}
      className="rounded-xl bg-white border border-[#DCFCE7] px-3 py-2 text-xs text-[#374151] flex items-center justify-between gap-2"
    >

      <button
        type="button"
        onClick={() =>
          setImageFiles(
            imageFiles.filter(
              (_, i) => i !== index
            )
          )
        }
        className="text-red-500 font-bold text-sm"
      >
        ✕
      </button>

      <span className="truncate">
        📎 {file.name}
      </span>

    </div>

  )
)}

                </div>

              </div>

            )}

          </div>

          {/* زر الإرسال */}
          <button
            onClick={
              handleAddProperty
            }
            disabled={loading}
            className="w-full rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-bold text-white transition disabled:bg-gray-400"
          >

            {loading
              ? `جاري رفع ${uploadedCount} من ${imageFiles.length} صورة...`
              : "إرسال العقار للمراجعة"}

          </button>

        </div>

      </div>

    </main>
  );
}