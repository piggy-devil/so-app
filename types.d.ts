import { DefaultJWT, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      username?: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string; // Add role property to User interface
    username?: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    username?: string;
    avatar?: string;
  }
}
