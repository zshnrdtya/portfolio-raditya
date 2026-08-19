import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // JWT-only, no database adapter needed
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      // Expose email from JWT token into session
      if (token.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
