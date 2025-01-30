"use client";

import useOtherUser from "@/app/teacher/hooks/useOtherUser";
import { format } from "date-fns";
import { useMemo, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Ellipsis } from "lucide-react";
import Avatar from "@/app/teacher/chats/components/Avatar";
import ConfirmDelete from "./ConfirmDelete";
import AvatarGroup from "@/app/teacher/chats/components/AvatarGroup";
import useActiveList from "@/app/teacher/hooks/useActiveList";
import { TeacherConversation } from "@/app/interfaces/ChatInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";

interface Props {
  conversation: TeacherConversation & {
    teachers: Teacher[];
  };
}

const ProfileDrawer = ({ conversation }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();

  // const otherUserEmail = otherUser?.email ?? "";
  // const isActive = members.indexOf(otherUserEmail) !== -1;
  const isActive = members.indexOf(otherUser.email) !== -1;

  const joinedDate = useMemo(() => {
    if (!otherUser?.created_at) return "N/A";
    return format(new Date(otherUser.created_at), "PP");
  }, [otherUser.created_at]);

  const title = useMemo(() => {
    return conversation.name || otherUser.firstName + " " + otherUser.lastName;
  }, [conversation.name, otherUser.firstName, otherUser.lastName]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `Group has ${conversation.teachers.length} participants`;
    }
    return isActive ? "Available" : "Offline";
  }, [conversation, isActive]);

  const usersEmail = conversation.teachers.map((teacher) => teacher.email);

  return (
    <>
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger>
          <Ellipsis
            size={32}
            className="text-violet-500 cursor-pointer hover:text-violet-800 transition"
          />
        </SheetTrigger>

        <SheetContent>
            <div className="relative mt-14 flex-1 px-4 sm:px-6">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  {conversation.isGroup ? (
                    <AvatarGroup teachers={conversation.teachers} />
                  ) : (
                    <Avatar teacher={otherUser} />
                  )}
                </div>
                <div>{title}</div>
                <div className="text-sm text-gray-500">{statusText}</div>

                <div className="flex flex-col gap-4 my-8">
                  <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                    <ConfirmDelete />
                  </div>

                  <div className="dark:text-white text-sm font-light text-neutral-600">
                    Delete {conversation.isGroup ? "Group" : "Chat"}
                  </div>
                </div>
              </div>

              <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                  {conversation.isGroup && (
                    <div>
                      <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Emails
                      </dt>
                      <div className="flex flex-col">
                        {usersEmail.map((email) => (
                          <dd
                            key={email}
                            className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2"
                          >
                            {email}
                          </dd>
                        ))}
                      </div>
                    </div>
                  )}
                  {!conversation.isGroup && (
                    <div>
                      <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Email
                      </dt>
                      <dd className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2">
                        {otherUser.email}
                      </dd>
                    </div>
                  )}
                  {!conversation.isGroup && (
                    <>
                      <hr />
                      <div>
                        <dt className="dark:text-gray-400 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                          Joined
                        </dt>
                        <dd className="dark:text-white mt-1 text-sm text-gray-900 sm:col-span-2">
                          {joinedDate}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileDrawer;
