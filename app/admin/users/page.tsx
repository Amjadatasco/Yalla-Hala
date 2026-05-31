"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // إذا لم يكن مسجل دخول
      if (!user) {
        router.push("/login");
        return;
      }

      // التحقق من صلاحية الأدمن
      const ADMIN_EMAIL =
  "0995688838@yallahala.local";

if (
  user.email !== ADMIN_EMAIL
) {
  router.push("/");
  return;
}
      // جلب جميع المستخدمين
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
      }

      if (data) {
        setUsers(data);
      }

      setLoading(false);
    }

    fetchUsers();
  }, [router]);

  // حذف مستخدم بالكامل
  async function handleDelete(id: string) {
    const confirmed = confirm(
      "هل أنت متأكد من حذف المستخدم نهائياً؟"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        "/api/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: id,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "فشل حذف المستخدم"
        );
        return;
      }

      // حذف من الواجهة مباشرة
      setUsers(
        users.filter(
          (u) => u.id !== id
        )
      );

      alert(
        "تم حذف المستخدم نهائياً"
      );

    } catch (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء الحذف"
      );
    }
  }

  if (loading) {
    return (
      <main className="p-10">
        <p>جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main
      className="p-10 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      <h1 className="text-2xl font-black mb-6">
        قائمة المشتركين
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="p-4">الاسم</th>
              <th className="p-4">الهاتف</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b"
              >
                <td className="p-4">
                  {u.full_name || "-"}
                </td>

                <td className="p-4">
                  {u.phone || "-"}
                </td>

                <td className="p-4">
                  {u.created_at
                    ? new Date(
                        u.created_at
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      handleDelete(u.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  لا يوجد مشتركين حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}