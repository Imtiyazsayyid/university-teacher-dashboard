import { Batch } from "./BatchInterface";
import { Course } from "./CourseInterface";
import { CourseStudentDocuments } from "./CourseStudentDocumentInterface";
import { Division } from "./DivisionInterface";
import { UploadedStudentDocument } from "./UploadedStudentDocumentsInterface";

export type Student = {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  profileImg: string | null;
  address: string | null;
  courseId: number;
  batchId: number;
  divisionId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  batch: Batch;
  course: Course;
  division: Division;

  uploadedStudentDocuments: UploadedStudentDocument[];
};
