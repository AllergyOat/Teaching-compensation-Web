import Logo from "./Logo";
import MenuBar from "./MenuBar";
import Title from "./Title";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex h-20 justify-between items-center">
        <div className="flex items-center">
          <Link to="/home" className="ml-2 flex items-center">
            <Logo />
            <Title />
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="mr-5 hidden md:flex items-center">
          <MenuBar />
        </div>

        {/* Mobile Menu Button */}
        <div className="mr-5 md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <MenuBar mobile onItemClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};
export default Navbar;
