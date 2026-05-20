"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddPropertyPage() {

  const [title, setTitle] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase
        .from("properties")
        .insert([
          {
            title,
            location,
            price: Number(price),
            description,
            image,
            status: "pending",
          },
        ]);

    setLoading(false);

    if (error) {

      alert("حدث خطأ");

      console.log(error);

    } else {

      alert("تم إرسال العقار بنجاح");

      setTitle("");
      setLocation("");
      setPrice("");
      setDescription("");
      setImage("");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-10">

      <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-[#E5E7EB] p-6 sm:p-10">

        <div className="text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827]">

            أضف عقارك

          </h1>

          <p className="mt-4 text-[#6B7280]">

            أضف معلومات العقار ليتم مراجعته ونشره.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5"
        >

          <input
            type="text"
            placeholder="عنوان العقار"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
            required
          />

          <input
            type="text"
            placeholder="الموقع"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
            required
          />

          <input
            type="number"
            placeholder="السعر"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
            required
          />

          <input
            type="text"
            placeholder="رابط الصورة"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            className="h-14 rounded-2xl border border-[#E5E7EB] px-5"
          />

          <textarea
            placeholder="وصف العقار"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="min-h-[180px] rounded-2xl border border-[#E5E7EB] p-5"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="h-14 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D]"
          >

            {loading
              ? "جاري الإرسال..."
              : "إرسال العقار"}

          </button>

        </form>

      </div>

    </main>
  );
}