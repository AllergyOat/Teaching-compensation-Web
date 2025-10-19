import AdminNavbar from "@/components/navbar/admin/AdminNavbar";
import { Outlet } from "react-router";

const LayoutAdmin = () => {
  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <AdminNavbar />
      <Outlet />
    </main>
  );
};
export default LayoutAdmin;
