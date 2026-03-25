import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getDb, isDatabaseConfigured } from './db';

async function upsertCustomer(email?: string | null, name?: string | null) {
    if (!email || !isDatabaseConfigured()) return;

    const db = getDb();

    await db.query(
        `
        insert into customers (name, email, city)
        values ($1, $2, 'Brotas - SP')
        on conflict (email)
        do update set
            name = coalesce(excluded.name, customers.name)
        `,
        [name ?? 'Cliente', email]
    );
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user }) {
            await upsertCustomer(user.email, user.name);
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.email) {
                session.user.email = token.email;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
