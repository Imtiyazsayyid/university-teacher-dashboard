"use client";

import useConversation from "@/app/teacher/hooks/useConversation";
import { FullMessageType } from "@/app/interfaces/ChatInterface";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
// import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import TeacherServices from "@/app/Services/TeacherServices";
// import { pusherClient } from "@/lib/pusher";

interface Props {
  initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: Props) => {
  const [messages, setMessages] = useState(initialMessages);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  

  useEffect(() => {
    if(conversationId == null) return ;
    const updateLastSeenOfMessage = async () => {
      try {
        await TeacherServices.updateLastSeenOfTeacherMessage(conversationId);
      } catch (error) {
        console.log("Error updating last seen: ", error);
      }
    };

    updateLastSeenOfMessage();
  }, [conversationId]);

  if(conversationId == null) return null;

  // pusher
  // useEffect(() => {
  //   pusherClient.subscribe(conversationId.toString());

  //   // following ref is use to directly focus on new messages
  //   buttonRef?.current?.scrollIntoView();

  //   // the following handler will receive the data from pusher
  //   const messageHandler = async (message: FullMessageType) => {
  //     await TeacherServices.updateLastSeenOfTeacherMessage(conversationId);

  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current;
  //       }

  //       return [...current, message];
  //     });

  //     buttonRef?.current?.scrollIntoView();
  //   };

  //   const updateMessageHandler = (newMessage: FullMessageType) => {
  //     setMessages((current) =>
  //       current.map((currentMessage) => {
  //         if (currentMessage.id === newMessage.id) {
  //           return newMessage;
  //         }
  //         return currentMessage;
  //       })
  //     ); 
  //   };

  //   pusherClient.bind("teacher:message:new", messageHandler);
  //   pusherClient.bind("teacher:message:update", updateMessageHandler);

  //   return () => {
  //     pusherClient.unsubscribe(conversationId.toString());

  //     pusherClient.unbind("teacher:message:new", messageHandler);
  //     pusherClient.unbind("teacher:message:update", updateMessageHandler);
  //   };
  // }, [conversationId]);

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
