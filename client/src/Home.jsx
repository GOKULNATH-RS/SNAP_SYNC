/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import UserForm from "./components/UserForm";
import Images from "./components/Images";

const Home = () => {
  const [image, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/fetchImages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Path: "../db/gokul_2.jpg",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setImages(data);
        console.log("Image ", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  console.log(image?.images);
  return (
    <div>
      <h1 className="h1-bold m-4 text-center pt-10">
        Get Your Images Instantly
      </h1>
      <UserForm />
      <Images download array={image?.images} />
    </div>
  );
};

export default Home;
