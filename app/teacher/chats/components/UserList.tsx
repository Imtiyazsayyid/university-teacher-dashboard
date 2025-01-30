"use client";
import UserBox from "./UserBox";
import { Teacher } from "@/app/interfaces/TeacherInterface";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import TeacherServices from "@/app/Services/TeacherServices";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Teacher[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
  });

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await TeacherServices.getTeachersList({ ...filters });
      if (!res.data?.status) {
        StandardErrorToast();
        return [];
      }

      setUsers(res.data.data || []);
    } catch (error) {
      console.log("Error fetching Teachers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear the previous timeout to avoid redundant calls
    }

    // Set a new timeout for debouncing
    const newTimeout = setTimeout(() => {
      getAllUsers();
    }, 800); // Wait for 500ms after user stops typing

    setDebounceTimeout(newTimeout);

    return () => {
      clearTimeout(newTimeout); // Cleanup on unmount or dependency change
    };
  }, [filters.searchText]);

  return (
    <aside className="fixed w-[320px] lg:h-[700px] overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <div className="px-3">
        <div className="flex-col">
          <div className="dark:text-white text-2xl font-bold text-neutral-800 py-4">
            People
          </div>
          <div className="flex items-center w-full border mb-5 p-1 rounded-lg">
            <Input
              type="text"
              placeholder="Search"
              className="flex-1 border-none"
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-lg font-bold gap-4">
            <Loader size={20} className="animate-spin" /> Loading Users...
          </div>
        ) : (
          users.map((teacher) => (
            <UserBox key={teacher.firstName} teacher={teacher} />
          ))
        )}
      </div>
    </aside>
  );
};

export default UserList;
