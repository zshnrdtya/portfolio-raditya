import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_CONTENT, SectionKey, SiteContentMap } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await prisma.siteContent.findMany();

    const mergedContent: SiteContentMap = { ...DEFAULT_SITE_CONTENT };

    for (const record of records) {
      const key = record.section as SectionKey;
      if (mergedContent[key] && record.data && typeof record.data === 'object') {
        mergedContent[key] = {
          ...mergedContent[key],
          ...(record.data as Record<string, unknown>),
        } as never;
      }
    }

    return NextResponse.json(mergedContent);
  } catch (error) {
    console.error('[API /api/content] GET error:', error);
    // Fallback to default hardcoded content if database is unreachable
    return NextResponse.json(DEFAULT_SITE_CONTENT);
  }
}
