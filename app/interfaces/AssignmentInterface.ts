import { Batch } from "./BatchInterface";
import { Course } from "./CourseInterface";
import { Division } from "./DivisionInterface";
import { Subject } from "./SubjectInterface";
import { Teacher } from "./TeacherInterface";

export type Assignment = {
  id: number;
  name: string;
  description: string | null;
  divisionId: number;
  teacherId: number;
  subjectId: number;
  dueDate: Date;
  subject: Subject;
  teacher: Teacher;
  division: Division;

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
