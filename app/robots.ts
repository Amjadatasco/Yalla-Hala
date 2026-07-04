import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin-dashboard/',
        '/admin-login/',
        '/owner-dashboard/',
        '/user-dashboard/',
        '/api/'
      ],
    },
    sitemap: 'https://yallahala.com/sitemap.xml',
  };
}
