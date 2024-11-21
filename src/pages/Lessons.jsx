import { useState } from "react";
import LessonForm from "../components/LessonForm";
import ExerciseForm from "../components/ExerciseForm";

function Lessons() {
  const [addExercise, setAddExercise] = useState(false);
  return (
    <div>
      <div>
        <button onClick={() => setAddExercise(!addExercise)}>
          {addExercise ? "Add Lesson?" : "Add Exercise?"}
        </button>
      </div>

      {!addExercise ? <LessonForm /> : <ExerciseForm />}
    </div>
  );
}

export default Lessons;
