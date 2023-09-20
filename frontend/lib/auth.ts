import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/lib/db";
import { sendVerificationRequest } from "@/emails/sendVerificationEmail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: "",
      from: "auth@kaiwa.jcde.xyz",
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user }) {
      let dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        if (trigger === "signUp") {
          dbUser = await db.user.create({
            data: {
              email: token.email,
              name: token.name,
              image: token.picture,
            },
          });
        } else {
          throw new Error("No user found");
        }
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
  },
};