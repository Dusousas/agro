import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveCustomerOnboarding } from '@/lib/customer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false });
  }

  await saveCustomerOnboarding(session.user.email, {
    name: req.body.name ?? '',
    city: req.body.city ?? '',
    addressLine: req.body.addressLine ?? '',
    addressReference: req.body.addressReference ?? '',
    deliveryDay: req.body.deliveryDay ?? '',
    deliveryWindow: req.body.deliveryWindow ?? '',
    basketProfile: req.body.basketProfile ?? '',
  });

  return res.status(200).json({ ok: true });
}
