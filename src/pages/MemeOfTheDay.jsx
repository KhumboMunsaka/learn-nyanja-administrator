import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./MemeOfTheDay.css";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
} from "ckeditor5";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

function MemeOfTheDay() {
  const [translation, setTranslation] = useState(``);
  const [selectedImage, setSelectedImage] = useState(null);
  const [memeDate, setMemeDate] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate.replace(/,/g, "");
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "mods"), {
        translation,
        memeDate,
      });
      handleImage();
      alert("Translation added successfully! Await the Meme To Be Processed");
    } catch (error) {
      console.error("Error adding Words: ", error);
    }
  };

  const handleImage = () => {
    const storage = getStorage();

    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    const fileName = `meme_of_the_day${memeDate}`;
    const storageRef = ref(storage, `mods/${fileName}`);

    uploadBytes(storageRef, selectedImage).then(() => {
      alert("The Meme has been uploaded successfully");
    });
  };

  return (
    <div className="meme-container">
      <h3 className="meme-title">Upload the Meme of the Day</h3>

      {selectedImage && (
        <div className="meme-preview">
          <img
            alt="Preview"
            className="meme-image"
            src={URL.createObjectURL(selectedImage)}
          />
          <div className="meme-editor">
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: {
                  items: ["undo", "redo", "|", "bold", "italic"],
                },
                plugins: [Bold, Essentials, Italic, Paragraph, Undo],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTranslation(data);
              }}
            />
            <h5 className="meme-date-label">Set Date</h5>
            <input
              type="date"
              className="meme-date-input"
              onChange={(e) => setMemeDate(formatDate(e.target.value))}
            />
          </div>
          <div className="meme-actions">
            <button className="meme-btn submit" onClick={handleSubmit}>
              Submit
            </button>
            <button
              className="meme-btn remove"
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        className="meme-file-input"
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
}

export default MemeOfTheDay;
