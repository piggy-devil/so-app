"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectCheck = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user.username) {
      router.push("/setname"); // เปลี่ยน URL ของหน้าเพจที่ต้องการ redirect
    }
  }, [router, session?.user.username]);

  return null;
};

export default RedirectCheck;
