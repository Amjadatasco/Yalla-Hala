"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Property {
  id: string | number;
  title: string;
  price: number | string;
  location: string;
  image: string;
  governorate?: string;
  longitude?: number | null; // Used as currency flag (1 for SYP, otherwise USD)
}

interface MapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  singleProperty?: boolean;
}

// معجم إحداثيات سياحية وجغرافية للمناطق والقرى السورية لتجاوز عدم وجود حقل إحداثيات مباشر
const locationCoordinates: Record<string, [number, number]> = {
  // ريف دمشق والدمشق
  "المليحه": [33.4906, 36.3888],
  "المليحة": [33.4906, 36.3888],
  "زبدين": [33.4795, 36.3980],
  "بلودان": [33.7317, 36.1383],
  "الزبداني": [33.7250, 36.0906],
  "صيدنايا": [33.6931, 36.3197],
  "يعفور": [33.5186, 36.0964],
  "الروضة": [33.5250, 36.1200],
  "طريق المطار": [33.4400, 36.4200],
  "الغوطة": [33.5000, 36.4500],
  "الصبورة": [33.5414, 36.1156],
  
  // اللاذقية
  "كسب": [35.9264, 35.9328],
  "السمرا": [35.9230, 35.9015],
  "صلنفة": [35.6033, 36.1472],
  "رأس البسيط": [35.8500, 35.8500],
  "البسيط": [35.8500, 35.8500],
  "الشاطئ الأزرق": [35.5800, 35.7300],
  "اللاذقية": [35.5312, 35.7921],
  "أفاميا": [35.5700, 35.7500],
  "قرداحة": [35.4528, 36.0594],
  "جبلة": [35.3611, 35.9278],
  "برج إسلام": [35.6883, 35.7797],

  // طرطوس
  "طرطوس": [34.8890, 35.8867],
  "مشتى الحلو": [34.8872, 36.2625],
  "السميحية": [34.9000, 35.9000],
  "صافيتا": [34.8203, 36.1197],
  "الدريكيش": [34.9125, 36.1239],
  "بانياس": [35.1806, 35.9486],
  "أرواد": [34.8569, 35.8583],
  "عمريت": [34.8333, 35.9000],

  // حمص
  "حمص": [34.7324, 36.7137],
  "الوادي": [34.7600, 36.2600],
  "الحواش": [34.7639, 36.2750],
  "مرمريتا": [34.7767, 36.2667],
  "تلكلخ": [34.6642, 36.2611],

  // حلب
  "حلب": [36.2021, 37.1343],

  // حماة
  "حماة": [35.1318, 36.7578],
  "مصياف": [35.0653, 36.3406],
  "الغاب": [35.4000, 36.3500],
};

const governorateCoordinates: Record<string, [number, number]> = {
  "دمشق": [33.5138, 36.2765],
  "ريف دمشق": [33.5000, 36.3000],
  "اللاذقية": [35.5312, 35.7921],
  "طرطوس": [34.8890, 35.8867],
  "حمص": [34.7324, 36.7137],
  "حلب": [36.2021, 37.1343],
  "حماة": [35.1318, 36.7578],
};

export default function PropertyMap({
  properties,
  center = [34.8021, 38.9968],
  zoom = 7,
  singleProperty = false,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // تهيئة الخريطة لأول مرة
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: true,
      }).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView(center, zoom);
    }

    const map = mapInstance.current;

    // تنظيف الدبابيس القديمة
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // أيقونة الدبوس المخصصة
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const validMarkers: L.LatLngExpression[] = [];

    properties.forEach((prop, index) => {
      let lat = 34.8021;
      let lng = 38.9968;
      let found = false;

      const locKey = prop.location?.trim();
      const govKey = prop.governorate?.trim();

      // 1. فحص اسم المنطقة المباشرة
      if (locKey && locationCoordinates[locKey]) {
        [lat, lng] = locationCoordinates[locKey];
        found = true;
      }
      // 2. إذا لم يعثر عليها، نأخذ إحداثيات المحافظة مع إضافة إزاحة عشوائية طفيفة لتجنب تراكم العقارات فوق بعضها
      else if (govKey && governorateCoordinates[govKey]) {
        const baseCoords = governorateCoordinates[govKey];
        const offsetLat = ((index * 0.17) % 0.05) - 0.025;
        const offsetLng = ((index * 0.23) % 0.05) - 0.025;
        lat = baseCoords[0] + offsetLat;
        lng = baseCoords[1] + offsetLng;
        found = true;
      }

      if (found) {
        const markerPos: [number, number] = [lat, lng];
        validMarkers.push(markerPos);

        const marker = L.marker(markerPos, { icon: customIcon }).addTo(map);

        const priceFormatted = prop.longitude === 1
          ? `${Number(prop.price).toLocaleString()} ل.س`
          : `$${prop.price}`;

        const popupHTML = `
          <div style="text-align: right; font-family: sans-serif; font-size: 12px; width: 170px; direction: rtl;">
            <img src="${prop.image}" style="width: 100%; height: 85px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" />
            <h4 style="margin: 0 0 4px 0; font-weight: 800; color: #111827; font-size: 12px;">${prop.title}</h4>
            <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 10px; font-weight: bold;">📍 ${prop.location}</p>
            <span style="font-weight: 900; color: #2D6A5F; font-size: 11px;">${priceFormatted} / ليلة</span>
            <br/>
            <a href="/property/${prop.id}" style="display: block; text-align: center; background: #2D6A5F; color: white; padding: 6px; border-radius: 8px; text-decoration: none; margin-top: 10px; font-weight: bold; font-size: 10px;">تفاصيل العقار</a>
          </div>
        `;
        marker.bindPopup(popupHTML);
      }
    });

    // احتواء جميع الدبابيس بشكل تلقائي
    if (!singleProperty && validMarkers.length > 0) {
      const bounds = L.latLngBounds(validMarkers);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [properties, center, zoom, singleProperty]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[350px] rounded-[24px] overflow-hidden shadow-sm border border-gray-100 z-10"
    />
  );
}
