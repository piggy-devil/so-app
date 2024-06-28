"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectCheck = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("xxxx : ", session?.user.username);

  if (status === "loading") {
    <div>Loading.......</div>;
  }

  useEffect(() => {
    if (!session?.user.username && status === "authenticated") {
      router.push("/setname"); // เปลี่ยน URL ของหน้าเพจที่ต้องการ redirect
    }
  }, [router, session?.user.username, status]);

  return null;
};

export default RedirectCheck;
