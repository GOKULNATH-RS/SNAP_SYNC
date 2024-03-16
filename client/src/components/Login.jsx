import { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const formFields = [
    { label: "Username", name: "username", setValue: setUserName },
    { label: "Password", name: "password", setValue: setPassword },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen m-10 p-4 flex items-center flex-col gap-4">
      <h1 className="h2-semibold my-4 text-center">Login</h1>
      <form className="flex-center flex-col ml-10" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="flex flex-col pl-4 h3-semibold">
              {field.label}
            </label>
            <input
              type={field.name === "password" ? "password" : "text"}
              id={field.name}
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              className="shadow-inner h-14 w-96 px-2 mb-5 p-4 bg-white rounded-xl m-2"
            />
          </div>
        ))}
      </form>
      <button
        type="submit"
        className="p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
