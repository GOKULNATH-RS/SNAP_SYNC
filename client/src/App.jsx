import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  // useEffect(() => {
  //   fetch(`http://localhost:5000/fetchImages`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       Path: "../db/gokul_2.jpg",
  //     }),
  //   })
  //     .then((response) => {
  //       console.log(response);
  //       response.text();
  //     })
  //     .then((data) => {
  //       setImages(data?.imagePaths);
  //       console.log("Image ", image);
  //     });
  // }, []);

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
