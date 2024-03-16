import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="text-light-200 bg-dark-300 flex-between shadow-xl p-4 h-20">
      <Link to={"/"}>Logo</Link>

      {/* <nav>
        <a href="body-regular"></a>
        <a href=""></a>
        <a href=""></a>
      </nav> */}
      <nav>
        <div className="flex-center gap-3">
          <Link to="/login" className="body-regular">
            Login as Organizer
          </Link>
          <Link to="/register" className="body-regular">
            Register New Event
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
