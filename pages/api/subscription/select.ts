import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveCustomerPlan } from '@/lib/customer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false });
  }

  const planId = Number(req.body.planId);
  if (!planId) {
    return res.status(400).json({ ok: false, message: 'Plano invalido.' });
  }

  await saveCustomerPlan(session.user.email, planId);

  return res.status(200).json({ ok: true });
}
