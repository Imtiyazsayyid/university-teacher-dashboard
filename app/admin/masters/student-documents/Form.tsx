import AdminServices from "@/app/Services/AdminServices";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { studentDocumentSchema } from "@/app/validationSchemas";
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
  studentDocumentId?: number;
  name?: string;
  status?: boolean;
  children: React.ReactNode;
  refetch: () => void;
}

export function Form({ studentDocumentId, name, children, refetch, status }: Props) {
  const [isOpen, setOpen] = useState(false);

  const [studentDocument, setStudentDocument] = useState({
    name: "",
    status: true,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    setStudentDocument({
      name: name || "",
      status: status === true || status === false ? status : true,
    });
  }, [name, status]);

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
    }));

    const validation = studentDocumentSchema.safeParse(studentDocument);

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

    const res = await AdminServices.saveStudentDocument({ ...studentDocument, id: studentDocumentId });

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
      title: "Student Document Saved",
      description: studentDocumentId
        ? "This Student Document has been updated successfully."
        : "This new Student Document has been added successfully.",
      action: <CheckCircleIcon className="text-green-500" />,
    });

    setOpen(false);

    setStudentDocument({
      name: "",
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
          <DialogTitle>{studentDocumentId ? "Edit" : "Add"} Student Document</DialogTitle>
          <DialogDescription>This will add a new student document.</DialogDescription>
        </DialogHeader>
        <div className="min-w-14 flex flex-col items-end gap-3 mt-2">
          <Switch
            checked={studentDocument.status}
            onCheckedChange={(val) => setStudentDocument({ ...studentDocument, status: val })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <div className="flex gap-3 items-end">
          <div className="w-full flex flex-col gap-3">
            <Label>Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={studentDocument.name || ""}
              onChange={(e) => setStudentDocument({ ...studentDocument, name: e.target.value })}
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
