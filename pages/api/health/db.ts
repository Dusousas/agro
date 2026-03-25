import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isDatabaseConfigured } from '@/lib/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!isDatabaseConfigured()) {
    return res.status(500).json({ ok: false, message: 'DATABASE_URL não configurada.' });
  }

  try {
    const db = getDb();
    await db.query('select 1');
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Erro ao conectar no banco.',
    });
  }
}
