/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

/* eslint-disable no-unused-vars */
const UploadFile = ({ setImage }) => {
  const [imgUpload, setImgUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [userInputImage, setUserInputImage] = useState(null);

  const imageFolderRef = ref(storage, "images/");

  const handleUpload = () => {
    console.log("Uploading image", imgUpload);
    if (imgUpload === null) return;

    console.log("Uploading image", imgUpload.name);
    const ImageRef = ref(storage, `checkImg/${imgUpload.name + v4()} `);

    uploadBytes(ImageRef, imgUpload).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
      getDownloadURL(snapshot.ref).then((url) => {
        setUserInputImage(url);
      });
    });
  };

  useEffect(() => {
    console.log("Use Effect Called");
    listAll(imageFolderRef).then((res) => {
      setImageList([]);
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
      console.log("Image List", imageList);
    });
  }, [userInputImage]);

  function verifyFaces() {
    console.log("Verify Func Called");
    fetch("http://localhost:5000/fetchImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageList: imageList,
        userImage: userInputImage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        response.json();
      })
      .then((data) => {
        console.log("Image ", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Upload file
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImgUpload(e.target.files[0]);
        }}
      />

      <button
        className="btn-primary bg-dark-300 text-white p-2 rounded-xl m-2"
        onClick={handleUpload}
      >
        Upload Image
      </button>

      <button className="bg-gray-300 p-2 m-8 rounded-2xl" onClick={verifyFaces}>
        Verify
      </button>
    </div>
  );
};

export default UploadFile;
