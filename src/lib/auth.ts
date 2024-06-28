// Server Component

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const currentUser = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
};
