"use client";

import useConversation from "@/app/teacher/hooks/useConversation";
import { FullMessageType } from "@/app/interfaces/ChatInterface";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import TeacherServices from "@/app/Services/TeacherServices";

interface Props {
  initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: Props) => {
  const [messages, setMessages] = useState(initialMessages);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    if (conversationId == null) return;
    const updateLastSeenOfMessage = async () => {
      try {
        await TeacherServices.updateLastSeenOfTeacherMessage(conversationId);
      } catch (error) {
        console.log("Error updating last seen: ", error);
      }
    };

    updateLastSeenOfMessage();
  }, [conversationId, initialMessages]);

  if (conversationId == null) return null;

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="dark:bg-[#1a1a1a] flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          message={message}
          isLastMessage={i === messages.length - 1}
        />
      ))}
      <div ref={buttonRef} />
    </div>
  );
};

export default Body;
