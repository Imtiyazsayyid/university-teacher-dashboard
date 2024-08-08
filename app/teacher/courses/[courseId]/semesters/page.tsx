"use client";

import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Semester } from "@/app/interfaces/SemesterInterface";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";

import GoBack from "@/app/my-components/GoBack";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/interfaces/CourseInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";

interface Props {
  params: {
    courseId: string;
  };
}

const SemestersPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<Course>();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [semestersCount, setSemestersCount] = useState(0);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllSemesters = async () => {
    setLoading(true);
    const res = await TeacherServices.getAllSemesters({ ...pagination, courseId: params.courseId });

    if (!res.data.status) {
      StandardErrorToast();
      return;
    } else {
      setSemesters(res.data.data.semesters);
      setSemestersCount(res.data.data.semesterCount);
    }

    setLoading(false);
  };

  const getSingleCourse = async () => {
    const res = await TeacherServices.getSingleCourse(params.courseId);

    if (!res.data.status) {
      return;
    }

    setCourse(res.data.data);
  };

  useEffect(() => {
    getSingleCourse();
    getAllSemesters();
  }, [pagination]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className=" flex w-full items-end justify-between">
        <div className="pt-5 pb-5 flex items-center gap-2">
          <GoBack />
          <div className="flex gap-1">
            <LibraryBigIcon height={25} width={25} />
            <h1 className="text-2xl font-extrabold">Semesters{course && " - " + course.name}</h1>
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="grid w-36 items-center gap-1.5">
            <Label htmlFor="search" className="text-xs text-gray-500">
              Per Page
            </Label>
            <MySelect
              options={itemsPerPageOptions}
              selectedItem={pagination.itemsPerPage}
              onSelect={(val) => setPagination({ ...pagination, itemsPerPage: val ? parseInt(val) : 5 })}
            />
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
        className="border rounded-lg shadow-md h-full overflow-hidden overflow-y-scroll bg-white dark:bg-[#111]"
      >
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-[#151515]">
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters?.map((semester, index) => (
              <TableRow
                className="cursor-pointer"
                key={semester.id}
                onClick={(e) => {
                  router.push(`/teacher/courses/${params.courseId}/semesters/${semester.id}/subjects`);
                }}
              >
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>Semester {semester.semNumber}</TableCell>
                <TableCell>{semester.duration} Months</TableCell>
                <TableCell>
                  {semester.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>

      <MyPagination show={!loading} itemCount={semestersCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default SemestersPage;
