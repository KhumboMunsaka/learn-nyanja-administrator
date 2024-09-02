import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./MemeOfTheDay.css";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
  verifyLicense,
} from "ckeditor5";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

function MemeOfTheDay() {
  const [translation, setTranslation] = useState(``);
  const [selectedImage, setSelectedImage] = useState(null);
  const [memeDate, setMemeDate] = useState(null);
  // Function to format the date as "Wed 21 Aug 2024"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "short", // e.g., "Wed"
      day: "numeric", // e.g., "21"
      month: "short", // e.g., "Aug"
      year: "numeric", // e.g., "2024"
    });
    return formattedDate.replace(/,/g, ""); // Removes commas from the formatted date
  };
  console.log(memeDate);
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
  function handleImage() {
    const storage = getStorage();

    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    const fileName = `meme_of_the_day${memeDate}`; // Unique file name using the word and a timestamp
    const storageRef = ref(storage, `mods/${fileName}`);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, selectedImage).then((snapshot) => {
      alert("The Meme has been uploaded successfully");
    });
  }
  console;
  return (
    <div>
      {/* Header */}
      <h3>Upload the meme of the day</h3>

      {/* Conditionally render the selected image if it exists */}
      {selectedImage && (
        <>
          <div>
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            <br /> <br />
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: {
                  items: ["undo", "redo", "|", "bold", "italic"],
                },
                plugins: [Bold, Essentials, Italic, Paragraph, Undo],
                initialData: "Put in the translation you have",
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTranslation(data);
              }}
            />
            <h5>Set Date</h5>
            <input
              type="date"
              onChange={(e) => setMemeDate(formatDate(e.target.value))}
            />
            <button onClick={() => handleSubmit()}>submit</button>
            <button onClick={() => setSelectedImage(null)}>Remove</button>
          </div>
        </>
      )}

      <br />

      {/* Input element to select an image file */}
      <input
        type="file"
        name="myImage"
        // Event handler to capture file selection and update the state
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
}

export default MemeOfTheDay;
