import React from "react";
import QuizForm from "../Form";

interface Props {
  params: {
    unitId: number;
  };
}

const NewQuizPage = ({ params }: Props) => {
  return (
    <div>
      <QuizForm unitId={params.unitId} />
    </div>
  );
};

export default NewQuizPage;
