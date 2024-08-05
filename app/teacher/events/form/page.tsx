"use client";

import StandardErrorToast from "@/app/extras/StandardErrorToast";
import StandardSuccessToast from "@/app/extras/StandardSuccessToast";
import { DateTimePicker } from "@/app/my-components/DateTimePicker";
import ErrorLabel from "@/app/my-components/ErrorLabel";
import GoBack from "@/app/my-components/GoBack";
import { MySelect } from "@/app/my-components/MySelect";
import TeacherServices from "@/app/Services/TeacherServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TicketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  searchParams: {
    eventId: string;
  };
}

const EventForm = ({ searchParams }: Props) => {
  const router = useRouter();

  const [event, setEvent] = useState({
    name: "",
    description: "",
    venue: "",
    eventFor: "all",
    datetime: new Date() as Date | undefined,
  });

  const [eventId, setEventId] = useState("");

  const handleSave = async () => {
    if (!event.name || !event.description || !event.datetime) {
      StandardErrorToast("Could Not Create Event", "Please Enter All Details For This Event");
      return;
    }

    try {
      const res = await TeacherServices.saveEvent({ ...event, eventId });

      if (!res.data.status) {
        StandardErrorToast(undefined, res.data.message);
      } else {
        StandardSuccessToast("Successfully Saved Event", "Your event has been saved successfully");
        router.push("/teacher/events");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSingleEvent = async () => {
    if (searchParams.eventId) {
      const res = await TeacherServices.getSingleEvent(searchParams.eventId);

      if (res.data.status) {
        const { name, description, datetime, venue, eventFor } = res.data.data;
        setEvent({ name, description, datetime: new Date(datetime), venue, eventFor });
      }
    }
  };

  useEffect(() => {
    if (searchParams.eventId) {
      setEventId(searchParams.eventId);
      getSingleEvent();
    }
  }, []);

  return (
    <div className="h-full w-full px-40">
      <div className="flex justify-center w-full items-center mt-32 mb-10 gap-3 h-fit">
        <GoBack />
        <TicketIcon height={50} width={50} />
        <h1 className="text-4xl font-extrabold">
          {event.name}
          {/* {currentCourse?.id ? "Edit" : "Add New"} Course {currentCourse && " - " + courseDetails.name} */}
        </h1>
      </div>

      <div className="flex flex-col gap-x-2 gap-y-10">
        <div className="flex flex-row gap-4 items-end justify-end">
          {/* <Switch
            checked={courseDetails.status}
            onCheckedChange={(val) => setCourseDetails({ ...courseDetails, status: val })}
          /> */}
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div className="flex-col flex gap-2 w-full">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Name</Label>
            <Input
              type="text"
              autoComplete="off"
              value={event.name}
              onChange={(e) => setEvent({ ...event, name: e.target.value })}
            />
          </div>
          <div className="flex-col flex gap-2 w-full">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Venue</Label>
            <Input
              type="text"
              autoComplete="off"
              value={event.venue}
              onChange={(e) => setEvent({ ...event, venue: e.target.value })}
            />
          </div>
          <div className="flex-col flex gap-2 w-full">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Who is this event For?</Label>
            <MySelect
              options={[
                { label: "All", value: "all" },
                { label: "Students", value: "students" },
                { label: "Teachers", value: "teachers" },
              ]}
              selectedItem={event.eventFor}
              onSelect={(val) =>
                setEvent({
                  ...event,
                  eventFor: val || "all",
                })
              }
            />
          </div>
          <div className="flex-col flex gap-2 w-fit">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Date & Time</Label>
            <DateTimePicker
              date={event.datetime}
              setDate={(val) => setEvent({ ...event, datetime: val })}
              className="w-full pr-14"
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Description</Label>
            <Textarea
              className="h-96 resize-none"
              autoComplete="off"
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 py-20">
        <Button className="w-96" variant={"outline"} onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="w-96" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
