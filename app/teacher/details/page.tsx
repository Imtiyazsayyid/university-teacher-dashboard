"use client"
import React, { useEffect, useState } from 'react'
import TeacherProfileForm from './Form'
import { Teacher } from '@/app/interfaces/TeacherInterface';
import AdminServices from '@/app/Services/TeacherServices';
import StandardErrorToast from '@/app/extras/StandardErrorToast';

const TeacherPage = () => {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>();

  const getTeacherDetails = async () => {
    const res = await AdminServices.getTeacherDetails();

    if (!res.data.status) {
      StandardErrorToast();
      return;
    }

    setCurrentTeacher(res.data.data);
  };

  useEffect(() => {
    getTeacherDetails();
  }, []);

  return (
    <div>
        <TeacherProfileForm currentTeacher={currentTeacher}/>
    </div>
  )
  
};

export default TeacherPage
