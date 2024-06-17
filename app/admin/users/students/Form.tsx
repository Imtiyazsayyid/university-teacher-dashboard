"use client";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Batch } from "@/app/interfaces/BatchInterface";
import { Course } from "@/app/interfaces/CourseInterface";
import { Student } from "@/app/interfaces/StudentInterface";
import { Combobox } from "@/app/my-components/Combobox";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import GoBack from "@/app/my-components/GoBack";
import { MySelect } from "@/app/my-components/MySelect";
import UploadCloudinary from "@/app/my-components/UploadCloudinary";
import UploadProfileCloudinary from "@/app/my-components/UploadProfileCloudinary";
import { studentSchema } from "@/app/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon, LibraryBigIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  currentStudent?: Student;
}

interface UploadedDocument {
  documentId: number;
  name: string;
  url: string;
  status: boolean;
}

const StudentForm = ({ currentStudent }: Props) => {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [studentDetails, setStudentDetails] = useState({
    rollNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    profileImg: "",
    address: "",

    courseId: null as number | null,
    batchId: null as number | null,
    divisionId: null as number | null,

    uploadedStudentDocuments: [] as UploadedDocument[],

    status: true,
  });

  useEffect(() => {
    if (currentStudent) {
      setStudentDetails({
        rollNumber: currentStudent.rollNumber || "",
        firstName: currentStudent?.firstName || "",
        lastName: currentStudent?.lastName || "",
        email: currentStudent?.email || "",
        password: currentStudent?.password || "",
        gender: currentStudent?.gender || "",
        profileImg: currentStudent?.profileImg || "",
        address: currentStudent?.address || "",

        courseId: currentStudent?.courseId || null,
        batchId: currentStudent?.batchId || null,
        divisionId: currentStudent?.divisionId || null,

        status: currentStudent?.status ? true : false,
        uploadedStudentDocuments: currentStudent?.uploadedStudentDocuments.map((d) => ({
          documentId: d.documentId,
          name: d.document.name,
          url: d.url,
          status: d.document.status,
        })),
      });
    }
  }, [currentStudent]);

  const getUSD = () => {
    if (!studentDetails.courseId) return;

    const selectedCourse = courses.find((c) => c.id === studentDetails.courseId);

    if (!selectedCourse) return;

    let uploadedStudentDocuments = selectedCourse?.documents.map((d) => ({
      documentId: d.documentId,
      name: d.document.name,
      url:
        (currentStudent && currentStudent.uploadedStudentDocuments.find((sd) => sd.documentId === d.documentId)?.url) ||
        "",
      status: d.document.status,
    }));

    setStudentDetails({
      ...studentDetails,
      uploadedStudentDocuments,
    });
  };

  const setLink = (link: string, documentId: number) => {
    let newUSD = studentDetails.uploadedStudentDocuments.map((d) =>
      d.documentId === documentId
        ? {
            ...d,
            url: link,
          }
        : d
    );

    setStudentDetails({
      ...studentDetails,
      uploadedStudentDocuments: newUSD,
    });
  };

  useEffect(() => {
    getUSD();
  }, [studentDetails.courseId, courses]);

  const isRollNumberValid = async () => {
    if (studentDetails.rollNumber.length !== 10) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Roll Number Must Have 10 Characters.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    const batch = batches.find((b) => b.id === studentDetails.batchId);
    const division = batch?.divisions.find((d) => d.id === studentDetails.divisionId);

    if (!batch || !division) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Invalid Batch or Division",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    if (
      studentDetails.rollNumber.substring(0, 2) !== batch.year.toString().substring(batch.year.toString().length - 2)
    ) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Roll Number Must Start With Batch Year.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    if (studentDetails.rollNumber.substring(2, 5) !== fillZeros(batch.courseId, 3)) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Roll Number Must Have Course ID.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    if (studentDetails.rollNumber[5] !== division.name) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Roll Number Must Have Correct Division Name.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    if (isNaN(parseInt(studentDetails.rollNumber.substring(6)))) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "Last 4 Characters Must Be Digits.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    const studentListRes = await AdminServices.getAllStudents();
    let students: Student[] = studentListRes.data.data.students;

    if (currentStudent) {
      students = students.filter((s) => s.id !== currentStudent?.id);
    }

    const repeatedRollNumber = students.find((s) => s.rollNumber === studentDetails.rollNumber);
    if (repeatedRollNumber) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: "The Chosen Roll Number is already in use.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return false;
    }

    return true;
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    courseId: "",
    batchId: "",
    divisionId: "",
  });

  const handleSave = async () => {
    setErrors(() => ({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "",
      courseId: "",
      batchId: "",
      divisionId: "",
    }));

    const validation = studentSchema.safeParse(studentDetails);

    if (!validation.success) {
      const errorArray = validation.error.errors;
      console.log({ errorArray });

      for (let error of errorArray) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [error.path[0]]: error.message,
        }));
      }

      toast({
        title: "Uh oh! Something went Wrong",
        description: "Please Fill All Required Details.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    const isValid = await isRollNumberValid();

    if (!isValid) return;

    const res = await AdminServices.saveStudent({
      id: currentStudent?.id,
      ...studentDetails,
    });

    if (!res.data.status) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: res.data.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    toast({
      title: "Student Saved",
      description: currentStudent?.id
        ? "This student has been updated successfully."
        : "This new student has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    router.back();
  };

  const getAllBatches = async () => {
    const res = await AdminServices.getAllBatches();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setBatches(res.data.data.batches);
  };

  const getAllCourses = async () => {
    const res = await AdminServices.getAllCourses();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCourses(res.data.data.courses);
  };

  const calculateRoleNumber = async (divisionId: number | null) => {
    if (!studentDetails.batchId) return;
    let rollNumber = "";

    if (divisionId) {
      const res = await AdminServices.getAllStudents({
        divisionId: divisionId,
        batchId: studentDetails.batchId,
      });

      const batch = batches.find((b) => b.id === studentDetails.batchId);
      const division = batch?.divisions.find((d) => d.id === divisionId);

      if (!batch || !division) return;

      const studentList = res.data.data.students;
      console.log({ studentList });

      let studentNumber;

      if (studentList.length === 0) {
        studentNumber = studentList.length + 1;
      } else {
        let lastStudentRollNumber: string = studentList[studentList.length - 1].rollNumber;
        let finalLastStudentRollNumber: string = lastStudentRollNumber
          .substring(lastStudentRollNumber.length - 4)
          .split("")
          .filter((n) => n !== "0")
          .join("");

        studentNumber = parseInt(finalLastStudentRollNumber) + 1;
      }

      let batchYear = batch.year.toString();
      batchYear = batchYear.substring(batchYear.length - 2);

      rollNumber = batchYear + fillZeros(batch.courseId, 3) + division.name + fillZeros(studentNumber, 4);
    }

    setStudentDetails({
      ...studentDetails,
      divisionId,
      rollNumber,
    });
  };

  const fillZeros = (n: number, max: number) => {
    let number = n.toString();
    let len = number.length;
    let zeros = max - len;
    let zeroString = "";

    for (let i = 0; i < zeros; i++) {
      zeroString += "0";
    }
    return zeroString + number;
  };

  useEffect(() => {
    getAllBatches();
    getAllCourses();
  }, []);

  return (
    <div className="h-full w-full px-40">
      <div className="flex justify-center w-full items-center mt-32 mb-10 gap-3 h-fit">
        <GoBack />
        <LibraryBigIcon height={50} width={50} />
        <h1 className="text-4xl font-extrabold">
          {currentStudent?.id ? "Edit" : "Add New"} Student{" "}
          {currentStudent && " - " + (studentDetails.firstName + " " + studentDetails.lastName)}
        </h1>
      </div>

      <div className="flex flex-col gap-x-2 gap-y-10">
        <div className="flex flex-row gap-4 items-end justify-end">
          <Switch
            checked={studentDetails.status}
            onCheckedChange={(val) => setStudentDetails({ ...studentDetails, status: val })}
          />
        </div>

        {/* ---------------------------------------------------------------------------- */}
        <div className="flex flex-row gap-4 justify-center items-center pb-10">
          <UploadProfileCloudinary
            link={studentDetails.profileImg}
            divStyle="h-48 w-48 border rounded-full overflow-hidden p-2 border-2 border-dashed border-primary"
            setLink={(link) => setStudentDetails({ ...studentDetails, profileImg: link })}
          />
        </div>

        <Separator />

        <h2 className="text-3xl font-bold">General Information</h2>
        {/* ---------------------------------------------------------------------------- */}
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">First Name</Label>
            <ErrorLabel errorMessage={errors.firstName} />
            <Input
              type="text"
              autoComplete="off"
              value={studentDetails.firstName}
              onChange={(e) => setStudentDetails({ ...studentDetails, firstName: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Last Name</Label>
            <ErrorLabel errorMessage={errors.lastName} />
            <Input
              type="text"
              autoComplete="off"
              value={studentDetails.lastName}
              onChange={(e) => setStudentDetails({ ...studentDetails, lastName: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Email</Label>
            <ErrorLabel errorMessage={errors.email} />
            <Input
              autoComplete="off"
              value={studentDetails.email || ""}
              onChange={(e) =>
                setStudentDetails({
                  ...studentDetails,
                  email: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Password</Label>
            <ErrorLabel errorMessage={errors.password} />
            <Input
              type="password"
              autoComplete="off"
              value={studentDetails.password || ""}
              onChange={(e) =>
                setStudentDetails({
                  ...studentDetails,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Gender</Label>
            <ErrorLabel errorMessage={errors.gender} />
            <MySelect
              options={["Male", "Female", "Other"].map((gender) => ({
                label: gender,
                value: gender.toLowerCase(),
              }))}
              onSelect={(val) => setStudentDetails({ ...studentDetails, gender: val || "" })}
              selectedItem={studentDetails.gender || undefined}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Roll Number &#40;Automatically Generated On Selecting Division&#41;
            </Label>
            <Input
              autoComplete="off"
              value={studentDetails.rollNumber || ""}
              onChange={(e) =>
                setStudentDetails({
                  ...studentDetails,
                  rollNumber: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Course</Label>
            <ErrorLabel errorMessage={errors.courseId} />
            <Combobox
              clearable
              className="w-full"
              options={courses.map((course) => ({
                label: course.name,
                value: course.id.toString(),
              }))}
              value={studentDetails.courseId?.toString() || ""}
              onSelect={(val) =>
                setStudentDetails({
                  ...studentDetails,
                  courseId: val ? parseInt(val) : null,
                  batchId: null,
                  divisionId: null,
                })
              }
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Batch</Label>
            <ErrorLabel errorMessage={errors.batchId} />
            <Combobox
              disabled={studentDetails.courseId ? false : true}
              clearable
              className="w-full"
              options={batches
                .filter((b) => b.courseId === studentDetails.courseId)
                .map((b) => ({
                  label: `${b.course.name} (${b.year})`,
                  value: b.id.toString(),
                }))}
              value={studentDetails.batchId?.toString() || ""}
              onSelect={(val) =>
                setStudentDetails({
                  ...studentDetails,
                  batchId: val ? parseInt(val) : null,
                  divisionId: null,
                })
              }
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Division</Label>
            <Combobox
              disabled={studentDetails.batchId ? false : true}
              clearable
              className="w-full"
              options={
                batches
                  .find((b) => b.id === studentDetails.batchId)
                  ?.divisions.map((d) => ({
                    label: `Division ${d.name}`,
                    value: d.id.toString(),
                  })) || []
              }
              value={studentDetails.divisionId?.toString() || ""}
              onSelect={async (val) => {
                await calculateRoleNumber(val ? parseInt(val) : null);
              }}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Address</Label>
            <Textarea
              className="resize-none h-48"
              value={studentDetails.address}
              onChange={(e) =>
                setStudentDetails({
                  ...studentDetails,
                  address: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}
        <Separator />

        <h2 className="text-3xl font-bold">Student Documents</h2>
        <div className="grid grid-cols-3">
          {studentDetails.uploadedStudentDocuments
            .filter((d) => d.status || d.url)
            .map((d) => (
              <div className="h-fit p-10 border flex flex-col items-center justify-center gap-5" key={d.documentId}>
                <p>{d.name}</p>
                <embed
                  src={
                    d.url
                      ? d.url
                      : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                  }
                  className="h-60 border rounded"
                />
                <div className="w-full px-6 flex gap-2 justify-center">
                  {d.status && (
                    <div className="w-full">
                      <UploadCloudinary setLink={(link) => setLink(link, d.documentId)} />
                    </div>
                  )}
                  <div>
                    <Button onClick={() => setLink("", d.documentId)}>
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 py-20">
        <Button className="w-96" variant={"outline"} onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="w-96" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default StudentForm;
