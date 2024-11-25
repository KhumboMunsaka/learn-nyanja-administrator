import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Bold, Essentials, Italic, Paragraph } from "ckeditor5";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import "../styles/Ckeditor.css";
import styles from "../styles/LessonForm.module.css";
import SpinnerItem from "./SpinnerItem";

function LessonForm() {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [lessonText, setLessonText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!title || !section || !lessonText) {
      alert("Please fill in all fields");
      return;
    }

    setShowModal(true); // Show modal for confirmation
  };

  const handleConfirm = async () => {
    try {
      const sublessonsCollectionRef = collection(
        db,
        "lessons",
        section,
        "sublessons"
      );
      setIsLoading(false);

      const lessonDocRef = doc(sublessonsCollectionRef, title);

      await setDoc(lessonDocRef, {
        title,
        text: lessonText,
        timestamp: new Date(),
      });

      alert("Lesson added successfully!");
      setTitle("");
      setSection("");
      setLessonText("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding lesson: ", error);
      alert("Failed to add lesson. Try again.");
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h3>Add a Lesson</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.lessonTitle}>
          <label htmlFor="title">Lesson Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <label>For Which Section?</label>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Select Section</option>
            <option value="nouns">Nouns</option>
            <option value="adjectives">Adjectives</option>
            <option value="verbs">Verbs</option>
            <option value="verbsextensions">Verbs Extensions</option>
            <option value="pronouns">Pronouns</option>
            <option value="conjunctions">Conjunctions</option>
            <option value="questions">Questions</option>
          </select>
        </div>
        <div className={styles.lessonText}>
          <label>Enter Lesson Text</label>
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: {
                items: ["undo", "redo", "|", "bold", "italic"],
              },
              plugins: [Essentials, Paragraph, Bold, Italic],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setLessonText(data);
            }}
          />
          <button type="submit" className={styles.submitLesson}>
            {!isLoading ? "Submit Lesson" : <SpinnerItem />}
          </button>
        </div>
      </form>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Confirm Lesson Details</h4>
            <p>
              <strong>Title:</strong> {title}
            </p>
            <p>
              <strong>Section:</strong> {section}
            </p>
            <p>
              <strong>Lesson Text:</strong>
            </p>
            <div dangerouslySetInnerHTML={{ __html: lessonText }} />
            <div className={styles.modalActions}>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                Confirm
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonForm;
