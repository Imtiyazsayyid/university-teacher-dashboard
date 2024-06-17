"use client";

import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Course } from "@/app/interfaces/CourseInterface";
import { Semester } from "@/app/interfaces/SemesterInterface";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { SubjectType } from "@/app/interfaces/SubjectTypeInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { LibraryBigIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    courseId: string;
    semesterId: string;
  };
}

const SubjectsPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState<Semester>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [subjectTypes, setSubjectTypes] = useState<SubjectType[]>();

  const [filters, setFilters] = useState({
    searchText: "",
    subjectTypeId: undefined as undefined | number,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getSubjectTypes = async () => {
    const res = await TeacherServices.getAllSubjectTypes();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setSubjectTypes(res.data.data.subjectTypes);
  };

  const getAllSubjects = async () => {
    setLoading(true);

    const res = await TeacherServices.getAllSubjects({ ...pagination, semesterId: params.semesterId, ...filters });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setSubjects(res.data.data.subjects);
      setSubjectsCount(res.data.data.subjectCount);
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

  const getSingleSemester = async () => {
    const res = await TeacherServices.getSingleSemester(params.semesterId);

    if (!res.data.status) {
      return;
    }

    setSemester(res.data.data);
  };

  useEffect(() => {
    getAllSubjects();
  }, [pagination, filters]);

  useEffect(() => {
    getSingleCourse();
    getSingleSemester();
    getSubjectTypes();
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1 items-center">
          <LibraryBigIcon height={40} width={40} />
          <div>
            <p className="text-xs">{course && course.abbr}</p>
            <h1 className="text-2xl font-extrabold">Subjects - {semester && "Semester " + semester?.semNumber}</h1>
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="search" className="text-xs text-gray-500">
              Subject Type
            </Label>
            <MySelect
              clearable
              className="w-80"
              options={subjectTypes?.map((type) => ({ value: type.id, label: type.name }))}
              selectedItem={filters.subjectTypeId}
              onSelect={(val) => {
                setFilters({ ...filters, subjectTypeId: val ? parseInt(val) : undefined });
              }}
            />
          </div>

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
              <TableHead>Name</TableHead>
              <TableHead>Abbreviation</TableHead>
              <TableHead>Subject Type</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects?.map((subject, index) => (
              <TableRow
                className="cursor-pointer"
                key={subject.id}
                onClick={(e) => {
                  router.push(
                    `/teacher/courses/${params.courseId}/semesters/${params.semesterId}/subjects/${subject?.id}/units`
                  );
                }}
              >
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.abbr}</TableCell>
                <TableCell>{subject.subjectType.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>
                  {subject.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <DeleteTableAction
                      action={async () => {
                        await TeacherServices.deleteSubject(subject.id);
                        await getAllSubjects();
                        toast({
                          title: "Subject Deleted",
                          description: `'${subject.name}' was permanently deleted from this semester.`,
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

      <MyPagination show={!loading} itemCount={subjectsCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default SubjectsPage;
