"use client";

import useConversation from "@/app/teacher/hooks/useConversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Plus } from "lucide-react";
import { SendHorizontal } from "lucide-react";
import MessageInput from "./MessageInput";

import { CldUploadButton } from "next-cloudinary";
import TeacherServices from "@/app/Services/TeacherServices";
import { Input } from "@/components/ui/input";
import EmojiPicker from "./EmojiPicker";

interface CloudinaryResult {
  secure_url?: string;
  info?:
    | string
    | {
        secure_url?: string;
      };
}

const MessageForm = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue("message", "", { shouldValidate: true }); // this re-renders, clearing the message input bar
    try {
      await TeacherServices.createTeacherMessage(conversationId, {
        ...data,
      });
    } catch (error) {
      console.log("Error in creating teacher message: ", error);
    }
  };

  // const handleUpload = (result: CloudinaryResult) => {
  //   const secureUrl = typeof result.info === 'string' ? result.info : result.info?.secure_url;

  //   axios.post("/api/messages", {
  //     image: secureUrl,
  //     conversationId,
  //   });
  // };

  const handleUpload = async (result: CloudinaryResult) => {
    // Check if secure_url is directly available or within the info object
    const secureUrl =
      result.secure_url ||
      (typeof result.info === "string" ? result.info : result.info?.secure_url);

    if (!secureUrl) {
      return;
    }

    // axios.post("/api/messages", {
    //   image: secureUrl,
    //   conversationId,
    // });
    await TeacherServices.createTeacherMessage(conversationId, {
      image: secureUrl,
    });
  };

  return (
    <div className="dark:bg-[#151515] py-4 border-gray-300  px-4 bg-white flex items-center w-full border-t gap-2 lg:gap-4 dark:rounded-sm dark:border-t-0 dark:border-x dark:border-b dark:border-gray-800">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="qxizqumd"
        onSuccess={handleUpload}
      >
        <Plus size={23} className="text-violet-500 hover:text-violet-800" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          placeholder="Write a Message"
          required
        />

        {/* <PiLineVerticalThin size={34} /> */}

        <button
          type="submit"
          className="rounded-full p-2 bg-violet-500 hover:bg-violet-800 text-white transition cursor-pointer"
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
