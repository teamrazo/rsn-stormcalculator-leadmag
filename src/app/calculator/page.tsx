import type { Metadata } from 'next';
import Calculator from '@/components/Calculator';
import { SHARE_DESCRIPTION, shareMeta } from '@/lib/seo';

const TITLE = 'Take the Storm Revenue Calculator | RazoRSharp Networks';

export const metadata: Metadata = {
  title: TITLE,
  description: SHARE_DESCRIPTION,
  ...shareMeta({ path: '/calculator', title: TITLE, description: SHARE_DESCRIPTION }),
};

export default function CalculatorPage() {
  return <Calculator />;
}
