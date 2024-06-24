"use client";

import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const AuthLoaded = ({ children }: Props) => {
  const { status } = useSession();

  if (status === "authenticated" || status == "unauthenticated") {
    return <>{children}</>;
  }

  return <></>;
};

export default AuthLoaded;
