import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error", // Error code passed in query string as ?error=
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const { username, password } = credentials;

        const { data, error } = await db
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (error) {
          throw new Error("Invalid username or password");
        }

        const validPassword = await bcrypt.compare(
          password,
          data.password_hash
        );
        
        if (!validPassword) {
          throw new Error("Invalid username or password"+ JSON.stringify(data));
        }

        return data;
      },
    }),
  ],

  callbacks: {    
    async jwt({ token, user }) {
      // console.log("inside callback")
      // console.log("user", user);
      const response = await db
        .from("users")
        .select("*")
        .eq("id", token.sub)
        .single();

      let dbUser: User | null = null;

      if (response.error) {
        console.error("Error fetching user:", response.error.message);
      } else {
        dbUser = response.data as User;
      }

      if (user) {
        token.id = user.id;
        token.username = dbUser?.username;
        token.password_hash = dbUser?.password_hash;
        token.created_at = dbUser?.created_at;
        token.name = dbUser?.name;
        token.picture = dbUser?.image;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("inside session")
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.password_hash = token.password_hash;
        session.user.created_at = token.created_at;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      console.log("redirect:url", url);
      console.log("edirect:baseUrl", baseUrl);
      
      
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
