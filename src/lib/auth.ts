import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Raditya301008_';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      id: 'credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const inputEmail = String(credentials.email).trim().toLowerCase();
        const inputPassword = String(credentials.password);

        if (
          inputEmail === ADMIN_EMAIL.toLowerCase() &&
          inputPassword === ADMIN_PASSWORD
        ) {
          return {
            id: 'admin-raditya',
            name: 'Raditya Rai Zeeshan',
            email: ADMIN_EMAIL,
          };
        }

        return null;
      },
    }),
    Credentials({
      id: 'passkey',
      name: 'Passkey Biometrics',
      credentials: {
        ticket: { label: 'Ticket', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.ticket) {
          return null;
        }

        const ticket = String(credentials.ticket);
        const validTicket = await prisma.passkeyChallenge.findFirst({
          where: {
            challenge: ticket,
            type: 'LOGIN_TICKET',
            expiresAt: { gt: new Date() },
          },
        });

        if (!validTicket) {
          return null;
        }

        await prisma.passkeyChallenge.delete({
          where: { id: validTicket.id },
        });

        return {
          id: 'admin-raditya',
          name: 'Raditya Rai Zeeshan',
          email: ADMIN_EMAIL,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/dashraditya',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.email && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
