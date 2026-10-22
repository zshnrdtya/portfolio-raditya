import type { NextRequest } from 'next/server';

export interface VisitorMetadata {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  country: string;
  city: string;
}

/**
 * Mengekstrak informasi perangkat, browser, dan lokasi geografis dari header request.
 */
export function extractVisitorMetadata(request: NextRequest | Request): VisitorMetadata {
  const ua = request.headers.get('user-agent') || '';

  // Deteksi Tipe Perangkat
  let device: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/Tablet|iPad/i.test(ua)) {
    device = 'Tablet';
  } else if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    device = 'Mobile';
  }

  // Deteksi Nama Browser
  let browser = 'Browser Lain';
  if (/Edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/Opera|OPR/i.test(ua)) {
    browser = 'Opera';
  }

  // Deteksi Lokasi dari Geolocation Header (Vercel / Cloudflare / Proxy)
  const countryHeader =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    'ID';

  const cityHeader =
    request.headers.get('x-vercel-ip-city') ||
    request.headers.get('x-city') ||
    (countryHeader === 'ID' ? 'Jakarta' : 'Global');

  // Decode URI jika cityHeader mengandung karakter terenkode
  let decodedCity = 'Indonesia';
  try {
    decodedCity = cityHeader ? decodeURIComponent(cityHeader) : 'Indonesia';
  } catch {
    decodedCity = cityHeader || 'Indonesia';
  }

  return {
    device,
    browser,
    country: countryHeader.toUpperCase().slice(0, 4),
    city: decodedCity.slice(0, 50),
  };
}

/**
 * Membersihkan referer URL agar hanya menyimpan nama domain untuk privasi.
 */
export function cleanReferrer(rawReferrer: string | null | undefined): string {
  if (!rawReferrer) return 'Langsung (Direct)';
  try {
    const url = new URL(rawReferrer);
    return url.hostname.replace('www.', '');
  } catch {
    return 'Langsung (Direct)';
  }
}
