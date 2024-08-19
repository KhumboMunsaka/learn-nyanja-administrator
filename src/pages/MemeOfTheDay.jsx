import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

function MemeOfTheDay() {
  const [selectedImage, setSelectedImage] = useState(null);

  function handleImage() {
    const storage = getStorage();

    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    const storageRef = ref(storage, `mods/${selectedImage}${Date.now()}`);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, selectedImage).then((snapshot) => {
      console.log("Uploaded a blob or file!", selectedImage);
    });
  }
  return (
    <div>
      {/* Header */}
      <h1>Upload and Display Image</h1>
      <h3>using React Hooks</h3>

      {/* Conditionally render the selected image if it exists */}
      {selectedImage && (
        <div>
          {/* Display the selected image */}
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br /> <br />
          {/* Button to remove the selected image */}
          <button onClick={() => handleImage()}>submit</button>
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />

      {/* Input element to select an image file */}
      <input
        type="file"
        name="myImage"
        // Event handler to capture file selection and update the state
        onChange={(event) => {
          console.log(event.target.files[0]); //

          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
}

export default MemeOfTheDay;
