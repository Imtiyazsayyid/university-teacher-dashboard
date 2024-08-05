"use client";

import itemsPerPageOptions from "@/app/extras/itemsPerPageOptions";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import StandardSuccessToast from "@/app/extras/StandardSuccessToast";
import { Event } from "@/app/interfaces/EventInterface";
import ConditionalDiv from "@/app/my-components/ConditionalDiv";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import EditTableAction from "@/app/my-components/EditTableAction";
import GoBack from "@/app/my-components/GoBack";
import { Loader } from "@/app/my-components/Loader";
import MyPagination from "@/app/my-components/MyPagination";
import { MySelect } from "@/app/my-components/MySelect";
import TeacherServices from "@/app/Services/TeacherServices";
import { setTeacherDetails, teacherDetails } from "@/app/store/Store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useAtom, useStore } from "jotai";
import {
  CalendarCheckIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  ClockIcon,
  LibraryBigIcon,
  NotebookPenIcon,
  PlusIcon,
  TicketIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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

  const [events, setEvents] = useState<Event[]>([]);
  const [requestedEvents, setRequestedEvents] = useState<Event[]>([]);

  const [eventCount, setEventCount] = useState<number>(0);
  const [teacher] = useAtom(teacherDetails);

  const [eventType, setEventType] = useState("all");

  const getAllEvents = async () => {
    try {
      const res = await TeacherServices.getAllEvents({
        ...filters,
        ...pagination,
        eventType,
      });

      if (!res.data.status) {
        StandardErrorToast();
      }

      setEvents(res.data.data.events);
      setEventCount(res.data.data.eventCount);
    } catch (error) {
      console.error(error, "Could Not Get All Events");
    } finally {
      setLoading(false);
    }
  };

  const getAllRequestedEvents = async () => {
    try {
      const res = await TeacherServices.getAllEvents({
        onlyRequested: true,
      });

      if (!res.data.status) {
        StandardErrorToast();
      }

      setRequestedEvents(res.data.data.events);
    } catch (error) {
      console.error(error, "Could Not Get All Requested Events");
    } finally {
      setLoading(false);
    }
  };

  const requestToOrganiseEvent = async (eventId: number) => {
    try {
      const res = await TeacherServices.joinEventOrganisers({ eventId });

      if (res.data.status) {
        StandardSuccessToast("Request Sent", "Your Request to Organise this event has been sent successfully");
        getAllEvents();
        return;
      }

      StandardErrorToast("Failed to Send Request", "Your Request to Organise this event has not been sent");
    } catch (error) {
      StandardErrorToast("Failed to Send Request", "Your Request to Organise this event has not been sent");
      console.error(error);
    }
  };

  const requestToParticipateInEvent = async (eventId: number) => {
    try {
      const res = await TeacherServices.participateInEvent({ eventId });

      if (res.data.status) {
        StandardSuccessToast("Request Sent", "Your Request to participate in this event has been sent successfully");
        getAllEvents();
        return;
      }

      StandardErrorToast("Failed to Send Request", "Your Request to participate in this event has not been sent");
    } catch (error) {
      StandardErrorToast("Failed to Send Request", "Your Request to participate in this event has not been sent");
      console.error(error);
    }
  };

  const getOrganisationStatus = (event: Event) => {
    const isTeacherOrganising = event.eventOrganisers.find((eo) => eo.teacherId === teacher?.id);
    const isTeacherHead = event.eventHeadId === teacher?.id;

    if (isTeacherHead) {
      return <></>;
    }

    if (isTeacherOrganising) {
      if (isTeacherOrganising?.approvalStatus === "pending")
        return (
          <Badge className="border flex w-fit p-1 gap-1 pr-3 pl-0 rounded-full hover:text-white bg-sky-600 hover:bg-sky-600">
            <ClockIcon height={16} /> Pending
          </Badge>
        );
      if (isTeacherOrganising?.approvalStatus === "approved")
        return (
          <Badge className="border flex w-fit p-1 gap-1 pr-3 pl-0 rounded-full hover:text-white bg-green-800 hover:bg-green-800">
            <CheckCircleIcon height={16} /> Approved
          </Badge>
        );
      if (isTeacherOrganising?.approvalStatus === "rejected")
        return (
          <Badge className="border flex w-fit p-1 gap-1 pl-0 pr-3 rounded-full hover:text-white bg-rose-800 hover:bg-rose-800">
            <XCircleIcon height={16} /> Rejected
          </Badge>
        );
    } else
      return (
        <div
          className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-violet-600"
          onClick={(e) => {
            e.stopPropagation();
            requestToOrganiseEvent(event.id);
          }}
        >
          <NotebookPenIcon height={16} />
        </div>
      );
  };

  const getParticipationStatus = (event: Event) => {
    const isTeacherParticipating = event.eventParticipants.find((eo) => eo.teacherId === teacher?.id);
    const isTeacherHead = event.eventHeadId === teacher?.id;

    if (isTeacherHead || event.eventFor === "students") {
      return <></>;
    }

    if (isTeacherParticipating) {
      return (
        <Badge className="border flex w-fit p-1 gap-1 pr-3 pl-0 rounded-full hover:text-white bg-green-800 hover:bg-green-800">
          <ClockIcon height={16} /> Registered
        </Badge>
      );
    } else
      return (
        <div
          className="border w-fit p-1 py-2 rounded-md hover:text-white hover:bg-violet-600"
          onClick={(e) => {
            e.stopPropagation();
            requestToParticipateInEvent(event.id);
          }}
        >
          <CalendarPlusIcon height={16} />
        </div>
      );
  };

  const getRequestedEventStatus = (event: Event) => {
    if (event?.approvalStatus === "pending")
      return (
        <Badge className="border flex w-fit p-1 gap-1 pr-3 pl-0 rounded-full hover:text-white bg-sky-600 hover:bg-sky-600">
          <ClockIcon height={16} /> Approval Pending
        </Badge>
      );
    if (event?.approvalStatus === "approved")
      return (
        <Badge className="border flex w-fit p-1 gap-1 pr-3 pl-0 rounded-full hover:text-white bg-green-800 hover:bg-green-800">
          <CheckCircleIcon height={16} /> Approved
        </Badge>
      );
    if (event?.approvalStatus === "rejected")
      return (
        <Badge className="border flex w-fit p-1 gap-1 pl-0 pr-3 rounded-full hover:text-white bg-rose-800 hover:bg-rose-800">
          <XCircleIcon height={16} /> Rejected
        </Badge>
      );
  };

  const handleSelectEventType = async (eventType: string) => {
    setEventType(eventType);
  };

  useEffect(() => {
    getAllEvents();
    getAllRequestedEvents();
  }, [pagination, filters, eventType]);

  const eventForMap = {
    all: "All",
    students: "Students",
    teachers: "Teachers",
  };

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      <div className="pt-5 pb-5 flex items-center gap-2">
        <GoBack />
        <div className="flex gap-2">
          <TicketIcon height={28} width={28} />
          <h1 className="text-2xl font-extrabold">Events</h1>
        </div>
      </div>
      <div className="flex w-full items-end justify-center">
        <div className="h-10 flex gap-3">
          <div
            className={`w-fit border h-full flex justify-center items-center rounded-full px-10 cursor-pointer ${
              eventType === "all" && "bg-primary border-none"
            }`}
            onClick={() => handleSelectEventType("all")}
          >
            All
          </div>

          <div
            className={`w-fit border h-full flex justify-center items-center rounded-full px-10 cursor-pointer ${
              eventType === "organised" && "bg-primary border-none"
            }`}
            onClick={() => handleSelectEventType("organised")}
          >
            Organised
          </div>

          <div
            className={`w-fit border h-full flex justify-center items-center rounded-full px-10 cursor-pointer ${
              eventType === "participated" && "bg-primary border-none"
            }`}
            onClick={() => handleSelectEventType("participated")}
          >
            Participated
          </div>
        </div>
      </div>
      <div className="flex w-full items-end justify-between">
        <div className="flex gap-2 items-end w-full">
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
          {requestedEvents.length > 0 && (
            <div>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Requested Events</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-stone-950">
                      <div className="min-w-96 p-5 flex-col gap-2">
                        {requestedEvents.map((re) => (
                          <div className="flex justify-between items-end pb-4 pt-4">
                            <h4 className="text-md font-bold">{re.name}</h4>
                            <div>{getRequestedEventStatus(re)}</div>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-end w-full max-w-sm">
          <div className="grid w-full items-center gap-1.5">
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
          <Button className="w-full" onClick={() => router.push("/teacher/events/form")}>
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
        className="border rounded-lg shadow-md h-full overflow-hidden overflow-y-scroll max-w-full overflow-x-auto bg-white dark:bg-[#111]"
      >
        <Table className="overflow-hidden max-w-full overflow-x-auto">
          <TableHeader className="bg-slate-50 dark:bg-[#151515]">
            <TableRow>
              <TableHead className="max-w-2">#</TableHead>
              <TableHead className="max-w-40">Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Event Head</TableHead>
              <TableHead>For</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Participation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event, index) => (
              <TableRow
                className="cursor-pointer"
                key={event.id}
                onClick={() => router.push("/teacher/events/" + event.id)}
              >
                <TableCell className="font-medium">
                  {index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage}
                </TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  <Badge className="bg-primary">
                    {moment(event.datetime).format("DD MMM, YYYY")} at {moment(event.datetime).format("hh:mm A")}
                  </Badge>
                </TableCell>

                <TableCell>{event?.venue}</TableCell>

                <TableCell>
                  {event.eventHead.firstName} {event.eventHead.lastName}
                </TableCell>

                <TableCell>{eventForMap[event?.eventFor]}</TableCell>

                <TableCell>{getOrganisationStatus(event)}</TableCell>

                <TableCell>{getParticipationStatus(event)}</TableCell>
                <TableCell>
                  {event.status ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-800 dark:bg-emerald-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-500 dark:bg-primary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {event.eventHeadId === teacher?.id && (
                    <div className="flex gap-2">
                      <EditTableAction action={() => router.push("/teacher/events/form?eventId=" + event.id)} />
                      <DeleteTableAction
                        action={async () => {
                          await TeacherServices.deleteEvent(event.id);
                          await getAllEvents();
                          toast({
                            title: "Event Deleted",
                            description: `'${event.name}' was permanently deleted.`,
                            action: <TrashIcon className="text-red-500 h-5 w-5" />,
                          });
                        }}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConditionalDiv>

      <MyPagination show={!loading} itemCount={eventCount} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default DivisionDetailsPage;
