"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Division } from "@/app/interfaces/DivisionInterface";
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
import { BookOpen, LibraryBigIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import { Loader } from "@/app/my-components/Loader";
import { Form } from "./Form";
import { Batch } from "@/app/interfaces/BatchInterface";

interface Props {
  params: {
    batchId: string;
  };
}

const DivisionsPage = ({ params }: Props) => {
  const router = useRouter();

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [divisionsCount, setDivisionsCount] = useState(0);
  const [batch, setBatch] = useState<Batch>();
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const [filters, setFilters] = useState({
    searchText: "",
  });

  const getAllDivisions = async () => {
    setLoading(true);

    const res = await AdminServices.getAllDivisions({
      batchId: params.batchId,
      ...filters,
      ...pagination,
    });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setDivisions(res.data.data.divisions);
      setDivisionsCount(res.data.data.divisionCount);
    }

    setLoading(false);
  };

  const getSingleBatch = async () => {
    setLoading(true);

    const res = await AdminServices.getSingleBatch(params.batchId);

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setBatch(res.data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllDivisions();
  }, [filters, pagination]);

  useEffect(() => {
    getSingleBatch();
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-1">
          <LibraryBigIcon height={25} width={25} />
          <h1 className="text-2xl font-extrabold">
            Divisions{" "}
            {batch && (
              <span>
                - {batch.course?.name} &#40;{batch.year}&#41;
              </span>
            )}
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
          <Form batchId={parseInt(params.batchId)} refetch={getAllDivisions}>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subject Teachers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {divisions?.map((division, index) => (
              <TableRow className="cursor-pointer" key={division.id}>
                <TableCell className="font-medium">{index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}</TableCell>
                <TableCell>Division {division.name}</TableCell>
                <TableCell>
                  {division.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div
                    className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-orange-500"
                    onClick={(e) => {
                      router.push(`/admin/batches/${params.batchId}/divisions/${division.id}/subject-teachers`);
                    }}
                  >
                    <BookOpen height={16} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Form batchId={division.batchId} name={division.name} refetch={getAllDivisions} status={division.status} divisionId={division.id}>
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditTableAction />
                      </div>
                    </Form>
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteDivision(division.id);
                        await getAllDivisions();
                        toast({
                          title: "Division Deleted",
                          description: `'${division.name}' was permanently deleted from all divisions.`,
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

      <MyPagination show={!loading} itemCount={divisionsCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default DivisionsPage;
