import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Mendapatkan API Key Gemini yang valid.
 * Mengutamakan file .env.local di direktori root projek untuk mencegah konflik
 * dengan environment variable sistem OS lama (misal key berawalan sk-).
 */
export function getGeminiApiKey(): string | undefined {
  try {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envLocalPath));
      if (parsed.GEMINI_API_KEY && !parsed.GEMINI_API_KEY.startsWith('sk-')) {
        return parsed.GEMINI_API_KEY.trim();
      }
    }
  } catch {}

  const processKey = process.env.GEMINI_API_KEY?.trim();
  if (processKey && !processKey.startsWith('sk-')) {
    return processKey;
  }

  return processKey;
}
