"use client";
import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Teacher, TeacherRole } from "@/app/interfaces/TeacherInterface";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import GoBack from "@/app/my-components/GoBack";
import { MySelect } from "@/app/my-components/MySelect";
import UploadProfileCloudinary from "@/app/my-components/UploadProfileCloudinary";
import { teacherSchema } from "@/app/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon, LibraryBigIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  currentTeacher?: Teacher;
}

const TeacherForm = ({ currentTeacher }: Props) => {
  const router = useRouter();
  const [teacherRoles, setTeacherRoles] = useState<TeacherRole[]>([]);
  const [teacherDetails, setTeacherDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    profileImg: "",
    address: "",
    roleId: null as number | null,
    qualification: "",
    experience: null as number | null,
    about: "",
    awardsAndRecognition: "",
    guestSpeakerAndResourcePerson: "",
    participationInCWTP: "",
    researchPublications: "",
    certificationCourses: "",
    booksOrChapter: "",
    professionalMemberships: "",
    status: true,
  });

  useEffect(() => {
    if (currentTeacher) {
      setTeacherDetails({
        firstName: currentTeacher?.firstName || "",
        lastName: currentTeacher?.lastName || "",
        email: currentTeacher?.email || "",
        password: currentTeacher?.password || "",
        gender: currentTeacher?.gender || "",
        profileImg: currentTeacher?.profileImg || "",
        address: currentTeacher?.address || "",
        roleId: currentTeacher?.roleId || null,
        qualification: currentTeacher?.qualification || "",
        experience: currentTeacher?.experience || null,
        about: currentTeacher?.about || "",
        awardsAndRecognition: currentTeacher?.awardsAndRecognition || "",
        guestSpeakerAndResourcePerson: currentTeacher?.guestSpeakerAndResourcePerson || "",
        participationInCWTP: currentTeacher?.participationInCWTP || "",
        researchPublications: currentTeacher?.researchPublications || "",
        certificationCourses: currentTeacher?.certificationCourses || "",
        booksOrChapter: currentTeacher?.booksOrChapter || "",
        professionalMemberships: currentTeacher?.professionalMemberships || "",
        status: currentTeacher?.status ? true : false,
      });
    }
  }, [currentTeacher]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    roleId: "",
  });

  const handleSave = async () => {
    setErrors(() => ({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "",
      roleId: "",
    }));

    const validation = teacherSchema.safeParse(teacherDetails);

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

    const res = await AdminServices.saveTeacher({
      id: currentTeacher?.id,
      ...teacherDetails,
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
      title: "Teacher Saved",
      description: currentTeacher?.id
        ? "This teacher has been updated successfully."
        : "This new teacher has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    router.back();
  };

  const getAllTeacherRoles = async () => {
    try {
      const res = await AdminServices.getAllTeacherRoles();

      if (res.data.status) {
        setTeacherRoles(res.data.data.teacherRoles);
      } else {
        StandardErrorToast();
      }
    } catch (error) {
      StandardErrorToast();
      console.log({ error });
    }
  };

  useEffect(() => {
    getAllTeacherRoles();
  }, []);

  return (
    <div className="h-full w-full px-40">
      <div className="flex justify-center w-full items-center mt-32 mb-10 gap-3 h-fit">
        <GoBack />
        <LibraryBigIcon height={50} width={50} />
        <h1 className="text-4xl font-extrabold">
          {currentTeacher?.id ? "Edit" : "Add New"} Teacher{" "}
          {currentTeacher && " - " + (teacherDetails.firstName + " " + teacherDetails.lastName)}
        </h1>
      </div>

      <div className="flex flex-col gap-x-2 gap-y-10">
        <div className="flex flex-row gap-4 items-end justify-end">
          <Switch
            checked={teacherDetails.status}
            onCheckedChange={(val) => setTeacherDetails({ ...teacherDetails, status: val })}
          />
        </div>

        {/* ---------------------------------------------------------------------------- */}
        <div className="flex flex-row gap-4 justify-center items-center pb-10">
          <UploadProfileCloudinary
            link={teacherDetails.profileImg}
            divStyle="h-48 w-48 border rounded-full overflow-hidden p-2 border-2 border-dashed border-primary"
            setLink={(link) => setTeacherDetails({ ...teacherDetails, profileImg: link })}
          />
        </div>

        {/* ---------------------------------------------------------------------------- */}
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">First Name</Label>
            <ErrorLabel errorMessage={errors.firstName} />
            <Input
              type="text"
              autoComplete="off"
              value={teacherDetails.firstName}
              onChange={(e) => setTeacherDetails({ ...teacherDetails, firstName: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Last Name</Label>
            <ErrorLabel errorMessage={errors.lastName} />
            <Input
              type="text"
              autoComplete="off"
              value={teacherDetails.lastName}
              onChange={(e) => setTeacherDetails({ ...teacherDetails, lastName: e.target.value })}
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Email</Label>
            <ErrorLabel errorMessage={errors.email} />
            <Input
              autoComplete="off"
              value={teacherDetails.email || ""}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
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
              value={teacherDetails.password || ""}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Role</Label>
            <ErrorLabel errorMessage={errors.roleId} />
            <MySelect
              options={teacherRoles.map((tr) => ({ label: tr.name, value: tr.id }))}
              onSelect={(val) =>
                setTeacherDetails({ ...teacherDetails, roleId: val ? parseInt(val) : null })
              }
              selectedItem={teacherDetails.roleId || undefined}
            />
          </div>

          <div className="w-full flex gap-2 items-end">
            <div className="flex-col flex gap-2 w-1/2">
              <Label className="text-xs text-gray-700 dark:text-gray-500">Gender</Label>
              <ErrorLabel errorMessage={errors.gender} />
              <MySelect
                options={["Male", "Female", "Other"].map((gender) => ({
                  label: gender,
                  value: gender.toLowerCase(),
                }))}
                onSelect={(val) => setTeacherDetails({ ...teacherDetails, gender: val || "" })}
                selectedItem={teacherDetails.gender || undefined}
              />
            </div>
            <div className="flex-col flex gap-2 w-1/2">
              <Label className="text-xs text-gray-700 dark:text-gray-500">
                Experience &#40;years&#41;
              </Label>
              <Input
                autoComplete="off"
                type="number"
                value={teacherDetails.experience || ""}
                onChange={(e) =>
                  setTeacherDetails({
                    ...teacherDetails,
                    experience: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">About</Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.about}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  about: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Address</Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.address}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Qualification</Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.qualification}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  qualification: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Awards And Recognition
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.awardsAndRecognition}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  awardsAndRecognition: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Guest Speaker and Resource Person
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.guestSpeakerAndResourcePerson}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  guestSpeakerAndResourcePerson: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Participation in Conferences, Workshops and Training Programs
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.participationInCWTP}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  participationInCWTP: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Research Publications
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.researchPublications}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  researchPublications: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Certification Courses
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.certificationCourses}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  certificationCourses: e.target.value,
                })
              }
            />
          </div>
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Books or Chapters</Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.booksOrChapter}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  booksOrChapter: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}

        <div className="flex flex-row gap-4">
          <div className="flex-col flex gap-2 w-1/2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">
              Professional Memberships
            </Label>
            <Textarea
              className="resize-none h-48"
              value={teacherDetails.professionalMemberships}
              onChange={(e) =>
                setTeacherDetails({
                  ...teacherDetails,
                  professionalMemberships: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------------------- */}
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

export default TeacherForm;
