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

  const plan = req.body.plan;
  if (!plan?.slug || !plan?.name) {
    return res.status(400).json({ ok: false, message: 'Plano invalido.' });
  }

  const saved = await saveCustomerPlan(session.user.email, {
    slug: String(plan.slug),
    name: String(plan.name),
    monthlyPrice: Number(plan.monthlyPrice ?? 0),
    description: String(plan.description ?? ''),
  });

  if (!saved) {
    return res.status(400).json({ ok: false, message: 'Nao foi possivel finalizar a assinatura.' });
  }

  return res.status(200).json({ ok: true });
}
