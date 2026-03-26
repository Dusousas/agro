import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { isDatabaseConfigured } from '@/lib/db';
import { savePlanCatalogEntry } from '@/lib/customer';

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

  const id = Number(req.body.id ?? 0);
  const name = String(req.body.name ?? '').trim();
  const badge = String(req.body.badge ?? '').trim();
  const description = String(req.body.description ?? '').trim();
  const monthlyPrice = Number(req.body.monthlyPrice ?? 0);
  const active = req.body.active !== false;
  const slug = String(req.body.slug ?? slugify(name)).trim() || slugify(name);
  const items = Array.isArray(req.body.items)
    ? req.body.items.map((item: unknown) => String(item ?? '').trim()).filter(Boolean)
    : [];

  if (!name || !description || !monthlyPrice || !slug) {
    return res.status(400).json({ ok: false, message: 'Preencha nome, valor e descricao.' });
  }

  const saved = await savePlanCatalogEntry({
    id: req.method === 'PUT' && id ? id : undefined,
    slug,
    name,
    badge,
    monthlyPrice,
    description,
    active,
    items,
  });

  if (!saved) {
    return res.status(400).json({ ok: false, message: 'Nao foi possivel salvar o plano.' });
  }

  return res.status(200).json({ ok: true });
}
