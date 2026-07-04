import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yallahala.com';

  // 1. روابط الصفحات الثابتة للموقع
  const staticPages = [
    '',
    '/about',
    '/add-property',
    '/track',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // 2. جلب جميع العقارات المعتمدة لبناء روابطها ديناميكياً في محرك البحث
    const { data: properties } = await supabase
      .from('properties')
      .select('id, created_at')
      .eq('status', 'approved');

    const propertyPages = (properties || []).map((prop) => ({
      url: `${baseUrl}/property/${prop.id}`,
      lastModified: prop.created_at ? new Date(prop.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...propertyPages];
  } catch (e) {
    console.error('خطأ أثناء توليد خريطة الموقع:', e);
    return staticPages;
  }
}
