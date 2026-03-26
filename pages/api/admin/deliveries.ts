import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getDb, isDatabaseConfigured } from '@/lib/db';

const allowedStatuses = ['Pendente', 'Em separacao', 'Enviado', 'Entregue'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: 'Nao autenticado.' });
  }

  if (!isAdminEmail(session.user.email)) {
    return res.status(403).json({ ok: false, message: 'Acesso negado.' });
  }

  if (!isDatabaseConfigured()) {
    return res.status(500).json({ ok: false, message: 'Banco nao configurado.' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ ok: false });
  }

  const db = getDb();
  await db.query(`alter table subscriptions add column if not exists delivery_status text not null default 'Pendente'`);
  await db.query(`alter table subscriptions add column if not exists last_delivery_update timestamptz`);

  const id = Number(req.body.id ?? 0);
  const status = String(req.body.status ?? '').trim();

  if (!id || !allowedStatuses.includes(status)) {
    return res.status(400).json({ ok: false, message: 'Entrega ou status invalido.' });
  }

  await db.query(
    `
    update subscriptions
    set
      delivery_status = $2,
      last_delivery_update = now()
    where id = $1
    `,
    [id, status]
  );

  return res.status(200).json({ ok: true });
}
