import Navbar from "@/components/navbar/user/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};
export default Layout;
