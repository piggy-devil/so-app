"use client";

import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const AuthLoading = ({ children }: Props) => {
  const { status } = useSession();

  if (status === "loading") {
    return <>{children}</>;
  }

  return "";
};

export default AuthLoading;
