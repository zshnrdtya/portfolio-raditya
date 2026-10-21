import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

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
