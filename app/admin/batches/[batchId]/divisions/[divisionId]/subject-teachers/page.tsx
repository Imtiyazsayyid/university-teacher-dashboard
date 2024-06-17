"use client";

import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Batch, BatchSemesterMap } from "@/app/interfaces/BatchInterface";
import { Division } from "@/app/interfaces/DivisionInterface";
import { DivisionSubjectTeacher } from "@/app/interfaces/DivisionSubejctTeacherInterface";
import { Semester } from "@/app/interfaces/SemesterInterface";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import { Combobox } from "@/app/my-components/Combobox";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import AdminServices from "@/app/Services/AdminServices";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { AlertCircleIcon, CheckCheckIcon, LibraryBigIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  params: {
    batchId: string;
    divisionId: string;
  };
}

interface SubjectTeacher {
  subjectName: string;
  subjectId: number;
  teacherId: number | null;
}

const SubJectTeacherPage = ({ params }: Props) => {
  const [loading, setLoading] = useState(true);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [batch, setBatch] = useState<Batch>();
  const [division, setDivision] = useState<Division>();
  const [currentSemesterNumber, setCurrentSemesterNumber] = useState<number>(0);
  const [subjectTeachers, setSubjectTeachers] = useState<SubjectTeacher[]>([]);
  const [divisionSubjectTeachers, setDivisionSubjectTeachers] = useState<DivisionSubjectTeacher[]>([]);

  const getSingleBatch = async () => {
    const res = await AdminServices.getSingleBatch(params.batchId);

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setBatch(res.data.data);
    }

    setLoading(false);
  };

  const getAllTeachers = async () => {
    const res = await AdminServices.getAllTeachers();

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setTeachers(res.data.data.teachers);
    }
  };

  const getSubjectTeachersBySemester = async (accessibleSemesters: BatchSemesterMap) => {
    const currentSemesterDST = divisionSubjectTeachers.filter(
      (dst) => dst.subject.semesterId === accessibleSemesters.semesterId
    );

    let subjectTeacherArr: SubjectTeacher[] = [];
    accessibleSemesters.semester.subjects.forEach((subject) => {
      subjectTeacherArr.push({
        subjectName: subject.name,
        subjectId: subject.id,
        teacherId: currentSemesterDST.find((dst) => dst.subjectId === subject.id)?.teacherId || null,
      });
    });

    setSubjectTeachers(subjectTeacherArr);
  };

  const getSingleDivision = async () => {
    const res = await AdminServices.getSingleDivision(params.divisionId);
    setDivision(res.data.data);
  };

  useEffect(() => {
    if (batch && batch.id) {
      const accessibleSemesters = batch.accessibleSemesters[currentSemesterNumber];
      getSubjectTeachersBySemester(accessibleSemesters);
    }
  }, [divisionSubjectTeachers, batch, currentSemesterNumber]);

  useEffect(() => {
    getSingleBatch();
    getDivisionSubjectTeachers();
    getAllTeachers();
    getSingleDivision();
  }, [currentSemesterNumber]);

  const nextSemester = () => {
    setCurrentSemesterNumber(currentSemesterNumber + 1);
  };

  const prevSemester = () => {
    setCurrentSemesterNumber(currentSemesterNumber - 1);
  };

  const getDivisionSubjectTeachers = async () => {
    const res = await AdminServices.getAllDivisionSubjectTeachers({
      divisionId: params.divisionId,
    });
    if (res.data.status) {
      setDivisionSubjectTeachers(res.data.data);
    }
  };

  const saveSubjectTeacher = async (teacherId: string, subjectId: number) => {
    let newSubjectTeachers = subjectTeachers.map((s) =>
      s.subjectId === subjectId ? { ...s, teacherId: teacherId ? parseInt(teacherId) : null } : s
    );

    setSubjectTeachers(newSubjectTeachers);

    const res = await AdminServices.saveDivisionSubjectTeacher({ divisionId: params.divisionId, teacherId, subjectId });

    if (res.data.status) {
      let message = "";
      const subject = batch?.accessibleSemesters[currentSemesterNumber].semester.subjects.find(
        (s) => s.id === subjectId
      );

      if (teacherId) {
        const teacher = teachers.find((t) => t.id === parseInt(teacherId));
        message = `${teacher?.firstName} ${teacher?.lastName} was added to "${subject?.name}".`;
      } else {
        message = `Teacher was removed from "${subject?.name}".`;
      }

      toast({
        title: `Subject Teacher ${teacherId ? "Saved" : "Removed"}`,
        description: message,
        action: <CheckCheckIcon className="text-green-500" />,
      });
    } else {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed To Save Subject Teacher.",
        action: <AlertCircleIcon className="text-red-500" />,
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1 items-center">
          <LibraryBigIcon height={40} width={40} />
          <div>
            <p className="text-xs">
              {batch?.course && batch.course.name} &#40;{batch && batch.year}&#41;
            </p>
            <h1 className="text-2xl font-extrabold">Subject Teachers - Division {division?.name}</h1>
          </div>
        </div>
      </div>

      <ConditionalDiv
        show={loading}
        className="border rounded-lg h-full shadow-md bg-white dark:bg-[#111] flex justify-center items-center"
      >
        <Loader />
      </ConditionalDiv>
      <ConditionalDiv
        show={!loading}
        className="border rounded-lg shadow-md h-fit overflow-hidden overflow-y-scroll bg-white dark:bg-[#111]"
      >
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-[#151515]">
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead className="w-3/4">Subject</TableHead>
              <TableHead className="w-1/4">Teacher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjectTeachers.map((st, index) => (
              <TableRow className="cursor-pointer" key={st.subjectId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{st.subjectName}</TableCell>
                <TableCell className="border">
                  <Combobox
                    className="w-[250px]"
                    clearable
                    value={st.teacherId?.toString() || ""}
                    options={teachers.map((teacher) => ({
                      label: teacher.firstName + " " + teacher.lastName,
                      value: teacher.id.toString(),
                    }))}
                    onSelect={(val) => saveSubjectTeacher(val, st.subjectId)}
                    width={400}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>
      <Pagination>
        <PaginationContent className="w-full justify-center gap-4">
          <div className="w-28 flex justify-end cursor-pointer">
            {currentSemesterNumber != 0 && (
              <PaginationItem>
                <PaginationPrevious onClick={prevSemester} />
              </PaginationItem>
            )}
          </div>

          <PaginationItem>
            <div className="px-5 border py-2 rounded-lg shadow-md bg-white dark:bg-[#111]">
              <p className="text-sm dark:text-stone-300">
                Semester {batch?.accessibleSemesters[currentSemesterNumber].semester.semNumber || ""}
              </p>
            </div>
          </PaginationItem>

          <div className="w-28 flex justify-start cursor-pointer ">
            {batch && currentSemesterNumber !== batch.accessibleSemesters.length - 1 && (
              <PaginationItem>
                <PaginationNext onClick={nextSemester} />
              </PaginationItem>
            )}
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SubJectTeacherPage;
