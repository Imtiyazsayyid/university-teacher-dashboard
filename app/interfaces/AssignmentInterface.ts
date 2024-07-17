export type Assignment = {
  id: number;
  name: string;
  description: string | null;
  divisionId: number;
  teacherId: number;
  subjectId: number;
  dueDate: Date;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
