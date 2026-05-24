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

  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID = "629151535";

  async function sendTelegramNewPropertyNotification() {

    try {

      const messageText =
        `🆕 *إشعار: عقار جديد مضاف ينتظر المراجعة!* 🆕\n\n` +
        `🏠 *العقار:* ${title}\n` +
        `🗂️ *النوع:* ${selectedType}\n` +
        `📍 *المحافظة:* ${selectedGov}\n` +
        `🗺️ *المنطقة:* ${location}\n\n` +
        `💰 *السعر:* $${price}\n\n` +
        `👤 *اسم المؤجر:* ${ownerName}\n` +
        `📞 *رقم الهاتف:* ${ownerPhone}\n` +
        `✉️ *الإيميل:* ${ownerEmail || "لا يوجد"}\n\n` +
        `🛏️ *الغرف:* ${rooms || 0}\n` +
        `🛌 *الأسرة:* ${beds || 0}\n` +
        `🚿 *الحمامات:* ${bathrooms || 0}\n`;

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
            parse_mode: "Markdown",
          }),
        }
      );

    } catch (error) {

      console.error(
        "Telegram notification error:",
        error
      );

    }
  }

  async function handleAddProperty() {

    if (
      !ownerName.trim() ||
      !ownerPhone.trim() ||
      !title.trim() ||
      !selectedType ||
      !selectedGov ||
      !location.trim() ||
      !price
    ) {

      alert(
        "يرجى تعبئة جميع الحقول الإلزامية أولاً."
      );

      return;
    }

    try {

      setLoading(true);

      // ✅ جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ✅ منع الإضافة بدون تسجيل دخول
      if (!user) {

        alert(
          "يجب تسجيل الدخول أولاً لإضافة عقار."
        );

        setLoading(false);

        return;
      }

      let imageUrls: string[] = [];

      // ✅ رفع الصور
      if (imageFiles.length > 0) {

        for (const imageFile of imageFiles) {

          const fileExt =
            imageFile.name.split(".").pop();

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

            console.error(uploadError);

            alert(
              `فشل رفع الصورة: ${imageFile.name}`
            );

            setLoading(false);

            return;
          }

          const { data: publicUrlData } =
            supabase.storage
              .from("property-images")
              .getPublicUrl(uploadData.path);

          imageUrls.push(
            publicUrlData.publicUrl
          );
        }
      }

      // ✅ حفظ العقار وربطه بالمستخدم الحالي
      const { error } = await supabase
        .from("properties")
        .insert([
          {
            title: title.trim(),

            type: selectedType,

            governorate: selectedGov,

            location: location.trim(),

            neighborhood:
              neighborhood.trim(),

            price: Number(price),

            description:
              description.trim(),

            amenities:
              amenities.trim(),

            rooms_count: rooms
              ? Number(rooms)
              : null,

            beds_count: beds
              ? Number(beds)
              : null,

            bathrooms_count: bathrooms
              ? Number(bathrooms)
              : null,

            owner_name:
              ownerName.trim(),

            owner_phone:
              ownerPhone.trim(),

            owner_email:
              ownerEmail.trim(),

            image:
              imageUrls[0] || "",

            images_list: imageUrls,

            status: "pending",

            // ✅ أهم تعديل
            user_id: user.id,
          },
        ]);

      if (error) {

        console.error(
          "Supabase insert error:",
          error
        );

        alert(
          `حدث خطأ أثناء حفظ العقار: ${error.message}`
        );

        setLoading(false);

        return;
      }

      // ✅ إرسال إشعار تلغرام
      await sendTelegramNewPropertyNotification();

      alert(
        "🎉 تم إرسال العقار بنجاح وسيتم مراجعته من الإدارة."
      );

      clearForm();

      window.location.href = "/owner-dashboard";

    } catch (error) {

      console.error(error);

      alert(
        "حدث خطأ غير متوقع، حاول مجدداً."
      );

    } finally {

      setLoading(false);

    }
  }

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

  return (
    <main
      className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-10 sm:py-14"
      dir="rtl"
    >

      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-right">

          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] leading-tight">
            أضف عقارك السكني
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#6B7280]">
            أضف عقارك وسيتم مراجعته من الإدارة قبل النشر.
          </p>

        </div>

        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-sm space-y-6">

          <div className="grid gap-4 md:grid-cols-2">

            <input
              type="text"
              value={ownerName}
              onChange={(e) =>
                setOwnerName(e.target.value)
              }
              placeholder="اسم صاحب العقار"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <input
              type="text"
              value={ownerPhone}
              onChange={(e) =>
                setOwnerPhone(e.target.value)
              }
              placeholder="رقم الهاتف"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <input
              type="email"
              value={ownerEmail}
              onChange={(e) =>
                setOwnerEmail(e.target.value)
              }
              placeholder="البريد الإلكتروني"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="اسم العقار"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            >

              <option value="">
                اختر نوع العقار
              </option>

              {propertyTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}

            </select>

            <select
              value={selectedGov}
              onChange={(e) =>
                setSelectedGov(e.target.value)
              }
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            >

              <option value="">
                اختر المحافظة
              </option>

              {governorates.map((gov) => (
                <option
                  key={gov}
                  value={gov}
                >
                  {gov}
                </option>
              ))}

            </select>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="المدينة أو المنطقة"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <input
              type="text"
              value={neighborhood}
              onChange={(e) =>
                setNeighborhood(e.target.value)
              }
              placeholder="الحي أو الشارع"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="السعر بالدولار"
              className="rounded-xl border border-[#E5E7EB] px-4 py-3"
            />

          </div>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="وصف العقار"
            className="w-full min-h-[120px] rounded-xl border border-[#E5E7EB] px-4 py-3"
          />

          <textarea
            value={amenities}
            onChange={(e) =>
              setAmenities(e.target.value)
            }
            placeholder="التجهيزات"
            className="w-full min-h-[100px] rounded-xl border border-[#E5E7EB] px-4 py-3"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImageFiles(
                Array.from(
                  e.target.files || []
                )
              )
            }
            className="w-full"
          />

          <button
            onClick={handleAddProperty}
            disabled={loading}
            className="w-full rounded-2xl bg-[#3FAF9B] hover:bg-[#2F8E7D] py-4 text-base font-bold text-white transition disabled:bg-gray-400"
          >

            {loading
              ? "جاري رفع العقار..."
              : "إرسال العقار"}

          </button>

        </div>

      </div>

    </main>
  );
}