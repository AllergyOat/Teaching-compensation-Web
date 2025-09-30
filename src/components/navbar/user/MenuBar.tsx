import { Link } from "react-router";
import { User } from 'lucide-react';

const MenuBar = () => {
  return (
    <ul className="flex gap-x-3 text-xl">
      <li>
        <Link to="/home">หน้าหลัก</Link>
      </li>
      <li>
        <Link to="/status">ติดตามสถานะ</Link>
      </li>
      <li>
        <Link to="/form">กรอกแบบฟอร์ม</Link>
      </li>
      <li>
        <Link to="/profile"><User /></Link>
      </li>
    </ul>
  );
};
export default MenuBar;
