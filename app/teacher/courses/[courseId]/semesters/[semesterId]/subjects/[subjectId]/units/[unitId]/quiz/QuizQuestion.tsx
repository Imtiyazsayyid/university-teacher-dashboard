import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { CheckIcon, GripHorizontalIcon, TrashIcon } from "lucide-react";
import React from "react";

interface QuizQuestion {
  fmId: string;
  questionId?: number;
  question: string;
  options: QuizQuestionOption[];
}

interface QuizQuestionOption {
  value: "";
  isCorrect: Boolean;
}

interface Props {
  q: QuizQuestion;
  index: number;
  removeQuestion: (q_index: number) => void;
  addQuestionName: (q_index: number, val: string) => void;
  selectCorrectOption: (q_index: number, o_index: number) => void;
  addOptionValue: (q_index: number, o_index: number, val: string) => void;
}

const QuizQuestion = ({ q, index, removeQuestion, addQuestionName, selectCorrectOption, addOptionValue }: Props) => {
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
            <Button onClick={() => removeQuestion(index)}>
              <TrashIcon size={14} />
            </Button>
          </div>
        </div>

        <div className="w-full flex-row flex gap-2">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Question</Label>
            <Input
              type="text"
              autoComplete="off"
              value={q.question}
              onChange={(e) => addQuestionName(index, e.target.value)}
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-x-10 gap-y-5">
          <div className="w-full flex-col flex gap-2">
            <div className="flex flex-row items-center gap-3">
              <div
                onClick={() => selectCorrectOption(index, 0)}
                className={
                  "border w-[40px] h-full rounded-lg flex justify-center items-center cursor-pointer " +
                  `${q.options[0].isCorrect ? "bg-green-600" : "bg-red-600"}`
                }
              >
                {q.options[0].isCorrect && <CheckIcon size={15} className="text-white" />}
              </div>
              <Input
                type="text"
                autoComplete="off"
                value={q.options[0].value}
                onChange={(e) => addOptionValue(index, 0, e.target.value)}
                className={`border-2 ${
                  q.options[0].isCorrect
                    ? "border-green-600 dark:border-green-950"
                    : "border-red-600 dark:border-red-950"
                } `}
              />
            </div>
          </div>

          <div className="w-full flex-col flex gap-2">
            <div className="flex flex-row items-center gap-3">
              <div
                onClick={() => selectCorrectOption(index, 1)}
                className={
                  "border w-[40px] h-full rounded-lg flex justify-center items-center cursor-pointer " +
                  `${q.options[1].isCorrect ? "bg-green-600" : "bg-red-600"}`
                }
              >
                {q.options[1].isCorrect && <CheckIcon size={15} className="text-white" />}
              </div>
              <Input
                type="text"
                autoComplete="off"
                value={q.options[1].value}
                onChange={(e) => addOptionValue(index, 1, e.target.value)}
                className={`border-2 ${
                  q.options[1].isCorrect
                    ? "border-green-600 dark:border-green-950"
                    : "border-red-600 dark:border-red-950"
                } `}
              />
            </div>
          </div>

          <div className="w-full flex-col flex gap-2">
            <div className="flex flex-row items-center gap-3">
              <div
                onClick={() => selectCorrectOption(index, 2)}
                className={
                  "border w-[40px] h-full rounded-lg flex justify-center items-center cursor-pointer " +
                  `${q.options[2].isCorrect ? "bg-green-600" : "bg-red-600"}`
                }
              >
                {q.options[2].isCorrect && <CheckIcon size={15} className="text-white" />}
              </div>
              <Input
                type="text"
                autoComplete="off"
                value={q.options[2].value}
                onChange={(e) => addOptionValue(index, 2, e.target.value)}
                className={`border-2 ${
                  q.options[2].isCorrect
                    ? "border-green-600 dark:border-green-950"
                    : "border-red-600 dark:border-red-950"
                } `}
              />
            </div>
          </div>

          <div className="w-full flex-col flex gap-2">
            <div className="flex flex-row items-center gap-3">
              <div
                onClick={() => selectCorrectOption(index, 3)}
                className={
                  "border w-[40px] h-full rounded-lg flex justify-center items-center cursor-pointer " +
                  `${q.options[3].isCorrect ? "bg-green-600" : "bg-red-600"}`
                }
              >
                {q.options[3].isCorrect && <CheckIcon size={15} className="text-white" />}
              </div>
              <Input
                type="text"
                autoComplete="off"
                value={q.options[3].value}
                onChange={(e) => addOptionValue(index, 3, e.target.value)}
                className={`border-2 ${
                  q.options[3].isCorrect
                    ? "border-green-600 dark:border-green-950"
                    : "border-red-600 dark:border-red-950"
                } `}
              />
            </div>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default QuizQuestion;
