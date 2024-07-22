"use client";

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function loginToChatExpress(username: string, password: string) {    
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
    router.push('/dashboard');
  }
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-1">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className=" text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:text-blue-700">
                Sign Up
              </a>
          </p>
          </div>
          <div className="w-full max-w-sm mx-auto">
            <div className="space-y-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            <Button
              isLoading={isLoading}
              type="button"
              className="mt-6 max-w-sm mx-auto w-full"
              onClick={() => loginToChatExpress(username, password)}
            >
                {isLoading ? null : "Sign in"}
            </Button>
            <p className="mt-1 text-lg text-red-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
