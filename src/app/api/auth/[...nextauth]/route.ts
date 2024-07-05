import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        if (
          user.password &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.family_name
            ? `${profile.given_name} ${profile.family_name}`
            : profile.given_name,
          email: profile.email,
          image: profile.picture,
          role: "member",
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      if (trigger === "update" && session.username) {
        token.username = session.username;
      }

      if (user) {
        // เรียกเฉพาะตอนที่ login เท่านั้น
        // ส่ง id และ username ไปยัง token
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
        };
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id },
      });
      token.username = dbUser?.username!;
      token.role = dbUser?.role!;
      token.avatar = dbUser?.avatar!;

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role,
          avatar: token.avatar,
        },
      };

      // if (session.user) {
      //   session.user.id = token.id;
      //   session.user.role = token.role;
      //   session.user.username = token.username;
      // }
      // return session;
    },
    // async redirect({ baseUrl }) {
    //   return `${baseUrl}/home`;
    // },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("user.id : ", user.id);
      console.log("account : ", account);
      console.log("isNewUser : ", isNewUser);
      console.log("profile : ", profile);

      if (isNewUser && account?.provider === "google") {
        console.log("google");

        // สำหรับ user ใหม่ เก็บรูป profile จาก Provider ไว้ใน field avatar
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: profile?.image },
        });
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
