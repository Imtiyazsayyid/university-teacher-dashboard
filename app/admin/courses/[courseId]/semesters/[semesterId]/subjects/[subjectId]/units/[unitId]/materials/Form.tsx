"use client";

import AdminServices from "@/app/Services/AdminServices";
import { UnitMaterial } from "@/app/interfaces/UnitMaterialInterface";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import UploadCloudinary from "@/app/my-components/UploadCloudinary";
import UploadPlaceholderImage from "@/app/my-components/UploadPlaceholderImage";
import EmbeddedYoutubeVideo from "@/app/my-components/EmbeddedYoutubeVideo";
import { unitMaterialSchema } from "@/app/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  currentUnitMaterial?: UnitMaterial;
  subjectId: number;
  unitId: number;
  unitNumber: number;

  courseName: string;
  semNumber: number;
  subjectName: string;

  refetch: () => void;
}

const Form = ({
  children,
  currentUnitMaterial,
  subjectId,
  unitId,
  refetch,
  courseName,
  semNumber,
  subjectName,
  unitNumber,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [unitMaterialDetails, setUnitMaterialDetails] = useState({
    name: "",
    link: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (currentUnitMaterial) {
      setUnitMaterialDetails({
        name: currentUnitMaterial.name,
        link: currentUnitMaterial.link,
        description: currentUnitMaterial.description || "",
        status:
          currentUnitMaterial.status === true || currentUnitMaterial.status === false
            ? currentUnitMaterial.status
            : true,
      });
    }
  }, [currentUnitMaterial]);

  const [errors, setErrors] = useState({
    name: "",
    link: "",
  });

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
      link: "",
    }));

    const validation = unitMaterialSchema.safeParse(unitMaterialDetails);

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

    const res = await AdminServices.saveUnitMaterial({
      id: currentUnitMaterial?.id,
      ...unitMaterialDetails,
      unitId: unitId,
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
      title: "Unit Material Saved",
      description: currentUnitMaterial?.id
        ? "This unit material has been updated successfully."
        : "This new unit material has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    refetch();
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setUnitMaterialDetails({
      name: "",
      link: "",
      description: "",
      status: true,
    });
  };

  return (
    <Sheet
      modal={false}
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="bg-slate-50 dark:bg-[#111] h-full overflow-hidden overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <SheetHeader className="mt-10">
          {currentUnitMaterial ? (
            <SheetTitle>{currentUnitMaterial.name}</SheetTitle>
          ) : (
            <SheetTitle>Add New Unit Material</SheetTitle>
          )}
          <SheetDescription>
            This unit material will be {currentUnitMaterial ? "updated" : "added"} to
            <span className="font-bold"> Unit {unitNumber}</span> from <span className="font-bold">{subjectName}</span>{" "}
            &#40;Semester {semNumber} - {courseName}&#41;
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 items-end mt-10">
          <div className="min-w-14 flex flex-col items-start gap-3">
            <Switch
              checked={unitMaterialDetails?.status}
              onCheckedChange={(val) => setUnitMaterialDetails({ ...unitMaterialDetails, status: val })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Unit Material Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              type="text"
              autoComplete="off"
              onChange={(e) => setUnitMaterialDetails({ ...unitMaterialDetails, name: e.target.value })}
              value={unitMaterialDetails.name}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Unit Material Description</Label>
            <Textarea
              className="resize-none h-60"
              autoComplete="off"
              onChange={(e) => setUnitMaterialDetails({ ...unitMaterialDetails, description: e.target.value })}
              value={unitMaterialDetails.description}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <ErrorLabel errorMessage={errors.link} />
            {unitMaterialDetails.link && (
              <div className="max-h-72 bg-white dark:bg-[#111]">
                {unitMaterialDetails.link.includes("youtube") ? (
                  <EmbeddedYoutubeVideo link={unitMaterialDetails.link} />
                ) : (
                  <UploadPlaceholderImage
                    file={{ uri: unitMaterialDetails.link, fileName: unitMaterialDetails.name }}
                  />
                )}
              </div>
            )}

            <div>
              <UploadCloudinary setLink={(link) => setUnitMaterialDetails({ ...unitMaterialDetails, link })} />
            </div>
            <div className="w-full flex justify-center flex-col my-2">
              <p className="text-center text-stone-500 mb-0 pb-1">OR</p>
              <p className="text-xs text-gray-700 dark:text-gray-500 text-center">Paste A Link Below.</p>
            </div>
            <div className="mt-1">
              <Input
                type="text"
                autoComplete="off"
                onChange={(e) => setUnitMaterialDetails({ ...unitMaterialDetails, link: e.target.value })}
                value={unitMaterialDetails.link}
              />
              <Label className="text-xs text-gray-700 dark:text-gray-500">Video Links Should Be Pasted Here.</Label>
            </div>
          </div>

          <div className="w-full flex flex-row gap-2 mt-10">
            <Button
              variant={"outline"}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Form;
