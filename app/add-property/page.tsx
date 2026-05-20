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

  const [title, setTitle] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [imageFiles, setImageFiles] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function handleAddProperty() {

    try {

      setLoading(true);

      let imageUrls: string[] = [];

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

            console.log(uploadError);

            alert(
              "فشل رفع الصور"
            );

            setLoading(false);

            return;
          }

          const {
            data: publicUrlData,
          } = supabase.storage
            .from("property-images")
            .getPublicUrl(
              uploadData.path
            );

          imageUrls.push(
            publicUrlData.publicUrl
          );
        }
      }

      const { error } =
        await supabase
          .from("properties")
          .insert([
            {
              title,
              location,
              price:
                Number(price),
              description,
              image:
                imageUrls[0] || "",
              status:
                "pending",
            },
          ]);

      setLoading(false);

      if (error) {

        console.log(error);

        alert(
          "حدث خطأ أثناء إضافة العقار"
        );

        return;
      }

      alert(
        "تم إرسال العقار للمراجعة بنجاح"
      );

      setTitle("");
      setLocation("");
      setPrice("");
      setDescription("");
      setImageFiles([]);

      window.location.href = "/";

    } catch (err) {

      console.log(err);

      alert("حدث خطأ");

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-10 sm:py-14">

      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-right">

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111827] leading-tight">

            أضف عقارك

          </h1>

          <p className="mt-5 text-base sm:text-xl leading-8 text-[#6B7280]">

            أضف معلومات العقار بشكل احترافي
            وسيتم مراجعته قبل نشره داخل المنصة.

          </p>

        </div>

        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم صاحب العقار"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="رقم الهاتف أو واتساب"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="البريد الإلكتروني"
            />

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم العقار أو عنوان مختصر"
            />

            <select className="rounded-2xl border border-[#E5E7EB] px-4 py-4 text-right outline-none transition focus:border-[#3FAF9B]">

              <option>
                اختر نوع العقار
              </option>

              {propertyTypes.map(
                (type) => (
                  <option key={type}>
                    {type}
                  </option>
                )
              )}

            </select>

            <select className="rounded-2xl border border-[#E5E7EB] px-4 py-4 text-right outline-none transition focus:border-[#3FAF9B]">

              <option>
                اختر المحافظة
              </option>

              {governorates.map(
                (gov) => (
                  <option key={gov}>
                    {gov}
                  </option>
                )
              )}

            </select>

            <input
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="المدينة أو المنطقة"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="الحي أو الموقع التقريبي"
            />

            <input
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="السعر لليلة أو لليوم"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الغرف"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الأسرّة"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الحمامات"
            />

          </div>

          <div className="mt-6 grid gap-5">

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="min-h-[160px] rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="وصف تفصيلي للعقار"
            />

            <textarea
              className="min-h-[120px] rounded-2xl border border-[#E5E7EB] px-4 py-4 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اذكر التجهيزات المتوفرة: مكيف، إنترنت، مطبخ، غسالة، تدفئة..."
            />

          </div>

          <div className="mt-8 rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <h2 className="mb-3 text-right text-3xl font-extrabold text-[#111827]">

              صور العقار

            </h2>

            <p className="mb-6 text-right text-sm leading-7 text-[#6B7280]">

              يمكنك رفع عدة صور للعقار
              وسيتم حفظها داخل المنصة بعد المراجعة.

            </p>

            <label
              htmlFor="property-image"
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#3FAF9B] bg-[#F8FFFD] px-6 text-center transition hover:bg-[#F1FFFB]"
            >

              <div className="mb-4 text-6xl text-[#3FAF9B]">

                ⬆

              </div>

              <h3 className="text-3xl font-extrabold text-[#111827]">

                أضف صور العقار

              </h3>

              <p className="mt-3 text-lg text-[#4B5563]">

                اضغط هنا لاختيار عدة صور

              </p>

              <p className="mt-3 text-sm text-[#6B7280]">

                JPG, PNG, WEBP

              </p>

              <input
                id="property-image"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles(
                    Array.from(
                      e.target.files || []
                    )
                  )
                }
                className="hidden"
              />

            </label>

            {imageFiles.length >
              0 && (

              <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-right">

                <p className="font-semibold text-[#111827]">

                  الصور المختارة:

                </p>

                <ul className="mt-2 space-y-1 text-[#6B7280]">

                  {imageFiles.map(
                    (
                      file,
                      index
                    ) => (
                      <li key={index}>

                        • {file.name}

                      </li>
                    )
                  )}

                </ul>

              </div>

            )}

          </div>

          <div className="mt-8 rounded-[28px] border border-[#E5E7EB] bg-[#F9FAFB] p-6">

            <h2 className="mb-4 text-right text-2xl font-bold text-[#111827]">

              شروط النشر

            </h2>

            <ul className="space-y-3 text-right leading-8 text-[#4B5563]">

              <li>
                • يجب أن تكون المعلومات
                حقيقية وواضحة.
              </li>

              <li>
                • يمنع نشر أي عقار وهمي
                أو مكرر.
              </li>

              <li>
                • تتم مراجعة العقار قبل
                النشر داخل المنصة.
              </li>

              <li>
                • الصور يجب أن تعكس
                الحالة الحقيقية للعقار.
              </li>

            </ul>

          </div>

          <button
            onClick={
              handleAddProperty
            }
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#3FAF9B] py-5 text-xl font-bold text-white transition hover:bg-[#2F8E7D]"
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