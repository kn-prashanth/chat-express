"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addFriendValidator } from "@/lib/validations/add-friend";

interface AddFriendButtonProps {}
type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (username: string) => {
    try {
      const validatedUsername = addFriendValidator.parse({ username });
      setIsLoading(true);
      await axios.post("/api/friends/add", { username: validatedUsername });
      setShowSuccessState(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError("username", { message: error?.message });
        return;
      }
      if (error instanceof AxiosError) {
        setError("username", { message: error?.response?.data });
        return;
      }
      setError("username", { message: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.username);
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <label
        htmlFor="username"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by Username
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("username")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
          placeholder="Enter username"
        />
        <Button isLoading={isLoading}>{isLoading ? "" : "Add"}</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.username?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
