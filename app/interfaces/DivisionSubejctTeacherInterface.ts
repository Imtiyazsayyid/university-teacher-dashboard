import { Subject } from "./SubjectInterface";

export type DivisionSubjectTeacher = {
  id: number;
  subjectId: number;
  subject: Subject;
  teacherId: number;
  divisionId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
