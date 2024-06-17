"use client";

import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Course } from "@/app/interfaces/CourseInterface";
import { Semester } from "@/app/interfaces/SemesterInterface";
import { Subject } from "@/app/interfaces/SubjectInterface";

import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import EditTableAction from "@/app/my-components/EditTableAction";
import GoBack from "@/app/my-components/GoBack";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { DownloadIcon, LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import downloadFile from "@/app/helpers/downloadFile";
import { UnitQuiz } from "@/app/interfaces/UnitQuizInterface";

// import Form from "./Form";
import { Unit } from "@/app/interfaces/UnitInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";

interface Props {
  params: {
    courseId: string;
    semesterId: string;
    subjectId: string;
    unitId: string;
  };
}

const UnitQuizesPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState<Semester>();
  const [subject, setSubject] = useState<Subject>();
  const [unit, setUnit] = useState<Unit>();

  const [unitQuizes, setUnitQuizes] = useState<UnitQuiz[]>([]);
  const [unitQuizesCount, setUnitQuizesCount] = useState(0);

  const [filters, setFilters] = useState({
    searchText: "",
    unitQuizTypeId: undefined as undefined | number,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllUnitQuizes = async () => {
    setLoading(true);
    const res = await TeacherServices.getAllUnitQuizes({ ...pagination, unitId: params.unitId, ...filters });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setUnitQuizes(res.data.data.unitQuizes);
      setUnitQuizesCount(res.data.data.unitQuizesCount);
    }

    setLoading(false);
  };

  const getSingleSubject = async () => {
    const res = await TeacherServices.getSingleSubject(params.subjectId);

    if (!res.data.status) {
      return;
    }

    setSubject(res.data.data);
  };

  const getSingleCourse = async () => {
    const res = await TeacherServices.getSingleCourse(params.courseId);

    if (!res.data.status) {
      return;
    }

    setCourse(res.data.data);
  };

  const getSingleSemester = async () => {
    const res = await TeacherServices.getSingleSemester(params.semesterId);

    if (!res.data.status) {
      return;
    }

    setSemester(res.data.data);
  };

  const getSingleUnit = async () => {
    const res = await TeacherServices.getSingleUnit(params.unitId);

    if (!res.data.status) {
      return;
    }

    setUnit(res.data.data);
  };

  useEffect(() => {
    getSingleCourse();
    getSingleSemester();
    getSingleSubject();
    getSingleUnit();
    getAllUnitQuizes();
  }, [pagination, filters]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1 items-center">
          <LibraryBigIcon height={40} width={40} />
          <div>
            <p className="text-xs">
              {course && course.abbr} - {semester && "Semester " + semester?.semNumber}
            </p>
            <h1 className="text-2xl font-extrabold">
              Unit {unit && unit.number} Quizes {"-"} {subject && subject.name}
            </h1>
          </div>
        </div>
      </div>
      <div className=" flex w-full items-end justify-between">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="search" className="text-xs text-gray-500">
            Search
          </Label>
          <Input
            type="text"
            id="search"
            autoComplete="off"
            value={filters.searchText}
            onChange={(e) => {
              setFilters({ ...filters, searchText: e.target.value });
              setPagination({ ...pagination, currentPage: 1 });
            }}
          />
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
          <Button
            onClick={() =>
              router.push(
                `/teacher/courses/${params.courseId}/semesters/${params.semesterId}/subjects/${subject?.id}/units/${params.unitId}/quiz/new`
              )
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add New
          </Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitQuizes?.map((unitQuiz, index) => (
              <TableRow className="cursor-pointer border" key={unitQuiz.id}>
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>

                <TableCell>{unitQuiz.name}</TableCell>
                <TableCell>
                  {unitQuiz.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* <Form unitNumber={unit?.number!} subjectName={subject?.name!} subjectId={parseInt(params.subjectId)} unitId={parseInt(params.unitId)} currentUnitQuiz={unitQuiz} courseName={course?.name!} semNumber={semester?.semNumber!} refetch={getAllUnitQuizes}>
                      <div>
                        <EditTableAction />
                      </div>
                    </Form> */}
                    {/* <div
                      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-green-700 dark:hover:bg-green-800"
                      onClick={() => downloadFile(unitQuiz.link, unitQuiz.name)}
                    >
                      <DownloadIcon height={16} />
                    </div> */}
                    <EditTableAction
                      action={() =>
                        router.push(
                          `/teacher/courses/${params.courseId}/semesters/${params.semesterId}/subjects/${subject?.id}/units/${params.unitId}/quiz/${unitQuiz.id}`
                        )
                      }
                    />
                    <DeleteTableAction
                      action={async () => {
                        await TeacherServices.deleteUnitQuiz(unitQuiz.id);
                        await getAllUnitQuizes();
                        toast({
                          title: "Unit Quiz Deleted",
                          description: `'${unitQuiz.name}' was permanently deleted from this unit.`,
                          action: <TrashIcon className="text-red-500" />,
                        });
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>

      <MyPagination show={!loading} itemCount={unitQuizesCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default UnitQuizesPage;
