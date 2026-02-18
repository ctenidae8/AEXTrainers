import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  // Simple auth check — requires NEXTAUTH_SECRET as query param
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: 'Database initialized' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
