import React from "react";

const HomePage = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-xl ">
        <h1 className="text-4xl font-semibold">
          Hello
          <span className="text-purple-600 font-bold ml-2 text-5xl">
            Teacher
          </span>
        </h1>
        <p className="text-lg text-gray-700 text-center">
          Welcome to{" "}
          <span className="font-semibold text-purple-500">Classifi</span> — your
          all-in-one platform for managing assignments, quizzes, attendance, and
          more.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
