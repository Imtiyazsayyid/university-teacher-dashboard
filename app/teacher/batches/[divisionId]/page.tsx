"use client";

import { Student } from "@/app/interfaces/StudentInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MySelect } from "@/app/my-components/MySelect";
import { Button } from "@/components/ui/button";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { useRouter } from "next/navigation";
import { Division } from "@/app/interfaces/DivisionInterface";

interface Props {
  params: {
    divisionId: string;
  };
}

const DivisionDetailsPage = ({ params }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [division, setDivision] = useState<Division>();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });
  const [filters, setFilters] = useState({
    searchText: "",
  });
  const [loading, setLoading] = useState(true);

  const getCurrentDivision = async () => {
    try {
      const res = await TeacherServices.getSingleDivision(params.divisionId);

      if (!res.data.status) {
        StandardErrorToast();
      }

      setDivision(res.data.data);
    } catch (error) {
      console.error(error, "Could Not Get Current Division");
    } finally {
      setLoading(false);
    }
  };

  const getAllStudentsByDivision = async () => {
    try {
      const res = await TeacherServices.getAllStudents({
        divisionId: parseInt(params.divisionId),
        ...filters,
      });

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

  useEffect(() => {
    getCurrentDivision();
  }, []);

  useEffect(() => {
    getAllStudentsByDivision();
  }, [pagination, filters]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1">
          <LibraryBigIcon height={25} width={25} />
          <h1 className="text-2xl font-extrabold">
            {division?.batch.course.abbr} &#40;{division?.batch.year}&#41; - Division {division?.name}
          </h1>
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
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student, index) => (
              <TableRow className="cursor-pointer" key={student.id}>
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

                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.status ? (
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

      <MyPagination show={!loading} itemCount={studentCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default DivisionDetailsPage;
