"use client";

import { Event } from "@/app/interfaces/EventInterface";
import TeacherServices from "@/app/Services/TeacherServices";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai";
import { teacherDetails } from "@/app/store/Store";
import { MySelect } from "@/app/my-components/MySelect";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardSuccessToast from "@/app/extras/StandardSuccessToast";
import DeleteTableAction from "@/app/my-components/DeleteTableActions";
import { toast } from "@/components/ui/use-toast";
import { TrashIcon } from "lucide-react";
import GoBack from "@/app/my-components/GoBack";

interface Props {
  params: {
    eventId: string;
  };
}

const EventDetailsPage = ({ params }: Props) => {
  const [event, setEvent] = useState<Event>();
  const [teacher] = useAtom(teacherDetails);

  const getSingleEvent = async () => {
    try {
      const res = await TeacherServices.getSingleEvent(params.eventId);

      let event: Event = res.data.data;
      if (event.eventHeadId !== teacher?.id) {
        event = { ...event, eventOrganisers: event.eventOrganisers.filter((eo) => eo.approvalStatus === "approved") };
      }

      setEvent(event);
    } catch (error) {
      console.error({ error });
    }
  };

  const setApprovalStatus = async (val: "pending" | "approved" | "rejected", teacherId: number) => {
    try {
      const res = await TeacherServices.setEventOrganiserApprovalStatus({
        eventId: event?.id,
        approvalStatus: val,
        teacherId,
      });

      if (res.data.status) {
        StandardSuccessToast("Approval Status Set", `This Teachers Approval Status Has been set to ${val}`);
        getSingleEvent();
      } else {
        StandardErrorToast("Failed to Set Approval Status", `This Teachers Approval Status Has not been changed.`);
      }
    } catch (error) {
      console.error({ error });
      StandardErrorToast("Failed to Set Approval Status", `This Teachers Approval Status Has not been changed.`);
    }
  };

  useEffect(() => {
    getSingleEvent();
  }, [teacher]);

  return (
    <div className="h-full w-full p-20">
      <div className="flex justify-between items-end">
        <div className="flex items-center mb-3">
          <GoBack />
          <h1 className="text-3xl font-bold">
            {event?.name} By {event?.eventHead?.firstName} {event?.eventHead?.lastName}
          </h1>
        </div>
        <Badge>
          {moment(event?.datetime).format("DD MMM, YYYY")} at {moment(event?.datetime).format("hh:mm A")}
        </Badge>
      </div>

      <p className="text-md text-stone-200 mb-10">{event?.description}</p>

      <Tabs defaultValue="organisers" className="w-1/2">
        <TabsList className="rounded-xl bg-stone-900 gap-1">
          <TabsTrigger value="organisers" className="rounded-xl">
            Organisers
          </TabsTrigger>
          <TabsTrigger value="participants" className="rounded-xl">
            Participants
          </TabsTrigger>
        </TabsList>
        <TabsContent value="organisers">
          {event?.eventOrganisers.length === 0 && (
            <p className="text-md text-stone-400 ml-1 mt-4">No Organisers Yet.</p>
          )}
          {event?.eventOrganisers && event.eventOrganisers.length > 0 && (
            <div className="rounded-xl mb-20">
              {/* <h1 className="text-2xl text-white font-bold mb-4">Organisers</h1> */}

              <div className="border rounded-lg shadow-md h-full overflow-hidden overflow-y-scroll bg-white dark:bg-[#111]">
                <Table className="bg-slate-50 dark:bg-[#151515]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">#</TableHead>
                      <TableHead>Name</TableHead>
                      {event.eventHeadId === teacher?.id && (
                        <TableHead className="w-[300px]">Approval Status</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event?.eventOrganisers.map((eo, index) => (
                      <TableRow key={eo.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          {eo.teacher.firstName} {eo.teacher.lastName}
                        </TableCell>
                        {event.eventHeadId === teacher?.id && (
                          <TableCell>
                            <MySelect
                              options={[
                                { label: "Pending", value: "pending" },
                                { label: "Approved", value: "approved" },
                                { label: "Rejected", value: "rejected" },
                              ]}
                              selectedItem={eo.approvalStatus}
                              onSelect={(val) => setApprovalStatus(val as any, eo.teacher.id)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="participants">
          {event?.eventParticipants.length === 0 && (
            <p className="text-md text-stone-400 ml-1 mt-4">No Participants Yet.</p>
          )}
          {event?.eventParticipants && event.eventParticipants.length > 0 && (
            <div className="rounded-xl">
              <div className="border rounded-lg shadow-md h-full overflow-hidden overflow-y-scroll bg-white dark:bg-[#111]">
                <Table className="bg-slate-50 dark:bg-[#151515]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/6">#</TableHead>
                      <TableHead className="w-4/6">Name</TableHead>
                      <TableHead className="w-1/6">Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event?.eventParticipants.map((ep, index) => (
                      <TableRow key={ep.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          {ep.studentId
                            ? `${ep.student?.firstName} ${ep.student?.lastName}`
                            : `${ep.teacher?.firstName} ${ep.teacher?.lastName}`}
                        </TableCell>
                        <TableCell className="font-medium">
                          {(ep.event.eventHeadId === teacher?.id || ep.teacherId === teacher?.id) && (
                            <DeleteTableAction
                              action={async () => {
                                await TeacherServices.removeFromEvent(ep.id);
                                await getSingleEvent();
                                toast({
                                  title: "Participant Removed",
                                  description: `This participant was removed from your event`,
                                  action: <TrashIcon className="text-red-500 h-5 w-5" />,
                                });
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetailsPage;
