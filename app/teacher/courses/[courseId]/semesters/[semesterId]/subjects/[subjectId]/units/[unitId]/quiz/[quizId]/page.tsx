import React from "react";
import QuizForm from "../Form";

interface Props {
  params: {
    unitId: number;
    quizId: number;
  };
}

const EditQuizPage = ({ params }: Props) => {
  return <QuizForm unitId={params.unitId} quizId={params.quizId} />;
};

export default EditQuizPage;
