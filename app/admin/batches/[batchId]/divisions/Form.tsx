import AdminServices from "@/app/Services/AdminServices";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import { divisionSchema } from "@/app/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  batchId: number;
  divisionId?: number;
  name?: string;
  status?: boolean;
  children: React.ReactNode;
  refetch: () => void;
}

export function Form({
  name,
  batchId,
  divisionId,
  children,
  refetch,
  status,
}: Props) {
  const [isOpen, setOpen] = useState(false);

  const [division, setDivision] = useState({
    name: "",
    batchId: batchId,
    status: true,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    setDivision({
      name: name || "",
      batchId: batchId,
      status: status === true || status === false ? status : true,
    });
  }, [name]);

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
    }));

    const validation = divisionSchema.safeParse(division);

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

    const res = await AdminServices.saveDivision({
      ...division,
      id: divisionId,
    });

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

    setDivision({
      name: "",
      batchId: batchId,
      status: true,
    });
  };

  const handleDiaglogOpen = (val: boolean) => {
    setOpen(val);
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
          <DialogTitle>Add New Division</DialogTitle>
          <DialogDescription>{}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-5 items-end">
          <div className="w-4/5 flex flex-col gap-3">
            <Label>Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              value={division.name || undefined}
              onChange={(e) =>
                setDivision({ ...division, name: e.target.value })
              }
            />
          </div>
          <div className="w-1/5 h-full flex items-end justify-end flex-col gap-3">
            <Switch
              checked={division.status}
              onCheckedChange={(val) =>
                setDivision({ ...division, status: val })
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
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
