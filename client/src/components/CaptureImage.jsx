/* eslint-disable react/prop-types */
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import img from "../assets/img/Img-placeholder.png";

const videoConstraints = {
  width: 1280 / 3,
  height: 720 / 3,
  facingMode: "user",
};

const CaptureImage = ({ setImage }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(img);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setImgSrc(imageSrc);
    setImage(imageSrc);
  }, [webcamRef]);

  console.log(webcamRef);
  return (
    <div className="flex-center gap-2 flex-col">
      <div className="flex flex-gap p-4 gap-3">
        <Webcam
          audio={false}
          ref={webcamRef}
          className="rounded-xl"
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        {imgSrc && (
          <img
            className={`h-${720 / 3} w-${1280 / 3} rounded-xl `}
            src={imgSrc}
          />
        )}
      </div>

      <button onClick={capture} className="btn m-2">
        Capture photo
      </button>
    </div>
  );
};

export default CaptureImage;
