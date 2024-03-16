import img from "../assets/img/Img-placeholder.png";
import Images from "./Images";

const EventPage = () => {
  return (
    <div>
      <div className="w-full h-64 relative ">
        <img src={img} alt="Banner" className="w-full h-full bg-cover " />
        <img
          src={img}
          alt="Logo"
          className="w-40 h-40 absolute left-10 top-10 border-[1px] rounded-xl z-10"
        />
        <div className="absolute top-0 left-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.1)] h-full w-full"></div>
      </div>
      <div>
        <h1 className="h1-bold m-4 p-2">Event Name</h1>
        <p className="body-regular px-12 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          quasi non atque consequatur ullam veritatis iure provident culpa?
          Eveniet accusamus nulla blanditiis ratione recusandae modi optio
          dolor. Accusantium, rerum alias?
        </p>
        <div className="m-4 p-2 h2-semibold flex-between">
          <p className="m-2">Date</p>
          <p className="m-2">Venue</p>
        </div>
        <div className="m-4 p-2 h2-semibold flex-between">
          <p className="m-2">Organizer Name</p>
          <p className="m-2">Organizer Email</p>
          <p className="m-2">Organizer Website</p>
        </div>
      </div>
      <div>
        <button className="btn mx-6 mt-10">Upload More Photos</button>
        <Images />
      </div>
    </div>
  );
};

export default EventPage;
