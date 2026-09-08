import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUser, findUserByEmail } from "@/lib/db/queries";
import { grantSignupCredits } from "@/lib/credits";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (process.env.AUTH_DEV_LOGIN !== "true") {
          return null;
        }

        const email = credentials?.email?.trim().toLowerCase();
        if (!email) return null;

        let user = await findUserByEmail(email);
        if (!user) {
          user = await createUser({
            email,
            name: credentials?.name?.trim() || email.split("@")[0],
          });
          await grantSignupCredits(user.id);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
