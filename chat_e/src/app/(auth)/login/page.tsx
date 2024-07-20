"use client";

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function loginToChatExpress(username: string, password: string) {

    // const passwordHash = await bcrypt.hash(password, 10);
    // const { data, error } = await db
    //   .from('login')
    //   .select("*");
    //   alert(JSON.stringify(data))
    // // return;
    // console.log("login data", data);
    

    setIsLoading(true)
    try {
        const result = await signIn("credentials", {
            redirect: true,
            username,
            password,
          });
          console.log("result");
          
          console.log(result);
          
          if (result?.error) {
            alert(result.error);
          } else {
            // Redirect to homepage or dashboard
            // window.location.href = "/";
            // alert("Successfuly logged in ;)")
          }
    } catch (error) {
        console.error("Error during sign-in", error);
        // alert("An unexpected error occurred. Please try again."+ JSON.stringify(error));
    } finally {
        setIsLoading(false);
    }
  }
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
