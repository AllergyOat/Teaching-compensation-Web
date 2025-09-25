import Logo from "./Logo";
import MenuBar from "./MenuBar";
import Title from "./Title";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="h-20 flex justify-between bg-white">
      <div className="flex items-center">
        <Link to="/" className="flex items-center ml-2">
          <Logo />
          <Title />
        </Link>
      </div>
      <div className="flex items-center mr-5">
        <MenuBar />
      </div>
    </nav>
  );
};
export default Navbar;
