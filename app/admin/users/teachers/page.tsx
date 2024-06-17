"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Teacher } from "@/app/interfaces/TeacherInterface";
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
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";

const TeachersPage = () => {
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const [filters, setFilters] = useState({
    searchText: "",
  });

  const getAllTeachers = async () => {
    setLoading(true);

    const res = await AdminServices.getAllTeachers({
      ...filters,
      ...pagination,
    });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setTeachers(res.data.data.teachers);
      setTeachersCount(res.data.data.teacherCount);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllTeachers();
  }, [filters, pagination]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1">
          <LibraryBigIcon height={25} width={25} />
          <h1 className="text-2xl font-extrabold">Teachers</h1>
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
          <Button onClick={() => router.push("/admin/users/teachers/new")}>
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
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers?.map((teacher, index) => (
              <TableRow className="cursor-pointer" key={teacher.id}>
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary p-1">
                    <img
                      className="rounded-full h-full w-full object-cover"
                      src={
                        teacher.profileImg ||
                        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {teacher.firstName} {teacher.lastName}
                </TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Badge className="rounded-sm px-3 py-1" variant={"secondary"}>
                    {teacher.role.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  {teacher.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditTableAction action={() => router.push("/admin/users/teachers/" + teacher.id)} />
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteTeacher(teacher.id);
                        await getAllTeachers();
                        toast({
                          title: "Teacher Deleted",
                          description: `'${teacher.firstName} ${teacher.lastName}' was permanently deleted from all teachers.`,
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

      <MyPagination show={!loading} itemCount={teachersCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default TeachersPage;
