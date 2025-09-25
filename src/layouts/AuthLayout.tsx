import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <main>
      <h1>Auth</h1>
      <Outlet />
    </main>
  )
}
export default AuthLayout