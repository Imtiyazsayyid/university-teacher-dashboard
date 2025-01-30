"use client";

import Avatar from "../../chats/components/Avatar";
import useOtherUser from "../../hooks/useOtherUser";
import { FullConversationType } from "@/app/interfaces/ChatInterface";
import clsx from "clsx";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import AvatarGroup from "../../chats/components/AvatarGroup";

import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import useTeacherDetails from "../../hooks/useTeacherDetails";

// potential error -> otherUser has issue

interface Props {
  conversation: FullConversationType;
  selected?: boolean;
}

const ConversationBox = ({ conversation, selected }: Props) => {
  const otherUser = useOtherUser(conversation);
  const currentUser: Teacher | null = useTeacherDetails();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/teacher/conversations/${conversation.id}`);
  }, [router, conversation.id]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];

    const lastMessage = messages[messages.length - 1];
    return lastMessage;
  }, [conversation.messages]);

  const userEmail = useMemo(() => {
    return currentUser?.email;
  }, [currentUser?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.file) {
      return "sent an file";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 rounded-lg transition cursor-pointer p-3",
        selected
          ? "bg-neutral-100 dark:bg-violet-500"
          : "bg-white dark:bg-[#151515] hover:bg-neutral-200 dark:hover:bg-violet-800"
      )}
    >
      {conversation?.isGroup ? (
        <AvatarGroup teachers={conversation.teachers} />
      ) : (
        <Avatar teacher={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-mb font-medium text-gray-900 dark:text-gray-100">
              {conversation.name ??
                otherUser.firstName + " " + otherUser.lastName}
            </p>

            {lastMessage?.created_at && (
              <p className="text-sm text-gray-400 font-light dark:text-gray-400">
                {format(new Date(lastMessage.created_at), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen
                ? "text-gray-500 dark:text-gray-400"
                : "text-black dark:text-gray-200 font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
