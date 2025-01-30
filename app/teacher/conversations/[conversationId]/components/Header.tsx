"use client";
import Avatar from "@/app/teacher/chats/components/Avatar";
import useOtherUser from "@/app/teacher/hooks/useOtherUser";
import Link from "next/link";
import React, { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/teacher/chats/components/AvatarGroup";
import useActiveList from "@/app/teacher/hooks/useActiveList";
import { TeacherConversation } from "@/app/interfaces/ChatInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";

interface Props {
  conversation: TeacherConversation & {
    teachers: Teacher[];
  };
}

const Header = ({ conversation }: Props) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser.email) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.teachers.length} participants`;
    }

    return isActive ? "Available" : "Offline";
  }, [conversation.isGroup, isActive, conversation.teachers.length]);

  return (
    <>
      <div className="dark:bg-[#151515] dark:border-x dark:border-t dark:rounded-sm bg-white w-full flex sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center text-violet-500 hover:text-violet-800">
          <Link
            href="/teacher/conversations"
            className="lg:hidden  cursor-pointer block transition"
          >
            <ChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup teachers={conversation.teachers} />
          ) : (
            <Avatar teacher={otherUser} />
          )}

          <div className="flex flex-col">
            <div className="dark:text-white text-black font-semibold">
              {conversation.name ||
                `${otherUser.firstName} ${otherUser.lastName}`}
            </div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <ProfileDrawer conversation={conversation} />
      </div>
    </>
  );
};

export default Header;
