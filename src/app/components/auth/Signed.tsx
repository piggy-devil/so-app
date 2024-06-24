"use client";

import { signIn, useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SignedIn = ({ children, className }: Props) => {
  const { status } = useSession();

  if (status === "authenticated") {
    return <div className={className}>{children}</div>;
  }
  return <></>;
};

export const SignedOut = ({ children }: Props) => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return <button onClick={() => signIn()}>{children}</button>;
  }
  return <></>;
};
