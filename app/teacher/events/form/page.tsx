"use client";

import StandardErrorToast from "@/app/extras/StandardErrorToast";
import StandardSuccessToast from "@/app/extras/StandardSuccessToast";
import { Batch } from "@/app/interfaces/BatchInterface";
import { Course } from "@/app/interfaces/CourseInterface";
import { Combobox } from "@/app/my-components/Combobox";
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
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EventForm = () => {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>();
  const [batches, setBatches] = useState<Batch[]>();
  const [eventId, setEventId] = useState("");
  const searchParams = useSearchParams();
  const searchParamEventId = searchParams.get("eventId");

  const [event, setEvent] = useState({
    name: "",
    description: "",
    venue: "",
    eventFor: "all",

    courseId: null as number | null,
    batchId: null as number | null,
    datetime: new Date() as Date | undefined,
    finalRegistrationDate: new Date() as Date | undefined,
  });

  const handleSave = async () => {
    if (
      !event.name ||
      !event.description ||
      !event.datetime ||
      !event.finalRegistrationDate ||
      !event.batchId ||
      !event.courseId
    ) {
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
    if (searchParamEventId) {
      const res = await TeacherServices.getSingleEvent(searchParamEventId);

      if (res.data.status) {
        const { name, description, datetime, venue, eventFor, courseId, batchId, finalRegistrationDate } =
          res.data.data;

        setEvent({
          name,
          description,
          datetime: new Date(datetime),
          venue,
          eventFor,
          courseId,
          batchId,
          finalRegistrationDate: finalRegistrationDate ? new Date(finalRegistrationDate) : new Date(),
        });
      }
    }
  };

  useEffect(() => {
    if (searchParamEventId) {
      setEventId(searchParamEventId);
      getSingleEvent();
    }
  }, []);

  const getAllCourses = async () => {
    const res = await TeacherServices.getAllCourses();
    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCourses(res.data.data.courses);
  };

  const getAllBatches = async () => {
    const res = await TeacherServices.getAllBatches();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setBatches(res.data.data.batches);
  };

  useEffect(() => {
    getAllBatches();
    getAllCourses();
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

          {event.datetime && (
            <div className="flex-col flex gap-2 w-full">
              <Label className="text-xs text-gray-700 dark:text-gray-500">Final Registration Date</Label>
              <DateTimePicker
                date={event.finalRegistrationDate}
                setDate={(val) => {
                  if (moment(val).isAfter(moment(event.datetime))) {
                    StandardErrorToast(
                      "Invalid Final Registration Date",
                      "Cannot Set Final Registration Date To Be after Event Date"
                    );
                    return;
                  }
                  setEvent({ ...event, finalRegistrationDate: val });
                }}
                className="w-full pr-14"
              />
            </div>
          )}
        </div>

        <div className="flex flex-row gap-4 items-end">
          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Course</Label>
            {/* <ErrorLabel errorMessage={errors.courseId} /> */}
            <Combobox
              clearable
              className="w-full"
              options={
                courses?.map((course) => ({
                  label: course.name,
                  value: course.id.toString(),
                })) || []
              }
              value={event.courseId?.toString() || ""}
              onSelect={(val) =>
                setEvent({
                  ...event,
                  courseId: val ? parseInt(val) : null,
                  batchId: null,
                })
              }
            />
          </div>

          <div className="w-full flex-col flex gap-2">
            <Label className="text-xs text-gray-700 dark:text-gray-500">Batch</Label>
            {/* <ErrorLabel errorMessage={errors.batchId} /> */}
            <Combobox
              disabled={event.courseId ? false : true}
              clearable
              className="w-full"
              options={
                batches
                  ?.filter((b) => b.courseId === event.courseId)
                  .map((b) => ({
                    label: `${b.course.name} (${b.year})`,
                    value: b.id.toString(),
                  })) || []
              }
              value={event.batchId?.toString() || ""}
              onSelect={(val) =>
                setEvent({
                  ...event,
                  batchId: val ? parseInt(val) : null,
                })
              }
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
