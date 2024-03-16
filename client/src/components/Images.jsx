/* eslint-disable react/prop-types */
import Image from "./Image";
import { saveAs } from "file-saver";

import img from "../assets/img/Img-placeholder.png";
const Images = ({ download, array }) => {
  const list = array || [];

  const handleDownload = (path) => {
    console.log("Path", path);
    saveAs(path, "image.jpg");
  };

  return (
    <div className="my-4 ml-10 p-3">
      <h2 className=" h2-semibold text-center m-4">Your Images</h2>
      <div className="flex flex-wrap gap-2">
        {list.map((item, i) => {
          const imgpath = `../../${item}`;
          return (
            <div key={i} className="flex-center gap-1 flex-col">
              {/* <Image url={imgpath} styles="h-50 w-50 rounded-xl" /> */}
              <div
                className={`h-50 w-50 rounded-xl bg-auto bg-[url(${
                  imgpath || img
                })]`}
                src={imgpath || img}
              />
              <p>{imgpath}</p>
              {download && (
                <button className="btn" onClick={() => handleDownload(imgpath)}>
                  Download
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Images;
