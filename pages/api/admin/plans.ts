import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getDb, isDatabaseConfigured } from '@/lib/db';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  const name = String(req.body.name ?? '').trim();
  const description = String(req.body.description ?? '').trim();
  const monthlyPrice = Number(req.body.monthlyPrice ?? 0);
  const active = req.body.active !== false;
  const slug = String(req.body.slug ?? slugify(name)).trim() || slugify(name);

  if (!name || !description || !monthlyPrice || !slug) {
    return res.status(400).json({ ok: false, message: 'Preencha nome, valor e descricao.' });
  }

  if (req.method === 'PUT' && id) {
    await db.query(
      `
      update plans
      set
        slug = $2,
        name = $3,
        monthly_price = $4,
        description = $5,
        active = $6
      where id = $1
      `,
      [id, slug, name, monthlyPrice, description, active]
    );

    return res.status(200).json({ ok: true });
  }

  await db.query(
    `
    insert into plans (slug, name, monthly_price, description, active)
    values ($1, $2, $3, $4, $5)
    on conflict (slug)
    do update set
      name = excluded.name,
      monthly_price = excluded.monthly_price,
      description = excluded.description,
      active = excluded.active
    `,
    [slug, name, monthlyPrice, description, active]
  );

  return res.status(200).json({ ok: true });
}
