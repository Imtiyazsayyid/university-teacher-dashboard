import { useState, useEffect } from "react";
import TeacherServices from "@/app/Services/TeacherServices";
import StandardErrorToast from "@/app/extras/StandardErrorToast";
import { Teacher } from "@/app/interfaces/TeacherInterface";

const useTeacherDetails = () => {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [error, setError] = useState(false); // Track if an error occurred

  const getTeacherDetails = async () => {
    try {
      const res = await TeacherServices.getTeacherDetails();

      if (!res.data.status) {
        setError(true); // Set error state
        setCurrentTeacher(null); // Ensure the state is explicitly set to null
        StandardErrorToast("Failed to fetch teacher details.");
        return;
      }

      setCurrentTeacher(res.data.data); // Set valid teacher data
      setError(false); // Reset error state if data fetch succeeds
    } catch (error) {
      console.error("An error occurred while fetching teacher details:", error);
      setError(true); // Set error state
      setCurrentTeacher(null); // Explicitly set state to null on error
    }
  };

  useEffect(() => {
    getTeacherDetails();
  }, []);

  return currentTeacher;
};

export default useTeacherDetails;
