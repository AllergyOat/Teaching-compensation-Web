import { Link, useLocation } from "react-router";
import { User } from 'lucide-react';

const MenuBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClass = (path: string) => {
    return isActive(path) 
      ? "font-bold border-b-[6px] border-[#048C59] pb-[calc(1rem-6px)]" 
      : "hover:text-gray-600 pb-4";
  };

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
