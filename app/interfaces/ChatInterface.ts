import { Teacher } from "./TeacherInterface";
import { Student } from "./StudentInterface";

export type TeacherConversation = {
  id: number;
  name: string | null; // Optional for named/group conversations
  isGroup: boolean | null;

  created_at: Date;
  updated_at: Date;
  lastMessageAt: Date;

  teachers: Teacher[];
  messages: TeacherMessage[];
};

export type TeacherMessage = {
  id: number;
  body: string | null;
  image: string | null;
  file: string | null;

  created_at: Date;
  updated_at: Date;

  conversationId: number;
  conversation: TeacherConversation;

  senderId: number;
  sender: Teacher;

  seen: Teacher[];
};

export type FullMessageType = TeacherMessage & {
  sender: Teacher;
  seen: Teacher[];
};

export type FullConversationType = TeacherConversation & {
  users: Teacher[];
  messages: FullMessageType[];
};
