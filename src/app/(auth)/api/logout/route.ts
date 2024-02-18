import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const WEB_URL = process.env.WEB_URL;

export async function GET() {
  cookies().set('access_token', '', { expires: new Date(0) });
  cookies().set('refresh_token', '', { expires: new Date(0) });
  redirect(`${WEB_URL}/login`);
}
