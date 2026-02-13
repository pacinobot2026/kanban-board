import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple password - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chad2026';

export async function POST(request: NextRequest) {
  const { password, action } = await request.json();

  if (action === 'logout') {
    const cookieStore = await cookies();
    cookieStore.delete('kanban_auth');
    return NextResponse.json({ success: true });
  }

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('kanban_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('kanban_auth');
  return NextResponse.json({ authenticated: auth?.value === 'authenticated' });
}
