"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const UserButton = () => {
  const { data: session } = useSession();
  return (
    <>
      {session?.user.image && (
        <div className="text-center flex gap-2">
          <Image
            alt=""
            src={session.user.image}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 mx-auto cursor-pointer"
          />
          <button className="text-sm" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default UserButton;
