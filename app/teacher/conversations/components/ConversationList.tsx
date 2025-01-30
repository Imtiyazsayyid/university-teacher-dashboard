"use client";

import useConversation from "../../hooks/useConversation";
import { FullConversationType } from "@/app/interfaces/ChatInterface";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import { UserPlus } from "lucide-react";
import GroupChatModal from "./GroupChatModal";
// import { useSession } from "next-auth/react";
// import { pusherClient } from "@/app/libs/pusher";

import { Teacher } from "@/app/interfaces/TeacherInterface";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Input } from "@/components/ui/input";
import useTeacherDetails from "../../hooks/useTeacherDetails";
import { find } from "lodash";

const ConversationList = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const currentTeacher = useTeacherDetails();

  const getAllTeachers = async () => {
    try {
      setLoading(true);
      const res = await TeacherServices.getTeachersList();

      if (!res.data?.status) {
        StandardErrorToast();
        return [];
      }

      setTeachers(res.data.data || []);
    } catch (error) {
      console.log("Error fetching Teachers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTeachers();
  }, []);

  const getConversations = async () => {
    try {
      setLoading(true);
      const res = await TeacherServices.getTeacherConversations({...filters});

      if (!res.data?.status) {
        StandardErrorToast();
        return;
      }

      setConversations(res.data.data || []);
    } catch (error) {
      console.log("Error fetching getTeacherConversations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
  }, [filters]);


  // Pusher

  // const pusherKey = useMemo(() => {
  //   return currentTeacher?.email;
  // }, [currentTeacher?.email]);

  // useEffect(() => {
  //   if (!pusherKey) {
  //     return;
  //   }

  //   pusherClient.subscribe(pusherKey);

  //   // this adds new conversation in real time
  //   const newConversationHandler = (newConversation: FullConversationType) => {
  //     setConversations((current) => {
  //       if (find(current, { id: newConversation.id })) {
  //         return current;
  //       }

  //       return [newConversation, ...current];
  //     });
  //   };

  //   // this updates the lastmessage in real time
  //   const updateConversationHandler = (conversation: FullConversationType) => {
  //     setConversations((current) =>
  //       current.map((currentConversation) => {
  //         if (currentConversation.id === conversation.id) {
  //           return {
  //             ...currentConversation,
  //             messages: conversation.messages,
  //           };
  //         }

  //         return currentConversation;
  //       })
  //     );
  //   };

  //   const removeConversationHandler = (conversation: FullConversationType) => {
  //     setConversations((current) => {
  //       return [...current.filter((convo) => convo.id !== conversation.id)];
  //     });

  //     if (conversationId === conversation.id) {
  //       router.push("/teacher/conversations");
  //     }
  //   };

  //   pusherClient.bind("teacher:conversation:new", newConversationHandler);
  //   pusherClient.bind("teacher:conversation:update", updateConversationHandler);
  //   pusherClient.bind("teacher:conversation:remove", removeConversationHandler);

  //   return () => {
  //     pusherClient.unsubscribe(pusherKey);
  //     pusherClient.unbind("teacher:conversation:new", newConversationHandler);
  //     pusherClient.unbind("teacher:conversation:update", updateConversationHandler);
  //     pusherClient.unbind("teacher:conversation:remove", removeConversationHandler);
  //   };
  // }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teachers={teachers}
      />
      {/* for responsive mobile */}
      {/* fixed inset-y-0 pb-20 lg:pb-0 lg:left-24 lg:pl-0 lg:top-[98px] lg:w-80 lg:h-[720px] lg:block overflow-y-auto border-r border-gray-200 dark:border-gray-800 */}
      {/* for computer */}
      {/* fixed w-[320px] lg:h-[700px] overflow-y-auto border-r */}
      <aside
        className={clsx(
          "fixed w-[320px] lg:h-[700px] overflow-y-auto border-r ",
          // isOpen ? "hidden" : "block left-0 w-full pl-24 top-[110px]" // for mobile responsive (uncomment)
          // isOpen ? "hidden" : "fixed lg:w-[420px] lg:h-[700px] overflow-y-auto border-r w-full left-0 pl-24"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800 dark:text-white">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="dark:text-stone-600 rounded-full p-2 bg-gray-100 cursor-pointer hover:opacity-75 transition"
            >
              <UserPlus size={20} />
            </div>
          </div>
          <div className="flex items-center w-full border mb-5 p-1 rounded-lg">
            <Input
              type="text"
              placeholder="Search group chats"
              className="flex-1 border-none"
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
            />
          </div>

          {conversations.map((conversation) => (
            <ConversationBox
              key={conversation.id}
              conversation={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
