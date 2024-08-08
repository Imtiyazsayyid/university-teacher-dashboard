import { Division } from "./DivisionInterface";
import { Subject } from "./SubjectInterface";

export type DivisionSubjectTeacher = {
  id: number;
  subjectId: number;
  subject: Subject;
  teacherId: number;
  divisionId: number;
  division: Division;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
