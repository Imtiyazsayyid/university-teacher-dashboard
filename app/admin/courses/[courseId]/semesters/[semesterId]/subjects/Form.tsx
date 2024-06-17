"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { MySelect } from "@/app/my-components/MySelect";
import { Switch } from "@/components/ui/switch";
import AdminServices from "@/app/Services/AdminServices";
import { SubjectType } from "@/app/interfaces/SubjectTypeInterface";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { subjectSchema } from "@/app/validationSchemas";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
  currentSubject?: Subject;
  semesterId: number;

  courseName: string;
  semNumber: number;

  refetch: () => void;
}

const Form = ({ children, currentSubject, semesterId, refetch, courseName, semNumber }: Props) => {
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>();
  const [open, setOpen] = useState(false);

  const [subjectDetails, setSubjectDetails] = useState({
    name: "",
    abbr: "",
    code: "",
    credits: null as number | null,
    subjectTypeId: undefined as number | undefined,
    status: true,
  });

  useEffect(() => {
    if (currentSubject) {
      setSubjectDetails({
        name: currentSubject.name,
        abbr: currentSubject.abbr,
        code: currentSubject.code,
        credits: currentSubject.credits,
        subjectTypeId: currentSubject.subjectTypeId,
        status: currentSubject.status === true || currentSubject.status === false ? currentSubject.status : true,
      });
    }
  }, [currentSubject]);

  const [errors, setErrors] = useState({
    name: "",
    abbr: "",
    credits: "",
    code: "",
    subjectTypeId: "",
  });

  const getSubjectTypes = async () => {
    const res = await AdminServices.getAllSubjectTypes();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setSubjectTypes(res.data.data.subjectTypes);
  };

  useEffect(() => {
    getSubjectTypes();
  }, []);

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
      abbr: "",
      credits: "",
      code: "",
      subjectTypeId: "",
    }));

    const validation = subjectSchema.safeParse(subjectDetails);

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

    const res = await AdminServices.saveSubject({ id: currentSubject?.id, ...subjectDetails, semesterId: semesterId });

    if (!res.data.status) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: res.data.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    toast({
      title: "Subject Saved",
      description: currentSubject?.id
        ? "This subject has been updated successfully."
        : "This new subject has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    refetch();
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSubjectDetails({
      name: "",
      abbr: "",
      code: "",
      credits: null,
      subjectTypeId: undefined,
      status: true,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <SheetHeader className="mt-10">
          {currentSubject ? <SheetTitle>{currentSubject.name}</SheetTitle> : <SheetTitle>Add New Subject</SheetTitle>}
          <SheetDescription>
            This subject will be {currentSubject ? "updated" : "added"} to Semester {semNumber} for {courseName}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 items-end mt-10">
          <div className="min-w-14 flex flex-col items-start gap-3">
            <Switch
              checked={subjectDetails?.status}
              onCheckedChange={(val) => setSubjectDetails({ ...subjectDetails, status: val })}
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Subject Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => setSubjectDetails({ ...subjectDetails, name: e.target.value })}
              value={subjectDetails.name}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Subject Abbreviation</Label>
            <ErrorLabel errorMessage={errors.abbr} />
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => setSubjectDetails({ ...subjectDetails, abbr: e.target.value })}
              value={subjectDetails.abbr}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Subject Code</Label>
            <ErrorLabel errorMessage={errors.code} />
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => setSubjectDetails({ ...subjectDetails, code: e.target.value })}
              value={subjectDetails.code}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Credits</Label>
            <ErrorLabel errorMessage={errors.credits} />
            <Input
              type="number"
              autoComplete="off"
              onChange={(e) => setSubjectDetails({ ...subjectDetails, credits: parseInt(e.target.value) })}
              value={subjectDetails.credits?.toString()}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Subject Type</Label>
            <ErrorLabel errorMessage={errors.subjectTypeId} />
            <MySelect
              options={subjectTypes?.map((type) => ({ value: type.id, label: type.name }))}
              selectedItem={subjectDetails.subjectTypeId}
              onSelect={(val) => {
                setSubjectDetails({ ...subjectDetails, subjectTypeId: val ? parseInt(val) : undefined });
              }}
            />
          </div>

          <div className="w-full flex flex-col gap-2 mt-10">
            <Button onClick={handleSave}>Save</Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Form;
