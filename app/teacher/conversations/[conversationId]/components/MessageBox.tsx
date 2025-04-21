"use client";

import Avatar from "@/app/teacher/chats/components/Avatar";
import { FullMessageType } from "@/app/interfaces/ChatInterface";
import clsx from "clsx";
// import { useSession } from "next-auth/react";

import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import useTeacherDetails from "@/app/teacher/hooks/useTeacherDetails";

interface Props {
  message: FullMessageType;
  isLastMessage?: boolean;
}

const MessageBox = ({ message, isLastMessage }: Props) => {
  const currentUser = useTeacherDetails();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = currentUser?.email === message?.sender?.email;

  // the following will produce somelike -> John, Sam, Dave for groups and normally a single name
  const seenList = (message.seen || [])
    .filter(
      (user) => user.email !== message?.sender?.email // removing sender email from seen
    )
    .map((user) => user.firstName)
    .join(", ");

  // following are some dynamic classes
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2 ", isOwn && "items-end");

  const messageClass = clsx(
    "text-sm w-fit overflow-hidden ",
    isOwn
      ? "bg-violet-500 text-white"
      : "dark:bg-[#111] dark:text-gray-300 bg-gray-100 text-gray-800",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar teacher={message.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 ">
            {message.sender.firstName}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.created_at), "p")}
          </div>
        </div>

        <div className={messageClass}>
          <ImageModal
            src={message.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {message.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              src={message.image}
              height="288"
              width="288"
              className="object-cover cursor-pointer hover:scale-110 transition translate"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 288px" // Customize based on your layout needs
              style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
            />
          ) : (
            <div>{message.body}</div>
          )}
        </div>
        {isLastMessage && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500 ">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
