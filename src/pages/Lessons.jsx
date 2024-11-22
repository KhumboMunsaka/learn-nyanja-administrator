import { useState } from "react";
import LessonForm from "../components/LessonForm";
import ExerciseForm from "../components/ExerciseForm";
import styles from "../styles/Lessons.module.css";
function Lessons() {
  const [addExercise, setAddExercise] = useState(false);
  return (
    <div className={styles.lessonsContainer}>
      <button onClick={() => setAddExercise(!addExercise)}>
        {addExercise ? "Add Lesson Instead?" : "Add Exercise Instead?"}
      </button>
      {!addExercise ? <LessonForm /> : <ExerciseForm />}
    </div>
  );
}

export default Lessons;
