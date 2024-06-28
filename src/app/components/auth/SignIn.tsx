"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "./GoogleSignInButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signIn("Credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex h-screen items-start justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 mt-48 rounded-md shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded" // Added border
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded" // Added border
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mb-4"
        >
          Sign In
        </button>{" "}
        {/* Google Sign in Button */}
        <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
      </form>
    </div>
  );
};

export default SignIn;
