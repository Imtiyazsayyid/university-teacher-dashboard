"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Course } from "@/app/interfaces/CourseInterface";
import { StudentDocument } from "@/app/interfaces/StudentDocumentInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import EditTableAction from "@/app/my-components/EditTableAction";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form } from "./Form";

interface Props {
  params: {
    courseId: string;
  };
}

const StudentDocumentsPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>([]);
  const [studentDocumentsCount, setStudentDocumentsCount] = useState(0);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllStudentDocuments = async () => {
    setLoading(true);
    const res = await AdminServices.getAllStudentDocuments({ ...pagination, courseId: params.courseId, showAll: true });

    if (!res.data.status) {
      StandardErrorToast();
      return;
    } else {
      setStudentDocuments(res.data.data.studentDocuments);
      setStudentDocumentsCount(res.data.data.studentDocumentCount);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllStudentDocuments();
  }, [pagination]);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className=" flex w-full items-end justify-between">
        <div className="pt-5 pb-5 flex items-center gap-2">
          <GoBack />
          <div className="flex gap-1">
            <LibraryBigIcon height={25} width={25} />
            <h1 className="text-2xl font-extrabold">Student Documents</h1>
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
          <Form refetch={getAllStudentDocuments}>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentDocuments?.map((studentDocument, index) => (
              <TableRow className="cursor-pointer" key={studentDocument.id}>
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>{studentDocument.name}</TableCell>
                <TableCell>
                  {studentDocument.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Form
                      refetch={getAllStudentDocuments}
                      studentDocumentId={studentDocument.id}
                      name={studentDocument.name}
                      status={studentDocument.status}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditTableAction />
                      </div>
                    </Form>
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteStudentDocument(studentDocument.id);
                        await getAllStudentDocuments();
                        toast({
                          title: "Student Document Deleted",
                          description: `'Student Document ${studentDocument.name}' was permanently deleted from this course.`,
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

      <MyPagination
        show={!loading}
        itemCount={studentDocumentsCount}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default StudentDocumentsPage;
