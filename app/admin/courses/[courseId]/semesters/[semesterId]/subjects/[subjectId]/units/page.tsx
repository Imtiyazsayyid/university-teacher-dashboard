"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Unit } from "@/app/interfaces/UnitInterface";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import EditTableAction from "@/app/my-components/EditTableAction";
import GoBack from "@/app/my-components/GoBack";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { FileQuestionIcon, FolderClosedIcon, LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/interfaces/CourseInterface";
import { Semester } from "@/app/interfaces/SemesterInterface";
import { Subject } from "@/app/interfaces/SubjectInterface";

import Form from "./Form";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";

interface Props {
  params: {
    courseId: string;
    semesterId: string;
    subjectId: string;
  };
}

const UnitsPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState<Semester>();
  const [subject, setSubject] = useState<Subject>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsCount, setUnitsCount] = useState(0);

  const [filters, setFilters] = useState({
    searchText: "",
    unitTypeId: undefined as undefined | number,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllUnits = async () => {
    setLoading(true);
    const res = await AdminServices.getAllUnits({ ...pagination, subjectId: params.subjectId, ...filters });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setUnits(res.data.data.units);
      setUnitsCount(res.data.data.unitCount);
    }

    setLoading(false);
  };

  const getSingleSubject = async () => {
    const res = await AdminServices.getSingleSubject(params.subjectId);

    if (!res.data.status) {
      return;
    }

    setSubject(res.data.data);
  };

  const getSingleCourse = async () => {
    const res = await AdminServices.getSingleCourse(params.courseId);

    if (!res.data.status) {
      return;
    }

    setCourse(res.data.data);
  };

  const getSingleSemester = async () => {
    const res = await AdminServices.getSingleSemester(params.semesterId);

    if (!res.data.status) {
      return;
    }

    setSemester(res.data.data);
  };

  useEffect(() => {
    getAllUnits();
  }, [pagination, filters]);

  useEffect(() => {
    getSingleCourse();
    getSingleSemester();
    getSingleSubject();
  }, []);

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
              Units {"-"} {subject && subject.name}
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
          <Form
            courseName={course?.name!}
            semNumber={semester?.semNumber!}
            subjectName={subject?.name!}
            subjectId={parseInt(params.subjectId)}
            refetch={getAllUnits}
          >
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Form>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units?.map((unit, index) => (
              <TableRow className="cursor-pointer" key={unit.id}>
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>Unit {unit.number}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>
                  {unit.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Form
                      subjectName={subject?.name!}
                      subjectId={parseInt(params.subjectId)}
                      currentUnit={unit}
                      courseName={course?.name!}
                      semNumber={semester?.semNumber!}
                      refetch={getAllUnits}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditTableAction />
                      </div>
                    </Form>
                    <div
                      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-orange-500"
                      onClick={() =>
                        router.push(
                          `/admin/courses/${params.courseId}/semesters/${params.semesterId}/subjects/${subject?.id}/units/${unit.id}/materials`
                        )
                      }
                    >
                      <FolderClosedIcon height={16} />
                    </div>
                    <div
                      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-blue-900"
                      onClick={() =>
                        router.push(
                          `/admin/courses/${params.courseId}/semesters/${params.semesterId}/subjects/${subject?.id}/units/${unit.id}/quiz`
                        )
                      }
                    >
                      <FileQuestionIcon height={16} />
                    </div>
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteUnit(unit.id);
                        await getAllUnits();
                        toast({
                          title: "Unit Deleted",
                          description: `'${unit.name}' was permanently deleted from this semester.`,
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

      <MyPagination show={!loading} itemCount={unitsCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default UnitsPage;
