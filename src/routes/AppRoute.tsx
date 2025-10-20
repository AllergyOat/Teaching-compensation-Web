import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/user/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Form from "@/pages/user/FormSelect";
import FormDetail from "@/pages/user/FormDetail";
import Profile from "@/pages/user/Profile";
import Status from "@/pages/user/Status";
import FormInput from "@/pages/user/FormInput";
import ProfileEdit from "@/pages/user/ProfileEdit";
import AdminHome from "@/pages/admin/Home";
import UserList from "@/pages/admin/UserList";
import AdminProfile from "@/pages/admin/Profile";
import Test from "@/pages/admin/Test";

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
          <Route path="/home/static" element={<div>STATIC CONTENT</div>} />
          <Route path="/home/:formId" element={<FormDetail />} />
          <Route path="/status" element={<Status />} />
          <Route path="/status/:id" element={<div>EDIT STATUS</div>} />
          <Route path="/form" element={<Form />} />
          <Route path="/form/new" element={<FormInput />} />
          <Route path="/form/edit/:id" element={<FormInput />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
        </Route>

        {/* Admin Section */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<AdminHome />} />
          <Route path="user" element={<UserList />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="test" element={<Test />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoute;
