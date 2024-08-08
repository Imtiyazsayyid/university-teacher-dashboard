"use client";

import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Assignment } from "@/app/interfaces/AssignmentInterface";
import { Student } from "@/app/interfaces/StudentInterface";
import AssignmentStatusBadge from "@/app/my-components/AssignmentStatusBadge";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LibraryBigIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    assignmentId: string;
  };
}

const AssignmentDetailsPage = ({ params }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [assignment, setAssignment] = useState<Assignment>();
  const router = useRouter();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const [loading, setLoading] = useState(true);

  const getAllStudentsByAssignment = async () => {
    try {
      const res = await TeacherServices.getStudentsByAssignment(params.assignmentId, filters);

      if (!res.data.status) {
        StandardErrorToast();
      }

      setStudents(res.data.data.students);
      setStudentCount(res.data.data.studentCount);
    } catch (error) {
      console.error(error, "Could Not Get All Students");
    } finally {
      setLoading(false);
    }
  };

  const getSingleAssignment = async () => {
    try {
      const res = await TeacherServices.getSingleAssignment(params.assignmentId);

      if (!res.data.status) {
        StandardErrorToast();
      }

      setAssignment(res.data.data);
    } catch (error) {
      console.error(error, "Could Not Get Assignment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleAssignment();
  }, []);

  useEffect(() => {
    getAllStudentsByAssignment();
  }, [pagination, filters]);

  if (!assignment) return;

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1 w-full">
          <LibraryBigIcon height={25} width={25} />
          <div className="flex w-full justify-between">
            <h1 className="text-2xl font-extrabold">{assignment?.name} Assignment Responses</h1>
            <div>
              <Badge>
                Due on {moment(assignment?.dueDate).format("DD MMM, YYYY")} at{" "}
                {moment(assignment?.dueDate).format("hh:mm A")}
              </Badge>
            </div>
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
              onSelect={(val) =>
                setPagination({
                  ...pagination,
                  itemsPerPage: val ? parseInt(val) : 5,
                })
              }
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
              <TableHead>Profile</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student, index) => (
              <TableRow
                className="cursor-pointer"
                key={student.id}
                onClick={() => {
                  if (student.submittedAssignments && student.submittedAssignments[0]) {
                    router.push(`/teacher/assignments/${assignment.id}/show/${student.submittedAssignments[0].id}`);
                  }
                }}
              >
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary p-1">
                    <img
                      className="rounded-full h-full w-full object-cover"
                      src={
                        student.profileImg ||
                        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>

                <TableCell>
                  <AssignmentStatusBadge
                    isSubmitted={student.submittedAssignments[0] ? true : false}
                    dueDate={assignment?.dueDate}
                  />
                </TableCell>

                <TableCell>
                  {student.submittedAssignments[0] && (
                    <Badge className="bg-orange-800">
                      {moment(student.submittedAssignments[0].created_at).format("DD MMM, YYYY")} at{" "}
                      {moment(student.submittedAssignments[0].created_at).format("hh:mm A")}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>

      <MyPagination show={!loading} itemCount={studentCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default AssignmentDetailsPage;
