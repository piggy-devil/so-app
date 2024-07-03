import { useSession } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  let isLoaded = false;

  if (status === "authenticated" || status == "unauthenticated") {
    isLoaded = true;
  }

  return { userId: session?.user.id, isLoaded: isLoaded };
};
