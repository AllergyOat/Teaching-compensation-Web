import Logo from "./Logo";
import MenuBar from "./MenuBar";
import Title from "./Title";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex h-20 justify-between bg-white">
      <div className="flex items-center">
        <Link to="/admin" className="ml-2 flex items-center">
          <Logo />
          <Title />
        </Link>
      </div>
      <div className="mr-5 flex items-center">
        <MenuBar />
      </div>
    </nav>
  );
};
export default Navbar;
