import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  const isLoaded = status === "authenticated" ? true : false;

  return { user: session?.user, isLoaded: isLoaded };
};
