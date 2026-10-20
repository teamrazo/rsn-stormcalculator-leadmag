import { handleDrawerSubmit } from '@/lib/drawer-submit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleDrawerSubmit(request, 'support');
}
