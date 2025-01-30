"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../chats/components/inputs/Input";
import Select from "../../chats/components/inputs/Select";
import Button from "../../chats/components/Button";
import { Separator } from "@/components/ui/separator";

import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Teacher } from "@/app/interfaces/TeacherInterface";

interface SelectOption {
  value: number; // Or number if IDs are numbers
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}
const GroupChatModal = ({ isOpen, onClose, teachers }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  console.log("Teachers: ", teachers);
  const options: SelectOption[] = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim(), // Provide a default empty string if user.name is null
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const res = await TeacherServices.createTeacherConversation({
        ...data,
        isGroup: true,
      });

      if (!res.data.status) {
        StandardErrorToast();
        return;
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.log("Error creating Group chat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group chat</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <span className="text-gray-600">Create a chat with more than 2 people</span>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                label="Name"
                register={register}
                errors={errors}
                id="name"
                disabled={isLoading}
                required
              />
              <Select
                teachers={teachers}
                disabled={isLoading}
                label="Members"
                options={options}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
            <Separator />
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                disabled={isLoading}
                onClick={onClose}
                secondary
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Create
              </Button>
            </div>
          </form>
        </DialogHeader>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
