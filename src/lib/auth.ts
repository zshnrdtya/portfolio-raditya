import { timingSafeEqual } from 'crypto';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const ADMIN_EMAIL = 'radityaraizeeshan@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function safeCompare(input: string, target: string): boolean {
  const bufInput = Buffer.from(input);
  const bufTarget = Buffer.from(target);
  if (bufInput.length !== bufTarget.length) {
    timingSafeEqual(bufInput, bufInput);
    return false;
  }
  return timingSafeEqual(bufInput, bufTarget);
}

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

        if (!ADMIN_PASSWORD) {
          console.error('[AUTH] ADMIN_PASSWORD belum dikonfigurasi di environment variables.');
          return null;
        }

        const inputEmail = String(credentials.email).trim().toLowerCase();
        const inputPassword = String(credentials.password);

        const isEmailValid = safeCompare(inputEmail, ADMIN_EMAIL.toLowerCase());
        const isPasswordValid = safeCompare(inputPassword, ADMIN_PASSWORD);

        if (isEmailValid && isPasswordValid) {
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'ZeeshanRadityaGuestbookSecret2026!SuperSafe',
  trustHost: true,
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
