import { Pool } from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var __pgPool: Pool | undefined;
}

export function isDatabaseConfigured() {
    return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not configured.');
    }

    if (!global.__pgPool) {
        global.__pgPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });
    }

    return global.__pgPool;
}
