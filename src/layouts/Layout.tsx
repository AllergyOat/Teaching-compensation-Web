import Navbar from "@/components/navbar/user/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <Outlet />
    </main>
  );
};
export default Layout;
