import { Course } from "./CourseInterface";
import { Division } from "./DivisionInterface";
import { Semester } from "./SemesterInterface";

export type Batch = {
  id: number;
  year: number;
  courseId: number;

  course: Course;
  accessibleSemesters: BatchSemesterMap[];
  divisions: Division[];

  status: boolean;
  created_at: Date;
  updated_at: Date;
};

export type BatchSemesterMap = {
  id: number;
  semesterId: number;
  semester: Semester;

  batchId: number;
  batch: Batch;

  status: boolean;
  created_at: Date;
  updated_at: Date;
};
