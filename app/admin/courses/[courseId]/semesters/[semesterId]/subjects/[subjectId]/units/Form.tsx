"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Unit } from "@/app/interfaces/UnitInterface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { MySelect } from "@/app/my-components/MySelect";
import { Switch } from "@/components/ui/switch";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { unitSchema } from "@/app/validationSchemas";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  children: React.ReactNode;
  currentUnit?: Unit;
  subjectId: number;

  courseName: string;
  semNumber: number;
  subjectName: string;

  refetch: () => void;
}

const Form = ({ children, currentUnit, subjectId, refetch, courseName, semNumber, subjectName }: Props) => {
  const [open, setOpen] = useState(false);

  const [unitDetails, setUnitDetails] = useState({
    name: "",
    number: null as number | null,
    description: "",
    status: true,
  });

  useEffect(() => {
    if (currentUnit) {
      setUnitDetails({
        name: currentUnit.name,
        number: currentUnit.number,
        description: currentUnit.description || "",
        status: currentUnit.status === true || currentUnit.status === false ? currentUnit.status : true,
      });
    }
  }, [currentUnit]);

  const [errors, setErrors] = useState({
    name: "",
    number: "",
  });

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
      number: "",
    }));

    const validation = unitSchema.safeParse(unitDetails);

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

    const res = await AdminServices.saveUnit({ id: currentUnit?.id, ...unitDetails, subjectId: subjectId });

    if (!res.data.status) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: res.data.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    toast({
      title: "Unit Saved",
      description: currentUnit?.id
        ? "This unit has been updated successfully."
        : "This new unit has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    refetch();
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setUnitDetails({
      name: "",
      number: null as number | null,
      description: "",
      status: true,
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <SheetHeader className="mt-10">
          {currentUnit ? <SheetTitle>{currentUnit.name}</SheetTitle> : <SheetTitle>Add New Unit</SheetTitle>}
          <SheetDescription>
            This unit will be {currentUnit ? "updated" : "added"} to <span className="font-bold">{subjectName}</span>{" "}
            &#40;Semester {semNumber} - {courseName}&#41;
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 items-end mt-10">
          <div className="min-w-14 flex flex-col items-start gap-3">
            <Switch
              checked={unitDetails?.status}
              onCheckedChange={(val) => setUnitDetails({ ...unitDetails, status: val })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Unit Number</Label>
            <ErrorLabel errorMessage={errors.number} />
            <Input
              type="number"
              autoComplete="off"
              onChange={(e) => setUnitDetails({ ...unitDetails, number: parseInt(e.target.value) })}
              value={unitDetails.number?.toString()}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Unit Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => setUnitDetails({ ...unitDetails, name: e.target.value })}
              value={unitDetails.name}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Unit Description</Label>
            <Textarea
              className="resize-none h-60"
              autoComplete="off"
              onChange={(e) => setUnitDetails({ ...unitDetails, description: e.target.value })}
              value={unitDetails.description}
            />
          </div>

          <div className="w-full flex flex-col gap-2 mt-5">
            <Button onClick={handleSave}>Save</Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpen(false);
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
