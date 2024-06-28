"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SetUsername() {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      router.push(`/profile/${session.user.id}`);
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session || !session.user) {
    router.push("/sign-in");
    return null;
  }

  // if (session.user.username) {
  //   redirect(`/profile/${session.user.id}`);
  // }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting username...");
    try {
      const res = await fetch("/api/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong");
        return;
      }

      const data = await res.json();

      if (data.success) {
        update({ username: username });
        router.push(`/profile/${session.user.id}`);
      }
      if (data.error) {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex h-screen items-start justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 mt-60 rounded-md shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Set Username
        </button>
      </form>
    </div>
  );
}
