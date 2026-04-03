'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PickupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/checkout?pickup=1');
  }, [router]);

  return null;
}
