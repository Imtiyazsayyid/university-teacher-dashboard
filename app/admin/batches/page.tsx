"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Batch } from "@/app/interfaces/BatchInterface";
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
import { LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/interfaces/CourseInterface";
import { Form } from "./Form";
import { Combobox } from "@/app/my-components/Combobox";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";
import yearRange from "@/app/extras/yearRange";
import moment from "moment";

interface Props {
  params: {
    courseId: string;
  };
}

const BatchesPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batchesCount, setBatchesCount] = useState(0);

  const [filters, setFilters] = useState({
    courseId: null as number | null,
    year: null as number | null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllBatches = async () => {
    setLoading(true);
    const res = await AdminServices.getAllBatches({
      ...pagination,
      ...filters,
    });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setBatches(res.data.data.batches);
      setBatchesCount(res.data.data.batchCount);
    }

    setLoading(false);
  };

  const getAllCourses = async () => {
    const res = await AdminServices.getAllCourses();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCourses(res.data.data.courses);
  };

  useEffect(() => {
    getAllBatches();
  }, [pagination, filters]);

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className=" flex w-full items-end justify-between">
        <div className="pt-5 pb-5 flex items-center gap-2">
          <GoBack />
          <div className="flex gap-1">
            <LibraryBigIcon height={25} width={25} />
            <h1 className="text-2xl font-extrabold">Batches</h1>
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col gap-1">
            <Label htmlFor="search" className="text-xs text-gray-500">
              Course
            </Label>
            <Combobox
              clearable
              className="w-[400px]"
              options={courses.map((course) => ({
                label: course.name,
                value: course.id.toString(),
              }))}
              value={filters.courseId?.toString() || ""}
              onSelect={(val) => setFilters({ ...filters, courseId: val ? parseInt(val) : null })}
              width={400}
            />
          </div>
          <div className="grid w-36 items-center gap-1.5">
            <Label htmlFor="search" className="text-xs text-gray-500">
              Year
            </Label>
            <MySelect
              clearable
              options={yearRange(moment().year() - 5, moment().year() + 100)}
              selectedItem={filters.year || undefined}
              onSelect={(val) => setFilters({ ...filters, year: val ? parseInt(val) : null })}
            />
          </div>
          <div className="grid w-36 items-center gap-1.5">
            <Label htmlFor="search" className="text-xs text-gray-500">
              Per Page
            </Label>
            <MySelect
              options={itemsPerPageOptions}
              selectedItem={pagination.itemsPerPage}
              onSelect={(val) =>
                setPagination({
                  ...pagination,
                  itemsPerPage: val ? parseInt(val) : 5,
                })
              }
            />
          </div>
          <Form courseId={parseInt(params.courseId)} refetch={getAllBatches}>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Form>
        </div>
      </div>
      <ConditionalDiv show={loading} className="border rounded-lg h-full shadow-md bg-white dark:bg-[#111] flex justify-center items-center">
        <Loader />
      </ConditionalDiv>
      <ConditionalDiv show={!loading} className="border rounded-lg shadow-md h-full overflow-hidden overflow-y-scroll bg-white dark:bg-[#111]">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-[#151515]">
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Accessible Semesters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches?.map((batch, index) => (
              <TableRow
                className="cursor-pointer"
                key={batch.id}
                onClick={(e) => {
                  router.push(`/admin/batches/${batch.id}/divisions`);
                }}
              >
                <TableCell className="font-medium">{index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}</TableCell>
                <TableCell>
                  {batch.course.name} &#40;{batch.year}&#41;
                </TableCell>
                <TableCell>
                  {batch.accessibleSemesters
                    .map((batchSemesterMap) => `Semester ${batchSemesterMap.semester.semNumber} `)
                    .map((semName, index) => (
                      <Badge key={index} className={`bg-violet-500 hover:bg-violet-800 dark:bg-violet-800 m-1`}>
                        {semName}
                      </Badge>
                    ))}
                </TableCell>
                <TableCell>
                  {batch.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Form
                      courseId={batch.courseId}
                      refetch={getAllBatches}
                      status={batch.status}
                      batchId={batch.id}
                      year={batch.year}
                      accessibleSemesterIds={batch.accessibleSemesters.map((BatchSemesterMap) => BatchSemesterMap.semester.id)}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditTableAction />
                      </div>
                    </Form>
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteBatch(batch.id);
                        await getAllBatches();
                        toast({
                          title: "Batch Deleted",
                          description: `'Batch ${batch.course.name} (${batch.year})' was permanently.`,
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

      <MyPagination show={!loading} itemCount={batchesCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default BatchesPage;
