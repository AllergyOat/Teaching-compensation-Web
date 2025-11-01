import { Link, useLocation } from "react-router";
import { User } from 'lucide-react';

interface MenuBarProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const MenuBar = ({ mobile = false, onItemClick }: MenuBarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClass = (path: string) => {
    if (mobile) {
      return isActive(path)
        ? "block px-4 py-3 text-lg font-bold bg-green-50 text-[#048C59] border-l-4 border-[#048C59]"
        : "block px-4 py-3 text-lg hover:bg-gray-50 text-gray-700";
    }
    return isActive(path) 
      ? "font-bold border-b-[6px] border-[#048C59] pb-[calc(1rem-4.5px)]" 
      : "hover:text-gray-600 pb-4";
  };

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  if (mobile) {
    return (
      <ul className="flex flex-col">
        <li>
          <Link to="/home" className={getLinkClass("/home")} onClick={handleClick}>
            หน้าหลัก
          </Link>
        </li>
        <li>
          <Link to="/status" className={getLinkClass("/status")} onClick={handleClick}>
            ติดตามสถานะ
          </Link>
        </li>
        <li>
          <Link to="/form" className={getLinkClass("/form")} onClick={handleClick}>
            กรอกแบบฟอร์ม
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={isActive("/profile") 
              ? "flex items-center gap-2 px-4 py-3 text-lg font-bold bg-green-50 text-[#048C59] border-l-4 border-[#048C59]"
              : "flex items-center gap-2 px-4 py-3 text-lg hover:bg-gray-50 text-gray-700"
            }
            onClick={handleClick}
          >
            <User className="w-5 h-5" />
            <span>ข้อมูลผู้ใช้</span>
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="flex gap-x-6 text-xl -mb-[15px]">
      <li>
        <Link to="/home" className={getLinkClass("/home")}>
          หน้าหลัก
        </Link>
      </li>
      <li>
        <Link to="/status" className={getLinkClass("/status")}>
          ติดตามสถานะ
        </Link>
      </li>
      <li>
        <Link to="/form" className={getLinkClass("/form")}>
          กรอกแบบฟอร์ม
        </Link>
      </li>
      <li>
        <Link to="/profile" className={isActive("/profile") ? "font-bold pb-4" : "pb-4"}>
          <User />
        </Link>
      </li>
    </ul>
  );
};
export default MenuBar;
