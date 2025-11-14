import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/user/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
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
import UserDetail from "@/pages/admin/UserDetail";
import AdminProfile from "@/pages/admin/Profile";
import AdminFormDetail from "@/pages/admin/FormDetail";
import AdminEditFormDetail from "@/pages/admin/EditFormDetail";
import Test from "@/pages/admin/Test";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import Subject from "@/pages/admin/Subject";
import FormSubject from "@/pages/admin/FormSubject";
import ForgetPassword from "@/pages/auth/ForgetPassword";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Auth Section */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
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
        <Route
          path="admin"
          element={
            <ProtectRouteAdmin>
              <LayoutAdmin />
            </ProtectRouteAdmin>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="user" element={<UserList />} />
          <Route path="user/:userId" element={<UserDetail />} />
          <Route path="form/:formId" element={<AdminFormDetail />} />
          <Route path="form/edit/:formId" element={<AdminEditFormDetail />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="test" element={<Test />} />
          <Route path="subject" element={<Subject />} />
          <Route path="subject/new" element={<FormSubject />} />
          <Route path="subject/edit/:id" element={<FormSubject />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoute;
