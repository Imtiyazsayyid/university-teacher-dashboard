import { TeacherRole } from "./TeacherRoleInterface";
import { TeacherMessage } from "./ChatInterface";
import { TeacherConversation } from "./ChatInterface";

export type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  profileImg: string | null;
  address: string | null;

  roleId: number;
  role: TeacherRole;

  qualification: string | null;
  experience: number | null;
  about: string | null;
  awardsAndRecognition: string | null;
  guestSpeakerAndResourcePerson: string | null;
  participationInCWTP: string | null;
  researchPublications: string | null;
  certificationCourses: string | null;
  booksOrChapter: string | null;
  professionalMemberships: string | null;

  conversations: TeacherConversation[]; // List of conversations the teacher is part of
  seenMessages: TeacherMessage[]; // Messages seen by the teacher
  messages: TeacherMessage[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
