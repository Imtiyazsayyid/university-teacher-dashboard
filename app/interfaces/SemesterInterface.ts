import { Course } from "./CourseInterface";
import { Subject } from "./SubjectInterface";

export type Semester = {
  id: number;
  semNumber: number;
  duration: number;
  courseId: number;

  course: Course;
  subjects: Subject[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
