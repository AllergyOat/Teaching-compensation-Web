import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/user/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Form from "@/pages/user/FormSelect";
import FormInput from "@/pages/user/FormInput";
import FormDetail from "@/pages/user/FormDetail";
import Profile from "@/pages/user/Profile";

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
          <Route path="/home" element={<Home />} />
          <Route path="/home/:formId" element={<FormDetail />} />
          <Route path="/status" element={<div>Status</div>} />
          <Route path="/form" element={<Form />} />
          <Route path="/form/new" element={<FormInput />} />
          <Route path="/profile" element={<Profile />} />
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
