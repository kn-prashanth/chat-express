"use client";
import Button from "@/components/ui/Button";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";
import { z } from "zod";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const signupAndLoginToChatExpress = async (
    fullname: string,
    username: string,
    password: string
  ) => {
    if (!fullname.trim() || !username.trim() || !password.trim()) {
      setError("Please enter all the details");
      return;
    } else if(username.length < 5) {
      setError("Username must be at least 5 characters long");
      return
    } else if(password.length < 5) {
      setError("Password must be at least 5 characters long");
      return
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/users/add", {
        username,
        fullname,
        password,
      });
      const result = await signIn("credentials", {
        redirect: true,
        username,
        password,
      });

      if (result?.error) {
        console.error("Error during sign-in", error);
      } else {
        // Redirect to homepage or dashboard
        // window.location.href = "/";
        // alert("Successfuly logged in ;)")
      }
    } catch (error) {
      console.error("Error during sign-in", error);
      if (error instanceof z.ZodError) {
        setError(error.message);
        return;
      }
      if (error instanceof AxiosError) {
        setError(error.response?.data);
        return;
      }
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-1">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
            </h2>
            <p className=" text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:text-blue-700">
                Sign in
              </a>
            </p>
          </div>
          <div className="w-full max-w-sm mx-auto">
            <div className="space-y-6">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
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
              onClick={() =>
                signupAndLoginToChatExpress(fullname, username, password)
              }
            >
              {isLoading ? null : "Sign up"}
            </Button>
            <p className="mt-1 text-lg text-red-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
