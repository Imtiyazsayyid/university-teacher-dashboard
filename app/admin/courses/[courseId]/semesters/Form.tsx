import AdminServices from "@/app/Services/AdminServices";
import { Semester } from "@/app/interfaces/SemesterInterface";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { semesterSchema } from "@/app/validationSchemas";
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

interface Props {
  semesterId?: number;

  semNumber?: number;
  duration?: number;
  status?: boolean;

  courseId: number;
  children: React.ReactNode;
  courseName: string;
  refetch: () => void;
}

export function Form({ semesterId, children, courseName, courseId, refetch, semNumber, duration, status }: Props) {
  const [isOpen, setOpen] = useState(false);

  const [semester, setSemester] = useState({
    semNumber: null as number | null,
    duration: null as number | null,
    status: true,
  });

  const [errors, setErrors] = useState({
    semNumber: "",
    duration: "",
  });

  useEffect(() => {
    setSemester({
      semNumber: semNumber || null,
      duration: duration || null,
      status: status === true || status === false ? status : true,
    });
  }, [semNumber, duration, status]);

  const handleSave = async () => {
    setErrors(() => ({
      semNumber: "",
      duration: "",
    }));

    const validation = semesterSchema.safeParse(semester);

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

    const res = await AdminServices.saveSemester({ ...semester, courseId: courseId, id: semesterId });

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
      title: "Semester Saved",
      description: semesterId
        ? "This semester has been updated successfully."
        : "This new semester has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    setOpen(false);

    setSemester({
      semNumber: null,
      duration: null,
      status: true,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
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
          <DialogTitle>{semesterId ? "Edit" : "Add"} Semester</DialogTitle>
          <DialogDescription>{courseName}</DialogDescription>
        </DialogHeader>
        <div className="min-w-14 flex flex-col items-start gap-3">
          <Switch
            checked={semester.status}
            onCheckedChange={(val) => setSemester({ ...semester, status: val })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <div className="flex gap-3 mt-5 items-end">
          <div className="w-full flex flex-col gap-3">
            <Label>Number</Label>
            <ErrorLabel errorMessage={errors.semNumber} />
            <Input
              type="number"
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={semester.semNumber || ""}
              onChange={(e) => setSemester({ ...semester, semNumber: parseInt(e.target.value) })}
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <Label>Duration &#40;Months&#41;</Label>
            <ErrorLabel errorMessage={errors.duration} />
            <Input
              type="number"
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={semester.duration || ""}
              onChange={(e) => setSemester({ ...semester, duration: parseInt(e.target.value) })}
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
