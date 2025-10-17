import AdminNavbar from "@/components/navbar/admin/AdminNavbar";
import { Outlet } from "react-router";

const LayoutAdmin = () => {
  return (
    <main>
      <AdminNavbar />
      <Outlet />
    </main>
  );
};
export default LayoutAdmin;
