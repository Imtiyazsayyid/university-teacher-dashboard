import { Student } from "./StudentInterface";
import { Teacher } from "./TeacherInterface";

export type Event = {
  id: number;
  name: string;
  description: string;
  datetime: Date;
  eventHeadId: number;
  eventHead: Teacher;
  eventFor: "students" | "teachers" | "all";
  finalRegistrationDate: Date;
  approvalStatus: "pending" | "approved" | "rejected";
  venue?: string;
  isCompleted: Boolean;

  eventOrganisers: EventOrganiser[];
  eventParticipants: EventParticipant[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type EventOrganiser = {
  id: number;
  eventId: number;
  event: Event;
  teacherId: number;
  teacher: Teacher;
  approvalStatus: "pending" | "approved" | "rejected";
  message: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type EventParticipant = {
  id: number;
  eventId: number;
  event: Event;
  studentId: number;
  student: Student;

  teacherId: number;
  teacher: Teacher;

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
