import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/user/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Section */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Section */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<div>Form</div>} />
          <Route path="/form/:formId" element={<div>Form Detail</div>} />
          <Route path="/status" element={<div>Status</div>} />
          <Route path="/create-form" element={<div>Create Form</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>

        {/* Admin Section */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<div>Dashboard</div>} />
          <Route path="User" element={<div>User</div>} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoute;
