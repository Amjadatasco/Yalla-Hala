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

  const [propertyType, setPropertyType] = useState("");

  const [governorate, setGovernorate] = useState("");

  const [location, setLocation] = useState("");

  const [address, setAddress] = useState("");

  const [price, setPrice] = useState("");

  const [rooms, setRooms] = useState("");

  const [beds, setBeds] = useState("");

  const [bathrooms, setBathrooms] = useState("");

  const [description, setDescription] = useState("");

  const [amenities, setAmenities] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  async function handleAddProperty() {

    if (
      !ownerName ||
      !ownerPhone ||
      !title ||
      !propertyType ||
      !governorate ||
      !location ||
      !price
    ) {
      alert("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    setLoading(true);

    try {

      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {

        for (const imageFile of imageFiles) {

          const fileExt = imageFile.name.split(".").pop();

          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("property-images")
              .upload(fileName, imageFile);

          if (uploadError) {
            console.log(uploadError);

            alert("حدث خطأ أثناء رفع الصور");

            setLoading(false);

            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(uploadData.path);

          imageUrls.push(publicUrlData.publicUrl);
        }
      }

      const { error } = await supabase.from("properties").insert([
        {
          owner_name: ownerName,
          owner_phone: ownerPhone,
          owner_email: ownerEmail,

          title,

          type: propertyType,

          governorate,

          location,

          address,

          price: Number(price),

          rooms,

          beds,

          bathrooms,

          description,

          amenities,

          image: imageUrls[0] || "",

          images: imageUrls,

          status: "pending",
        },
      ]);

      setLoading(false);

      if (error) {
        console.log(error);

        alert("حدث خطأ أثناء إضافة العقار");
      } else {

        alert("تم إرسال العقار للمراجعة");

        setOwnerName("");
        setOwnerPhone("");
        setOwnerEmail("");

        setTitle("");

        setPropertyType("");

        setGovernorate("");

        setLocation("");

        setAddress("");

        setPrice("");

        setRooms("");

        setBeds("");

        setBathrooms("");

        setDescription("");

        setAmenities("");

        setImageFiles([]);
      }

    } catch (err) {

      console.log(err);

      setLoading(false);

      alert("حدث خطأ غير متوقع");
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-12">

      <div className="max-w-6xl mx-auto">

        <div className="text-right mb-10">

          <h1 className="text-5xl font-extrabold text-[#111827]">
            أضف عقارك
          </h1>

          <p className="mt-4 text-lg text-[#6B7280] leading-8">
            أرسل عقارك للمراجعة والنشر داخل المنصة.
          </p>

        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="اسم صاحب العقار"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="رقم الهاتف أو واتساب"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان العقار"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            >
              <option value="">
                اختر نوع العقار
              </option>

              {propertyTypes.map((type) => (
                <option key={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            >
              <option value="">
                اختر المحافظة
              </option>

              {governorates.map((gov) => (
                <option key={gov}>
                  {gov}
                </option>
              ))}
            </select>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="المدينة أو المنطقة"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="العنوان التقريبي"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="السعر"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="عدد الغرف"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              placeholder="عدد الأسرّة"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="عدد الحمامات"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

          </div>

          <div className="mt-6 grid gap-5">

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف العقار"
              className="min-h-[180px] rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <textarea
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="التجهيزات المتوفرة"
              className="min-h-[140px] rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

          </div>

          <div className="mt-8">

            <label className="block mb-4 text-right text-xl font-bold">
              صور العقار
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImageFiles(Array.from(e.target.files || []))
              }
              className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            {imageFiles.length > 0 && (

              <div className="mt-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5">

                <p className="font-bold mb-3 text-right">
                  الصور المختارة
                </p>

                <div className="space-y-2 text-right">

                  {imageFiles.map((file, index) => (
                    <p key={index}>
                      • {file.name}
                    </p>
                  ))}

                </div>

              </div>

            )}

          </div>

          <button
            onClick={handleAddProperty}
            disabled={loading}
            className="mt-10 w-full rounded-2xl bg-[#3FAF9B] py-5 text-xl font-bold text-white hover:bg-[#2F8E7D] disabled:opacity-50"
          >
            {loading
              ? "جاري الإرسال..."
              : "إرسال العقار للمراجعة"}
          </button>

        </div>

      </div>

    </main>
  );
}