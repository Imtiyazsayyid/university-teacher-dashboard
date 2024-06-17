import z from "zod";

const allowedGenders = ["male", "female", "other"];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Invalid Password"),
});

const courseSchema = z.object({
  name: z
    .string({ required_error: "Course Name is required" })
    .min(3, "Course Name is too short")
    .max(100, "Course Name is too long"),
  abbr: z
    .string({ required_error: "Course Abbreviation is required" })
    .min(1, "Course Abbreviation is too short")
    .max(20, "Course Abbreviation is too long"),
  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration is required",
  }),
});

const semesterSchema = z.object({
  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration is required",
  }),
  semNumber: z.number({
    required_error: "Sem Number is required",
    invalid_type_error: "Sem Number is required",
  }),
});

const subjectSchema = z.object({
  name: z
    .string({ required_error: "Subject Name is required" })
    .min(3, "Subject Name is too short")
    .max(100, "Subject Name is too long"),
  abbr: z
    .string({ required_error: "Subject Abbreviation is required" })
    .min(1, "Subject Abbreviation is too short")
    .max(20, "Subject Abbreviation is too long"),
  code: z
    .string({ required_error: "Subject Code is required" })
    .min(3, "Subject Code is too short")
    .max(45, "Subject Code is too long"),
  credits: z.number({
    required_error: "Credits are required",
    invalid_type_error: "Credits are required",
  }),
  subjectTypeId: z.number({
    required_error: "Subject Type is required",
    invalid_type_error: "Subject Type is required",
  }),
});

const unitSchema = z.object({
  name: z
    .string({ required_error: "Unit Name is required" })
    .min(3, "Unit Name is too short")
    .max(100, "Unit Name is too long"),
  number: z.number({
    required_error: "Unit Number is required",
    invalid_type_error: "Unit Number is required",
  }),
});

const unitMaterialSchema = z.object({
  name: z
    .string({ required_error: "Unit Name is required" })
    .min(3, "Unit Name is too short")
    .max(100, "Unit Name is too long"),

  link: z.string({ required_error: "File is required" }).min(3, "File is required"),
});

const unitQuizSchema = z.object({
  name: z
    .string({ required_error: "Unit Quiz Name is required" })
    .min(3, "Unit Quiz Name is too short")
    .max(100, "Unit Quiz Name is too long"),
});

const batchSchema = z.object({
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year is required",
  }),
  courseId: z.number({
    required_error: "Course is required",
    invalid_type_error: "Course is required",
  }),
});

const divisionSchema = z.object({
  name: z
    .string({ required_error: "Division Name is required" })
    .min(1, "Division Name is too short")
    .max(5, "Division Name is too long"),
});

const teacherSchema = z.object({
  firstName: z
    .string({ required_error: "First Name is required" })
    .min(2, "First Name is too short")
    .max(100, "First Name is too long"),
  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(2, "Last Name is too short")
    .max(100, "Last Name is too long"),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password is too short")
    .max(45, "Password is too long"),
  gender: z.string({ required_error: "Gender is required" }).refine((data) => allowedGenders.includes(data), {
    message: "Invalid gender",
  }),
});
const studentSchema = z.object({
  firstName: z
    .string({ required_error: "First Name is required" })
    .min(2, "First Name is too short")
    .max(100, "First Name is too long"),
  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(2, "Last Name is too short")
    .max(100, "Last Name is too long"),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password is too short")
    .max(45, "Password is too long"),
  rollNumber: z
    .string({ required_error: "Roll Number is required" })
    .min(3, "Password is too short")
    .max(15, "Password is too long"),
  gender: z.string({ required_error: "Gender is required" }).refine((data) => allowedGenders.includes(data), {
    message: "Invalid gender",
  }),
});

const teacherRoleSchema = z.object({
  name: z
    .string({ required_error: "Teacher Role Name is required" })
    .min(1, "Teacher Role Name is too short")
    .max(55, "Teacher Role Name is too long"),
});

const studentDocumentSchema = z.object({
  name: z
    .string({ required_error: "Student Document Name is required" })
    .min(1, "Student Document Name is too short")
    .max(55, "Student Document Name is too long"),
});

export {
  loginSchema,
  courseSchema,
  semesterSchema,
  subjectSchema,
  unitSchema,
  unitMaterialSchema,
  unitQuizSchema,
  batchSchema,
  divisionSchema,
  teacherSchema,
  studentSchema,
  teacherRoleSchema,
  studentDocumentSchema,
};
