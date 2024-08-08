"use client";

import { atom, createStore } from "jotai";
import { Teacher } from "../interfaces/TeacherInterface";
import TeacherServices from "../Services/TeacherServices";

const store = createStore();

// Vairables
export const teacherDetails = atom<Teacher>();

// Setters
export const setTeacherDetails = atom(null, async (get, set) => {
  const res = await TeacherServices.getTeacherDetails();
  if (res.data.status) {
    set(teacherDetails, res.data.data);
  }
});

export default store;
