import { Link, useLocation } from "react-router";
import { User } from "lucide-react";

const MenuBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    const current = location.pathname;

    if (current === path) return true;

    if (path !== "/admin" && current.startsWith(path + "/")) return true;

    return false;
  };

  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "font-bold border-b-[6px] border-[#048C59] pb-[calc(1rem-6px)]"
      : "hover:text-gray-600 pb-4";
  };

  return (
    <ul className="-mb-[15px] flex gap-x-6 text-xl">
      <li>
        <Link to="/admin" className={getLinkClass("/admin")}>
          หน้าหลัก
        </Link>
      </li>
      <li>
        <Link to="/admin/user" className={getLinkClass("/admin/user")}>
          ฐานข้อมูลอาจารย์
        </Link>
      </li>
      <li>
        <Link to="/admin/subject" className={getLinkClass("/admin/subject")}>
          ข้อมูลรายวิชา
        </Link>
      </li>
      <li>
        <Link
          to="/admin/profile"
          className={isActive("/admin/profile") ? "pb-4 font-bold" : "pb-4"}
        >
          <User />
        </Link>
      </li>
    </ul>
  );
};

export default MenuBar;
