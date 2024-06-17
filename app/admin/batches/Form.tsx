import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Batch } from "@/app/interfaces/BatchInterface";
import { Course } from "@/app/interfaces/CourseInterface";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { MySelect } from "@/app/my-components/MySelect";
import { batchSchema } from "@/app/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import { Semester } from "@/app/interfaces/SemesterInterface";
import MultipleSelector from "@/components/ui/MultipleSelector";

interface Props {
  batchId?: number;

  year?: number;
  status?: boolean;
  courseId?: number;
  accessibleSemesterIds?: number[];

  children: React.ReactNode;
  refetch: () => void;
}

export function Form({
  batchId,
  children,
  courseId,
  refetch,
  year,
  accessibleSemesterIds,
  status,
}: Props) {
  const [isOpen, setOpen] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [batch, setBatch] = useState({
    courseId: null as number | null,
    accessibleSemesterIds: [] as number[],
    year: moment().year() as number,
    status: true,
  });

  const [errors, setErrors] = useState({
    year: "",
    courseId: "",
  });

  useEffect(() => {
    setBatch({
      courseId: courseId || null,
      year: year || moment().year(),
      accessibleSemesterIds: accessibleSemesterIds || [],
      status: status === true || status === false ? status : true,
    });
  }, [year, status, accessibleSemesterIds, courseId]);

  const handleSave = async () => {
    setErrors(() => ({
      year: "",
      courseId: "",
    }));

    const validation = batchSchema.safeParse(batch);

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

    const res = await AdminServices.saveBatch({ ...batch, id: batchId });

    if (!res.data.status) {
      toast({
        title: "Uh oh! Something went Wrong",
        description: res.data.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });
      return;
    }

    refetch();

    toast({
      title: "Batch Saved",
      description: batchId
        ? "This batch has been updated successfully."
        : "This new batch has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    setOpen(false);

    setBatch({
      year: moment().year(),
      accessibleSemesterIds: [],
      courseId: null,
      status: true,
    });
  };

  const getAllCourses = async () => {
    const res = await AdminServices.getAllCourses();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCourses(res.data.data.courses);
  };

  const getCourseWiseSemesters = async (courseId: number | undefined) => {
    if (!courseId) {
      return;
    }
    try {
      const res = await AdminServices.getAllSemesters({
        courseId: courseId ? courseId : batch.courseId,
      });

      if (!res.data.status) {
        toast({
          title: "Uh oh! Something went Wrong",
          description: res.data.message,
          action: <AlertCircleIcon className="text-red-500" />,
        });
        return;
      }

      setSemesters(res.data.data.semesters);
    } catch (error) {
      console.log("Error in getCourseWiseSemesters");
    }
  };

  const handleDiaglogOpen = (val: boolean) => {
    setOpen(val);
    batch.courseId && getCourseWiseSemesters(batch.courseId);
    getAllCourses();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDiaglogOpen}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>{}</DialogDescription>
        </DialogHeader>
        <div className="min-w-14 flex flex-col items-start gap-3">
          <Switch
            checked={batch.status}
            onCheckedChange={(val) => setBatch({ ...batch, status: val })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <div className="flex gap-3 mt-5 items-end">
          <div className="w-full flex flex-col gap-3">
            <Label>Course</Label>
            <ErrorLabel errorMessage={errors.courseId} />
            <MySelect
              options={courses.map((course) => ({
                value: course.id,
                label: course.name,
              }))}
              selectedItem={batch.courseId || ""}
              onSelect={(val) => {
                setBatch({ ...batch, courseId: val ? parseInt(val) : null });
                getCourseWiseSemesters(val ? parseInt(val) : undefined);
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5 items-end">
          <div className="w-full flex flex-col gap-3">
            <Label>Semesters</Label>
            <MultipleSelector
              // emptyIndicator={
              //   <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>
              // }
              value={semesters
                .filter((sem) => batch.accessibleSemesterIds.includes(sem.id))
                .map((sem) => ({
                  value: sem.id.toString(),
                  label: `Semester ${sem.semNumber}`,
                }))}
              options={semesters.map((sem) => ({
                value: sem.id.toString(),
                label: `Semester ${sem.semNumber}`,
              }))}
              onChange={(val) =>
                setBatch({
                  ...batch,
                  accessibleSemesterIds: val
                    ? val.map((sem) => parseInt(sem.value))
                    : [],
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5 items-end">
          <div className="w-full flex flex-col gap-3">
            <Label>Year</Label>
            <ErrorLabel errorMessage={errors.year} />
            <Input
              min={2020}
              max={2100}
              type="number"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => e.preventDefault()}
              value={batch.year || undefined}
              onChange={(e) =>
                setBatch({ ...batch, year: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <Button
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
