"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Division } from "@/app/interfaces/DivisionInterface";
import TeacherServices from "@/app/Services/TeacherServices";
import { Combobox } from "@/app/my-components/Combobox";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { DatePicker } from "@/app/my-components/DatePicker";
import { DateTimePicker } from "@/app/my-components/DateTimePicker";
import moment from "moment";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import MyQuestion from "./Question";
import { v4 as uuidv4 } from "uuid";
import UploadCloudinary from "@/app/my-components/UploadCloudinary";
import PreviewAnything from "@/app/my-components/PreviewAnything";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import StandardSuccessToast from "@/app/extras/StandardSuccessToast";

export interface Question {
  db_id?: number | null;
  id: string;
  name: string;
}

interface AssignmentDetails {
  name: string;
  description: string;
  divisionId: number | undefined;
  subjectId: number | undefined;
  dueDate: string | Date | undefined;
}

interface Props {
  assignmentId?: number | undefined;
  assignmentDetailsProp?: AssignmentDetails;
  questionsProp?: Question[];
  materialProp?: string[];
}

const AssignmentForm = ({ assignmentDetailsProp, questionsProp, materialProp, assignmentId }: Props) => {
  const [assignmentDetails, setAssignmentDetails] = useState({
    name: "",
    description: "",
    divisionId: undefined as number | undefined,
    subjectId: undefined as number | undefined,
    dueDate: new Date() as Date | undefined,
  });

  const [myDivisions, setMyDivisions] = useState<Division[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [material, setMaterial] = useState<string[]>([]);
  const [pastedMaterialLink, setPastedMaterialLink] = useState("");

  const getMyDivisions = async () => {
    try {
      const res = await TeacherServices.getAllTeacherDivisions();
      if (res.data.status) {
        setMyDivisions(res.data.data);
        return;
      }
      StandardErrorToast();
    } catch (error) {}
  };

  const getTeacherSubjectsByDivision = async (divisionId: string | number) => {
    try {
      const res = await TeacherServices.getTeahcerSubjectsByDivision({ divisionId });
      if (res.data.status) {
        setTeacherSubjects(res.data.data);
        return;
      }
      StandardErrorToast();
    } catch (error) {}
  };

  useEffect(() => {
    getMyDivisions();
  }, []);

  useEffect(() => {
    if (assignmentId && assignmentDetailsProp && questionsProp && materialProp) {
      if (assignmentDetailsProp.divisionId) {
        getTeacherSubjectsByDivision(assignmentDetailsProp.divisionId);
      }

      setAssignmentDetails({
        name: assignmentDetailsProp.name,
        description: assignmentDetailsProp.description,
        divisionId: assignmentDetailsProp.divisionId,
        subjectId: assignmentDetailsProp.subjectId,
        dueDate: assignmentDetailsProp.dueDate ? new Date(assignmentDetailsProp.dueDate) : new Date(),
      });
      setQuestions(questionsProp);
      setMaterial(materialProp);
    }
  }, [assignmentDetailsProp, questionsProp, materialProp]);

  const addQuestion = () => {
    const newQuestionObj = {
      id: uuidv4(),
      name: "",
      db_id: null,
    };

    setQuestions([...questions, newQuestionObj]);
  };

  const addQuestionName = (index: number, name: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index
        ? {
            ...q,
            name,
          }
        : q
    );

    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestionList = questions.filter((q, i) => index !== i);
    setQuestions(newQuestionList);
  };

  const createAssignment = async () => {
    if (!assignmentDetails.name || !assignmentDetails.subjectId || !assignmentDetails.divisionId) {
      StandardErrorToast("Could Not Save Assignment.", "Please Provide All Details To Save this Assignment");
      return;
    }

    if (moment(assignmentDetails.dueDate).isBefore(moment())) {
      StandardErrorToast("Could Not Save Assignment.", "Due Date Cannot Be Earlier Than Now.");
      return;
    }

    try {
      const res = await TeacherServices.saveAssignment({ id: assignmentId, ...assignmentDetails, questions, material });
      if (res.data.status) {
        StandardSuccessToast(
          "Success! Assignemnt Has Been Created",
          "You can view this assignments in your assignment list."
        );
      } else {
        StandardErrorToast("Could Not Save Assignment.", "An Unecpected Error Has Occured");
      }
    } catch (error) {
      console.error(error);
      StandardErrorToast("Could Not Save Assignment.", "An Unecpected Error Has Occured");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl text-center font-bold mb-10">
        {!assignmentId ? "Add New Assignment" : "Edit Your Assignment"}
      </h1>
      <Tabs defaultValue="details" className="w-full mb-5">
        <TabsList className="bg-black-100 mb-5 flex justify-center gap-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="materials">Material</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="flex justify-center">
          <div className="rounded-lg p-10 flex flex-col items-center gap-10 shadow-md border w-fit">
            <div className="flex gap-5 w-[500px] xl:w-[700px] justify-end">
              <div className="flex flex-col gap-2 w-60">
                <Label>Due Date</Label>
                <DateTimePicker
                  date={assignmentDetails.dueDate}
                  setDate={(val) => setAssignmentDetails({ ...assignmentDetails, dueDate: val })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-5 w-[500px] xl:w-[700px]">
              <div className="flex flex-col w-full gap-2">
                <Label>Select Division</Label>
                <Combobox
                  clearable
                  className="w-full"
                  dropDownClassName="w-96"
                  options={myDivisions.map((d) => {
                    return {
                      label: `Division ${d.name} - ${d.batch.course.abbr} ${d.batch.year}`,
                      value: d.id.toString(),
                    };
                  })}
                  value={assignmentDetails.divisionId?.toString() || ""}
                  onSelect={(val) => {
                    val ? getTeacherSubjectsByDivision(val) : setTeacherSubjects([]);
                    setAssignmentDetails({
                      ...assignmentDetails,
                      divisionId: val ? parseInt(val) : undefined,
                      subjectId: undefined,
                    });
                  }}
                />
              </div>

              <ConditionalDiv show={assignmentDetails.divisionId ? true : false} className="flex flex-col w-full gap-2">
                <Label>Select Subject</Label>
                <Combobox
                  clearable
                  className="w-full"
                  dropDownClassName="w-[25vw]"
                  options={teacherSubjects.map((s) => {
                    return {
                      label: `${s.name}`,
                      value: s.id.toString(),
                    };
                  })}
                  value={assignmentDetails.subjectId?.toString() || ""}
                  onSelect={(val) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      subjectId: val ? parseInt(val) : undefined,
                    })
                  }
                />
              </ConditionalDiv>
            </div>
            <div className="flex flex-col w-[500px] xl:w-[700px] gap-2">
              <Label>Assignment Name</Label>
              <Input
                className="w-full"
                value={assignmentDetails.name}
                onChange={(e) => setAssignmentDetails({ ...assignmentDetails, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col w-[500px] xl:w-[700px] gap-2">
              <Label>Description</Label>
              <Textarea
                className="w-full h-96 resize-none"
                value={assignmentDetails.description}
                onChange={(e) => setAssignmentDetails({ ...assignmentDetails, description: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="questions" className="flex justify-center">
          <div className="rounded-lg p-10 flex flex-col items-center gap-10 shadow-md border w-full">
            <Reorder.Group values={questions} onReorder={setQuestions} className="rounded-xl p-5 w-full" as="ol">
              {questions.map((q, index) => (
                <MyQuestion
                  q={q}
                  index={index}
                  key={q.id}
                  addQuestionName={addQuestionName}
                  removeQuestion={removeQuestion}
                />
              ))}
            </Reorder.Group>

            <div className="w-full flex justify-center">
              <Button className="rounded-full py-2 px-2" onClick={addQuestion}>
                <PlusCircleIcon />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="materials" className="flex justify-center">
          <div className="rounded-lg p-10 flex flex-col items-center gap-10 shadow-md border w-full">
            <div className="w-96 flex items-center mt-5 flex-col gap-3">
              <div className="w-full">
                <UploadCloudinary setLink={(val) => setMaterial([...material, val])} />
              </div>
              <p>Or</p>
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="Paste Content Link"
                  value={pastedMaterialLink}
                  onChange={(e) => setPastedMaterialLink(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setMaterial([...material, pastedMaterialLink]);
                    setPastedMaterialLink("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {material.map((m, index) => (
                <div className="border rounded-xl relative" key={index}>
                  <Button
                    className="absolute m-5 bg-red-800 hover:bg-red-950 rounded-full"
                    onClick={() => {
                      const newMaterial = material.filter((m, i) => i != index);
                      setMaterial(newMaterial);
                    }}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                  <PreviewAnything link={m} key={index} extraClassName="max-h-[300px]" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-center">
        <Button className="mx-auto" onClick={createAssignment}>
          {!assignmentId ? "Create Assignment" : "Update Assignment"}
        </Button>
      </div>
    </div>
  );
};

export default AssignmentForm;
