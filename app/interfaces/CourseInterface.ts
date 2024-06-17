import { CourseStudentDocuments } from "./CourseStudentDocumentInterface";
import { Semester } from "./SemesterInterface";
import { StudentDocument } from "./StudentDocumentInterface";

export type Course = {
  id: number;
  name: string;
  abbr: string;
  duration: number;
  description: string | null;
  programOutcome: string | null;
  departmentalStrength: string | null;
  aboutFacility: string | null;
  eligibilty: string | null;
  significance: string | null;
  vision: string | null;
  mission: string | null;
  technicalActivities: string | null;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  semesters: Semester[];
  documents: CourseStudentDocuments[];
};
