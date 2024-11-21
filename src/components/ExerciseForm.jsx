import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.config"; // Firebase configuration import
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"; // Firestore methods

function ExerciseForm() {
  // State to store questions, selected section, and selected lesson title
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      points: 10,
    },
  ]);
  const [section, setSection] = useState("");
  const [lessonTitles, setLessonTitles] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");

  const fetchLessonTitles = async (section) => {
    if (!section) return; // If no section is selected, return early
  };

  // Handle section change to fetch the relevant lessons
  const handleSectionChange = async (e) => {
    const selectedSection = e.target.value;
    console.log(selectedSection);
    setSection(selectedSection);

    try {
      // Reference the subcollection path: lessons/{section}/sublessons
      const sublessonsCollectionRef = collection(
        db,
        "lessons",
        selectedSection,
        "sublessons"
      );

      // Query all documents in the subcollection
      const querySnapshot = await getDocs(sublessonsCollectionRef);

      // Extract the document IDs (lesson titles in this case)
      const lessonTitles = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        lessonTitles.push(doc.id); // Add the document ID (title) to the array
      });

      // Update state with fetched lesson titles
      setLessonTitles(lessonTitles);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question, i) => {
        if (i === index) {
          if (field === "options") {
            // Update options field by splitting the comma-separated string
            return { ...question, options: value.split(",") };
          }
          return { ...question, [field]: value }; // Update other fields
        }
        return question;
      });
    });
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
        points: 10,
      },
    ]);
  };

  // Handle removing a question
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLesson || !section) {
      alert("Please select a lesson and section.");
      return;
    }

    const exerciseData = {
      questions,
    };

    try {
      // Reference the specific document in "sublessons"
      const lessonDocRef = doc(
        db,
        "lessons",
        section,
        "sublessons",
        selectedLesson
      );

      // Reference the "exercises" subcollection under the lesson document
      const exercisesCollectionRef = collection(lessonDocRef, "exercises");

      // Add the exercise data to the "exercises" subcollection
      await setDoc(doc(exercisesCollectionRef), exerciseData);

      alert("Exercise added successfully!");
      setSelectedLesson("");
      setSection("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctOption: 0,
          points: 10,
        },
      ]);
    } catch (error) {
      console.error("Error adding exercise: ", error);
      alert("Failed to add exercise. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Exercise</h3>

      {/* Section Dropdown */}
      <div>
        <label>For Which Section?</label>
        <select value={section} onChange={handleSectionChange}>
          <option value="">Select Section</option>
          <option value="nouns">Nouns</option>
          <option value="verbs">Verbs</option>
          <option value="adjectives">Adjectives</option>
          <option value="adverbs">Adverbs</option>
          <option value="pronouns">Pronouns</option>
          <option value="prepositions">Prepositions</option>
        </select>
      </div>

      {/* Lesson Title Dropdown */}
      <div>
        <label>Lesson Title</label>
        <select
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
          disabled={!section}
        >
          <option value="">Select Lesson</option>
          {lessonTitles.map((title, index) => (
            <option key={index} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* Questions Input */}
      <div>
        <h4>Questions</h4>
        {questions.map((question, index) => (
          <div key={index}>
            <div>
              <label>Question:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                placeholder="Enter question"
              />
            </div>

            <div>
              <label>Options (comma-separated):</label>
              <input
                type="text"
                value={question.options.join(",")}
                onChange={(e) =>
                  handleQuestionChange(index, "options", e.target.value)
                }
                placeholder="Enter options"
              />
            </div>

            <div>
              <label>Correct Option (0-3):</label>
              <input
                type="number"
                value={question.correctOption}
                onChange={(e) =>
                  handleQuestionChange(
                    index,
                    "correctOption",
                    Number(e.target.value)
                  )
                }
                min="0"
                max="3"
              />
            </div>

            <div>
              <label>Points:</label>
              <input
                type="number"
                value={question.points}
                onChange={(e) =>
                  handleQuestionChange(index, "points", Number(e.target.value))
                }
              />
            </div>

            <button type="button" onClick={() => handleRemoveQuestion(index)}>
              Remove Question
            </button>

            <hr />
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>
          Add Another Question
        </button>
      </div>

      <button type="submit">Submit Exercise</button>
    </form>
  );
}

export default ExerciseForm;
