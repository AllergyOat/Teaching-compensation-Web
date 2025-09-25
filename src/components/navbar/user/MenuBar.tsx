import { Link } from "react-router";

const MenuBar = () => {
  return (
    <ul className="flex gap-x-3 text-xl">
      <li>
        <Link to="/">หน้าหลัก</Link>
      </li>
      <li>
        <Link to="/status">ติดตามสถานะ</Link>
      </li>
      <li>
        <Link to="/form">กรอกแบบฟอร์ม</Link>
      </li>
      <li>
        <Link to="/profile">P</Link>
      </li>
    </ul>
  );
};
export default MenuBar;
