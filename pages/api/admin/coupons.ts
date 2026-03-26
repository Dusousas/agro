import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getDb, isDatabaseConfigured } from '@/lib/db';

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

  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ ok: false });
  }

  const db = getDb();
  const id = Number(req.body.id ?? 0);
  const code = String(req.body.code ?? '').trim().toUpperCase();
  const status = String(req.body.status ?? 'Ativo').trim() || 'Ativo';
  const discount = String(req.body.discount ?? '').trim();

  if (!code || !discount) {
    return res.status(400).json({ ok: false, message: 'Preencha codigo e desconto.' });
  }

  if (req.method === 'PUT' && id) {
    await db.query(
      `
      update coupons
      set
        code = $2,
        status = $3,
        discount_text = $4
      where id = $1
      `,
      [id, code, status, discount]
    );

    return res.status(200).json({ ok: true });
  }

  await db.query(
    `
    insert into coupons (code, status, discount_text)
    values ($1, $2, $3)
    on conflict (code)
    do update set
      status = excluded.status,
      discount_text = excluded.discount_text
    `,
    [code, status, discount]
  );

  return res.status(200).json({ ok: true });
}
