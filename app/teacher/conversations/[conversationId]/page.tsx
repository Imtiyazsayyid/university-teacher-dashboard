"use client";
import EmptyState from "../../chats/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import MessageForm from "./components/MessageForm";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { useEffect, useState } from "react";
import {
  TeacherConversation,
  FullMessageType,
} from "@/app/interfaces/ChatInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";

interface Props {
  params: {
    conversationId: number;
  };
}

const ConversationIdPage = ({ params }: Props) => {
  const [conversation, setConversation] = useState<
    | (TeacherConversation & {
        teachers: Teacher[];
      })
    | null
  >(null);
  const [messages, setMessages] = useState<FullMessageType[] | []>([]);

  const getConversationById = async () => {
    try {
      const res = await TeacherServices.getTeacherConversationById(
        params.conversationId
      );

      if (!res.data?.status) {
        StandardErrorToast();
        return null;
      }

      const { conversation, messages } = res.data.data;
      setConversation(conversation);
      setMessages(messages);
    } catch (error) {
      console.log("Error fetching conversation By id", error);
    }
  };

  useEffect(() => {
    getConversationById();
  }, []);

  // Polling logic
  // useEffect(() => {
  //   if (!params.conversationId) {
  //     console.warn("Conversation ID is missing for polling");
  //     return;
  //   }

  //   const interval = setInterval(() => {
  //     console.log("Polling for updates...");
  //     getConversationById();
  //   }, 200); // Poll every 200ms

  //   return () => {
  //     clearInterval(interval); // Cleanup on unmount
  //     console.log("Stopped polling");
  //   };
  // }, [params.conversationId]);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col dark:border-1 dark:rounded-sm">
        <Header conversation={conversation} />
        <Body initialMessages={messages!} />
        <MessageForm />
      </div>
    </div>
  );
};

export default ConversationIdPage;



