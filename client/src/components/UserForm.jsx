/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import CaptureImage from "./CaptureImage";
import UploadFile from "./UploadFile";

const UserForm = ({ setImages }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  return (
    <div className="flex-center flex-col">
      <div className="flex gap-4 p-4">
        <input
          type="text"
          placeholder="Enter your Name"
          className="shadow-inner h-10 px-2 p-4 bg-white rounded-xl"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Event Pass ID"
          className="shadow-inner h-10 px-2 p-4 bg-white rounded-xl"
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <UploadFile setImage={setImages} />
      <p className="body-regular">or</p>
      <CaptureImage setImage={setImages} />
    </div>
  );
};

export default UserForm;
