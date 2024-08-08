"use client";

import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Assignment } from "@/app/interfaces/AssignmentInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import EditTableAction from "@/app/my-components/EditTableAction";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import TeacherServices from "@/app/Services/TeacherServices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LibraryBigIcon, PlusIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DivisionDetailsPage = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentCount, setAssignmentCount] = useState<number>(0);

  const getAllAssignments = async () => {
    try {
      const res = await TeacherServices.getAllAssignments({
        ...filters,
        ...pagination,
      });

      if (!res.data.status) {
        StandardErrorToast();
      }

      setAssignments(res.data.data.assignments);
      setAssignmentCount(res.data.data.assignmentCount);
    } catch (error) {
      console.error(error, "Could Not Get All Assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAssignments();
  }, [pagination, filters]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1">
          <LibraryBigIcon height={25} width={25} />
          <h1 className="text-2xl font-extrabold">Assignments</h1>
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
              onSelect={(val) =>
                setPagination({
                  ...pagination,
                  itemsPerPage: val ? parseInt(val) : 5,
                })
              }
            />
          </div>
          <Button onClick={() => router.push("/teacher/assignments/form")}>
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
              <TableHead>Subject</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments?.map((assignment, index) => (
              <TableRow
                className="cursor-pointer"
                key={assignment.id}
                onClick={() => router.push("/teacher/assignments/" + assignment.id)}
              >
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>{assignment.name}</TableCell>
                <TableCell>{assignment.subject.name}</TableCell>
                <TableCell>
                  {assignment.division.batch.course.abbr} &#40;{assignment.division.batch.year}&#41;
                </TableCell>
                <TableCell>{assignment.division.name}</TableCell>
                <TableCell>
                  <Badge className="bg-primary">
                    {moment(assignment.dueDate).format("DD MMM, YYYY")} at{" "}
                    {moment(assignment.dueDate).format("hh:mm a")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {assignment.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <EditTableAction
                      action={() => router.push("/teacher/assignments/form?assignmentId=" + assignment.id)}
                    />
                    <DeleteTableAction action={() => {}} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>

      <MyPagination show={!loading} itemCount={assignmentCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default DivisionDetailsPage;
