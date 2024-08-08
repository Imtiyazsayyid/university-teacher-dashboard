"use client";

import ErrorLabel from "@/app/my-components/ErrorLabel";
import GoBack from "@/app/my-components/GoBack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Reorder, useDragControls } from "framer-motion";
import { AlertCircleIcon, CheckCircle2Icon, CheckCircleIcon, LibraryBigIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuizQuestionComponent from "./QuizQuestion";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { toast } from "@/components/ui/use-toast";
import { UnitQuizQuestion } from "@/app/interfaces/UnitQuizInterface";
import { v4 as uuidv4 } from "uuid";
import { unitQuizSchema } from "@/app/validationSchemas";

interface QuizQuestion {
  fmId: string;
  question: string;
  options: QuizQuestionOption[];
}

interface QuizQuestionOption {
  value: "";
  isCorrect: Boolean;
}

interface Props {
  unitId: number;
  quizId?: number;
}

const QuizForm = ({ unitId, quizId }: Props) => {
  const router = useRouter();

  const [quizDetails, setQuizDetails] = useState({
    name: "",
    status: true,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      fmId: uuidv4(),
      question: "",
      options: [
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
      ],
    },
  ]);

  const [errors, setErrors] = useState({
    name: "",
  });

  const validateQuiz = () => {
    let finalQuestions: QuizQuestion[] = [];

    for (let question of questions) {
      if (
        !question.question &&
        !question.options[0].value &&
        !question.options[1].value &&
        !question.options[2].value &&
        !question.options[3].value
      ) {
        continue;
      }
      finalQuestions.push(question);
    }

    for (let question of finalQuestions) {
      if (!question.question) {
        return { success: false, message: "Make Sure No Question Fields are Empty." };
      }

      let optionCount = 0;

      for (let option of question.options) {
        if (option.value) {
          optionCount++;
        }
      }

      if (optionCount < 2) {
        return { success: false, message: "You must provide atleast 2 Options per question." };
      }
    }

    setQuestions(finalQuestions);

    return { success: true, message: "" };
  };

  const handleSave = async () => {
    setErrors(() => ({
      name: "",
    }));

    const complexValidation = validateQuiz();

    if (!complexValidation.success) {
      toast({
        title: "Uh oh! Failed to Save Quiz",
        description: complexValidation.message,
        action: <AlertCircleIcon className="text-red-500" />,
      });

      return;
    }

    const validation = unitQuizSchema.safeParse(quizDetails);

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

    try {
      const res = await TeacherServices.saveUnitQuiz({ ...quizDetails, unitId, id: quizId, questions });
      if (res.data.status) {
        toast({
          title: "Quiz Added Successfully.",
          description: "This is quiz is now available for students to take.",
          action: <CheckCircleIcon className="text-green-500" />,
        });
        router.back();
      } else {
        StandardErrorToast();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const addQuestion = () => {
    const newQuestionObj = {
      fmId: uuidv4(),
      question: "",
      options: [
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
      ],
    } as QuizQuestion;

    setQuestions([...questions, newQuestionObj]);
  };

  const addQuestionName = (index: number, name: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index
        ? {
            ...q,
            question: name,
          }
        : q
    );

    setQuestions(updatedQuestions);
  };

  const addOptionValue = (q_index: number, o_index: number, name: string) => {
    const updatedQuestions = questions.map((q, qi) =>
      qi === q_index
        ? ({
            ...q,
            options: questions[q_index].options.map((o, oi) => (oi === o_index ? { ...o, value: name } : o)),
          } as QuizQuestion)
        : q
    );

    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestionList = questions.filter((q, i) => index !== i);
    setQuestions(newQuestionList);
  };

  const selectCorrectOption = (q_index: number, o_index: number) => {
    const check = questions.find((q, qi) => qi === q_index)?.options.find((o, oi) => oi === o_index)?.value;
    if (!check) return;

    const updatedQuestions = questions.map((q, qi) =>
      qi === q_index
        ? {
            ...q,
            options: questions[q_index].options.map((o, oi) =>
              oi === o_index && o.value ? { ...o, isCorrect: true } : { ...o, isCorrect: false }
            ),
          }
        : q
    );

    setQuestions(updatedQuestions);
  };

  const getSingleQuiz = async () => {
    const res = await TeacherServices.getSingleUnitQuiz(quizId);

    if (res.data.status) {
      const quiz = res.data.data;

      setQuizDetails({
        name: quiz.name,
        status: quiz.status,
      });

      if (quiz.questions && quiz.questions.length > 0) {
        let resQuestions = quiz.questions.map((q: UnitQuizQuestion, index: number) => ({
          fmId: index,
          question: q.question,
          options: q.options.map((o) => ({
            value: o.value,
            isCorrect: o.isCorrect,
          })),
        }));

        setQuestions(resQuestions);
      }
    }
  };

  useEffect(() => {
    if (quizId) {
      getSingleQuiz();
    }
  }, [quizId]);

  return (
    <div className="h-full w-full px-40">
      <div className="flex justify-center w-full items-center mt-32 mb-10 gap-3 h-fit">
        <GoBack />
        <LibraryBigIcon height={50} width={50} />
        <h1 className="text-4xl font-extrabold">
          {quizId ? "Edit" : "Add New"} Quiz {quizId && quizDetails && " - " + quizDetails.name}
        </h1>
      </div>

      <div className="flex flex-col gap-x-2 gap-y-10">
        <div className="flex flex-row gap-4 items-end justify-end">
          <Switch
            checked={quizDetails.status}
            onCheckedChange={(val) => setQuizDetails({ ...quizDetails, status: val })}
          />
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Quiz Name</Label>
            <ErrorLabel errorMessage={errors.name} />
            <Input
              type="text"
              autoComplete="off"
              value={quizDetails.name}
              onChange={(e) => setQuizDetails({ ...quizDetails, name: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-x-2 gap-y-3 pt-10">
        <Reorder.Group values={questions} onReorder={setQuestions} className="border rounded-xl p-5" as="ol">
          {questions.map((q, index) => (
            <QuizQuestionComponent
              q={q}
              index={index}
              removeQuestion={removeQuestion}
              addOptionValue={addOptionValue}
              addQuestionName={addQuestionName}
              selectCorrectOption={selectCorrectOption}
              key={q.fmId}
            />
          ))}
        </Reorder.Group>
      </div>

      <div className="w-full flex justify-center mt-5">
        <Button className="rounded-full py-2 px-2" onClick={addQuestion}>
          <PlusCircleIcon />
        </Button>
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

export default QuizForm;
