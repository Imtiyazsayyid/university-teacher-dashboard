"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import EmojiPicker from "./EmojiPicker";
import { useState } from "react";

interface Props {
  id: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput = ({
  id,
  required,
  placeholder,
  register,
  type,
}: Props) => {
  // const [emojiInput, setEmojiInput] = useState("");

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        autoComplete={id}
        {...register(id, { required })}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black dark:text-white font-light"
      />
      {/* <button className="absolute right-6 top-[12px]">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      </button> */}
    </div>
  );
};

export default MessageInput;
