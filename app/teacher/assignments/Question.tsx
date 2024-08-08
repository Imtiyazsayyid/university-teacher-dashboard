import React from "react";
import { Question } from "./Form";
import { GripHorizontalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Reorder, useDragControls } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  q: Question;
  index: number;
  removeQuestion: (index: number) => void;
  addQuestionName: (index: number, val: string) => void;
}

const MyQuestion = ({ q, index, removeQuestion, addQuestionName }: Props) => {
  const controls = useDragControls();
  return (
    <Reorder.Item value={q} className="mb-5" dragListener={false} dragControls={controls} id={index.toString()}>
      <div className="flex flex-col gap-4 border p-10 bg-[#fafafa] dark:bg-[#151515] shadow-md rounded-lg">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Question {index + 1}</h3>
          <div>
            <GripHorizontalIcon onPointerDown={(e) => controls.start(e)} className="cursor-pointer" size={14} />
          </div>
          <div className="flex-col flex gap-2 justify-end">
            <Button onClick={() => removeQuestion(index)} className="bg-red-800 hover:bg-red-950">
              <TrashIcon size={14} />
            </Button>
          </div>
        </div>

        <div className="w-full flex-row flex gap-2">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Question</Label>
            <Textarea
              autoComplete="off"
              className="resize-none"
              value={q.name}
              onChange={(e) => addQuestionName(index, e.target.value)}
            />
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default MyQuestion;
