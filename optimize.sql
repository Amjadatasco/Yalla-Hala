-- 🚀 سكريبت تسريع الاستعلامات والبحث لمنصة يلا هلا السياحية
-- قم بنسخ الأوامر التالية وتشغيلها في قسم "SQL Editor" داخل لوحة تحكم Supabase الخاصة بك.

-- 1. تسريع الاستعلام عن حالة العقار (أقسام العرض والقبول والمرفوض)
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- 2. تسريع عمليات البحث والفلترة بنطاق السعر بالليلة
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- 3. تسريع البحث والفلترة حسب المحافظة/المدينة
CREATE INDEX IF NOT EXISTS idx_properties_governorate ON properties(governorate);

-- 4. تسريع البحث والفلترة حسب نوع العقار (فيلا، شقة، شاليه...)
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- 5. تسريع البحث وتتبع الحجوزات برقم الهاتف لصفحة تتبع الحجز
CREATE INDEX IF NOT EXISTS idx_bookings_guest_phone ON bookings(guest_phone);

-- 6. تسريع ربط الحجوزات بالعقارات الخاصة بها
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
