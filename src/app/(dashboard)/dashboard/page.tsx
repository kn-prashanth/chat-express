import Button from "@/components/ui/Button";
import { FC } from "react";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        Chat Express
      </h1>
      <p className="mt-4 text-gray-600 text-lg ">
        Messages you send will automatically disappear after 24 hours
      </p>
    </div>
  );
};

export default Page;
