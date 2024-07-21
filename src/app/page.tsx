import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  // await db.from("users").insert([{ username: "prashi", password_hash: "reddy@1998" }]);
  return <Button variant={"ghost"}> Hello</Button>
}
