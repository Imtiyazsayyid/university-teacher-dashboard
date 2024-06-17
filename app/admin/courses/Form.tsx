"use client";
import AdminServices from "@/app/Services/AdminServices";
import { Course } from "@/app/interfaces/CourseInterface";
import { StudentDocument } from "@/app/interfaces/StudentDocumentInterface";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import GoBack from "@/app/my-components/GoBack";
import { courseSchema } from "@/app/validationSchemas";
import MultipleSelector from "@/components/ui/MultipleSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon, LibraryBigIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  currentCourse?: Course;
}

const CourseForm = ({ currentCourse }: Props) => {
  const router = useRouter();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    abbr: "",
    duration: null as number | null,
    description: "",

    programOutcome: "",
    departmentalStrength: "",
    aboutFacility: "",
    eligibilty: "",
    significance: "",
    vision: "",
    mission: "",
    technicalActivities: "",

    documents: [] as number[],
    status: true,
  });

  useEffect(() => {
    if (currentCourse) {
      setCourseDetails({
        name: currentCourse?.name || "",
        abbr: currentCourse?.abbr || "",
        duration: currentCourse?.duration || 0,
        description: currentCourse?.description || "",
        programOutcome: currentCourse?.programOutcome || "",
        departmentalStrength: currentCourse?.departmentalStrength || "",
        aboutFacility: currentCourse?.aboutFacility || "",
        eligibilty: currentCourse?.eligibilty || "",
        significance: currentCourse?.significance || "",
        vision: currentCourse?.vision || "",
        mission: currentCourse?.mission || "",
        technicalActivities: currentCourse?.technicalActivities || "",
        documents: currentCourse?.documents.map((d) => d.documentId) || [],
        status: currentCourse?.status ? true : false,
      });
    }
  }, [currentCourse]);

  const [errors, setErrors] = useState({
    name: "",
    abbr: "",
    duration: "",
  });

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
      abbr: "",
      duration: "",
    }));

    const validation = courseSchema.safeParse(courseDetails);

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

    const res = await AdminServices.saveCourse({ id: currentCourse?.id, ...courseDetails });

    if (!res.data.status) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: res.data.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    toast({
      title: "Course Saved",
      description: currentCourse?.id
        ? "This course has been updated successfully."
        : "This new course has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    router.back();
  };

  const getAllStudentDocuments = async () => {
    const res = await AdminServices.getAllStudentDocuments();

    if (res.data.status) {
      setDocuments(res.data.data.studentDocuments);
    }
  };

  useEffect(() => {
    getAllStudentDocuments();
  }, []);

  return (
    <div className="h-full w-full px-40">
      <div className="flex justify-center w-full items-center mt-32 mb-10 gap-3 h-fit">
        <GoBack />
        <LibraryBigIcon height={50} width={50} />
        <h1 className="text-4xl font-extrabold">
          {currentCourse?.id ? "Edit" : "Add New"} Course {currentCourse && " - " + courseDetails.name}
        </h1>
      </div>

      <div className="flex flex-col gap-x-2 gap-y-10">
        <div className="flex flex-row gap-4 items-end justify-end">
          <Switch
            checked={courseDetails.status}
            onCheckedChange={(val) => setCourseDetails({ ...courseDetails, status: val })}
          />
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              type="text"
              autoComplete="off"
              value={courseDetails.name}
              onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Abbreviation</Label>
            <ErrorLabel errorMessage={errors.abbr} />
            <Input
              type="text"
              autoComplete="off"
              value={courseDetails.abbr}
              onChange={(e) => setCourseDetails({ ...courseDetails, abbr: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Duration &#40;years&#41;</Label>
            <ErrorLabel errorMessage={errors.duration} />
            <Input
              type="number"
              autoComplete="off"
              value={courseDetails.duration || ""}
              onChange={(e) => setCourseDetails({ ...courseDetails, duration: parseInt(e.target.value) })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Student Documents</Label>
            <MultipleSelector
              // emptyIndicator={
              //   <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>
              // }
              value={documents
                .filter((d) => courseDetails.documents.includes(d.id))
                .map((d) => ({
                  value: d.id.toString(),
                  label: `${d.name}`,
                }))}
              options={documents.map((d) => ({
                value: d.id.toString(),
                label: `${d.name}`,
              }))}
              onChange={(val) =>
                setCourseDetails({
                  ...courseDetails,
                  documents: val ? val.map((sem) => parseInt(sem.value)) : [],
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Description</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.description}
              onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Program Outcome</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.programOutcome}
              onChange={(e) => setCourseDetails({ ...courseDetails, programOutcome: e.target.value })}
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Departmental Strength</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.departmentalStrength}
              onChange={(e) => setCourseDetails({ ...courseDetails, departmentalStrength: e.target.value })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">About Facility</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.aboutFacility}
              onChange={(e) => setCourseDetails({ ...courseDetails, aboutFacility: e.target.value })}
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Eligibilty</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.eligibilty}
              onChange={(e) => setCourseDetails({ ...courseDetails, eligibilty: e.target.value })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Significance</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.significance}
              onChange={(e) => setCourseDetails({ ...courseDetails, significance: e.target.value })}
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Vision</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.vision}
              onChange={(e) => setCourseDetails({ ...courseDetails, vision: e.target.value })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Mission</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.mission}
              onChange={(e) => setCourseDetails({ ...courseDetails, mission: e.target.value })}
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Technical Activities</Label>
            <Textarea
              className="resize-none h-48"
              value={courseDetails.technicalActivities}
              onChange={(e) => setCourseDetails({ ...courseDetails, technicalActivities: e.target.value })}
            />
          </div>
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

export default CourseForm;
