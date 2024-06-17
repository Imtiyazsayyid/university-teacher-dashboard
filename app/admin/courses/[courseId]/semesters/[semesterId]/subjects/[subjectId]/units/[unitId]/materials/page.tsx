"use client";

import AdminServices from "@/app/Services/AdminServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import { Course } from "@/app/interfaces/CourseInterface";
import { Semester } from "@/app/interfaces/SemesterInterface";
import { Subject } from "@/app/interfaces/SubjectInterface";
import { UnitMaterial } from "@/app/interfaces/UnitMaterialInterface";
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

import Form from "./Form";
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

const UnitMaterialsPage = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<Course>();
  const [semester, setSemester] = useState<Semester>();
  const [subject, setSubject] = useState<Subject>();
  const [unit, setUnit] = useState<Unit>();

  const [unitMaterials, setUnitMaterials] = useState<UnitMaterial[]>([]);
  const [unitMaterialsCount, setUnitMaterialsCount] = useState(0);

  const [filters, setFilters] = useState({
    searchText: "",
    unitMaterialTypeId: undefined as undefined | number,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const getAllUnitMaterials = async () => {
    setLoading(true);
    const res = await AdminServices.getAllUnitMaterials({ ...pagination, unitId: params.unitId, ...filters });

    if (!res.data.status) {
      StandardErrorToast();
    } else {
      setUnitMaterials(res.data.data.unitMaterials);
      setUnitMaterialsCount(res.data.data.unitMaterialsCount);
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

  const getSingleUnit = async () => {
    const res = await AdminServices.getSingleUnit(params.unitId);

    if (!res.data.status) {
      return;
    }

    setUnit(res.data.data);
  };

  const getPreview = (link: string) => {
    if (link.includes(".pdf")) {
      return (
        <a href={link} target="_blank">
          <img src="https://www.svgrepo.com/show/28209/pdf.svg" className="h-11 w-11" />
        </a>
      );
    } else if (link.includes(".mp4") || link.includes("//www.youtube.com/")) {
      return (
        <div className="max-w-10 h-10">
          <a href={link} target="_blank" className="max-w-10 h-10">
            <img
              src="https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-play-video-icon-graphic-design-template-vector-png-image_530837.jpg"
              className="rounded-xl h-full w-full object-cover"
            />
          </a>
        </div>
      );
    } else if (link.includes(".docx")) {
      const url = `https://view.officeapps.live.com/op/view.aspx?src=${link}&wdAccPdf=0&wdEmbedFS=1`;
      return (
        <a href={url} target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/.docx_icon.svg/1024px-.docx_icon.svg.png"
            alt=""
            className="w-10 h-10 rounded-xl object-cover"
          />
        </a>
      );
    } else if (link.includes(".xlsx")) {
      const url = `https://view.officeapps.live.com/op/view.aspx?src=${link}&wdAccPdf=0&wdEmbedFS=1`;
      return (
        <a href={url} target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/1101px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png"
            alt=""
            className="w-fit h-8 object-cover"
          />
        </a>
      );
    } else if (link.includes(".pptx")) {
      const url = `https://view.officeapps.live.com/op/view.aspx?src=${link}&wdAccPdf=0&wdEmbedFS=1`;
      return (
        <a href={url} target="_blank">
          <img
            src="https://images.freeimages.com/fic/images/icons/2795/office_2013_hd/2000/powerpoint.png"
            alt=""
            className="w-fit h-10 object-cover"
          />
        </a>
      );
    } else {
      return (
        <a href={link} target="_blank">
          <img src={link} alt="" className="w-10 h-10 rounded-xl object-cover" />
        </a>
      );
    }
  };

  useEffect(() => {
    getSingleCourse();
    getSingleSemester();
    getSingleSubject();
    getSingleUnit();
    getAllUnitMaterials();
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
              Unit {unit && unit.number} Materials {"-"} {subject && subject.name}
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
            unitNumber={unit?.number!}
            courseName={course?.name!}
            semNumber={semester?.semNumber!}
            subjectName={subject?.name!}
            subjectId={parseInt(params.subjectId)}
            unitId={parseInt(params.unitId)}
            refetch={getAllUnitMaterials}
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
              <TableHead>Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitMaterials?.map((unitMaterial, index) => (
              <TableRow className="cursor-pointer border" key={unitMaterial.id}>
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>

                <TableCell>
                  <div className="max-w-14">{getPreview(unitMaterial.link)}</div>
                </TableCell>
                <TableCell>{unitMaterial.name}</TableCell>
                <TableCell>
                  {unitMaterial.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Form
                      unitNumber={unit?.number!}
                      subjectName={subject?.name!}
                      subjectId={parseInt(params.subjectId)}
                      unitId={parseInt(params.unitId)}
                      currentUnitMaterial={unitMaterial}
                      courseName={course?.name!}
                      semNumber={semester?.semNumber!}
                      refetch={getAllUnitMaterials}
                    >
                      <div>
                        <EditTableAction />
                      </div>
                    </Form>
                    <div
                      className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-green-700 dark:hover:bg-green-800"
                      onClick={() => downloadFile(unitMaterial.link, unitMaterial.name)}
                    >
                      <DownloadIcon height={16} />
                    </div>
                    <DeleteTableAction
                      action={async () => {
                        await AdminServices.deleteUnitMaterial(unitMaterial.id);
                        await getAllUnitMaterials();
                        toast({
                          title: "Unit Material Deleted",
                          description: `'${unitMaterial.name}' was permanently deleted from this unit.`,
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
        itemCount={unitMaterialsCount}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default UnitMaterialsPage;
