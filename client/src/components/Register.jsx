import { useState } from "react";
import UploadFile from "./UploadFile";

const Register = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventOrganizer, setEventOrganizer] = useState("");
  const [eventOrganizerPhone, setEventOrganizerPhone] = useState("");
  const [eventOrganizerEmail, setEventOrganizerEmail] = useState("");
  const [eventOrganizerWebsite, setEventOrganizerWebsite] = useState("");
  const [eventOrganizerSocialMedia, setEventOrganizerSocialMedia] =
    useState("");

  const formFields = [
    {
      label: "Event Name",
      type: "text",
      placeholder: "Event Name",
      value: eventName,
      setValue: setEventName,
    },
    {
      label: "Event Description",
      type: "textarea",
      placeholder: "Event Description",
      value: eventDescription,
      setValue: setEventDescription,
    },
    {
      label: "Event Date",
      type: "date",
      placeholder: "Event Date",
      value: eventDate,
      setValue: setEventDate,
    },
    {
      label: "Event Time",
      type: "time",
      placeholder: "Event Time",
      value: eventTime,
      setValue: setEventTime,
    },
    {
      label: "Event Location",
      type: "text",
      placeholder: "Event Location",
      value: eventLocation,
      setValue: setEventLocation,
    },
    {
      label: "Event Organizer",
      type: "text",
      placeholder: "Event Organizer",
      value: eventOrganizer,
      setValue: setEventOrganizer,
    },
    {
      label: "Event Organizer Phone",
      type: "number",
      placeholder: "Event Organizer Phone",
      value: eventOrganizerPhone,
      setValue: setEventOrganizerPhone,
    },
    {
      label: "Event Organizer Email",
      type: "text",
      placeholder: "Event Organizer Email",
      value: eventOrganizerEmail,
      setValue: setEventOrganizerEmail,
    },
    {
      label: "Event Organizer Website",
      type: "text",
      placeholder: "Event Organizer Website",
      value: eventOrganizerWebsite,
      setValue: setEventOrganizerWebsite,
    },
    {
      label: "Event Organizer Social Media",
      type: "text",
      placeholder: "Event Organizer Social Media",
      value: eventOrganizerSocialMedia,
      setValue: setEventOrganizerSocialMedia,
    },
  ];

  const handleRegister = () => {
    fetch("http://127.0.0.1:8000/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: eventName,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        organizer: eventOrganizer,
        phone: eventOrganizerPhone,
        email: eventOrganizerEmail,
        website: eventOrganizerWebsite,
        socialMedia: eventOrganizerSocialMedia,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success");
        console.log(data);
      });
  };

  return (
    <div className="p-4 flex  flex-col gap-4">
      <h1 className="h2-semibold my-4 text-center">Register New Event</h1>
      <form className="flex flex-wrap ml-10">
        {formFields.map((field, i) => {
          return (
            <div key={i}>
              <label className="flex flex-col pl-4 h3-semibold">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                onChange={(e) => field.setValue(e.target.value)}
                className="shadow-inner h-14 w-96 px-2 mb-5 p-4 bg-white rounded-xl m-2"
              />
            </div>
          );
        })}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col pl-4 h3-semibold">
            Upload Event Logo
          </label>
          <UploadFile />
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col pl-4 h3-semibold">
            Upload Event Banner
          </label>
          <UploadFile />
        </div>
      </form>

      <button
        onClick={handleRegister}
        className="p-2 px-4 border-[1px] h-14 rounded-xl flex font-semibold items-center text-center w-max ml-20 bg-dark-400 text-light-200"
      >
        Register Event
      </button>
    </div>
  );
};

export default Register;
