import { Navigate } from "react-router";
import { useEffect, useState } from "react";

interface ProtectRouteAdminProps {
  children: React.ReactNode;
}

const ProtectRouteAdmin = ({ children }: ProtectRouteAdminProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      console.log("ProtectRouteAdmin - Checking access...");
      console.log("Access Token:", accessToken ? "exists" : "missing");
      console.log("User String:", userStr);

      if (!accessToken || !userStr) {
        console.log("No token or user data - redirecting to login");
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        console.log("Parsed User:", user);
        console.log("User Role:", user.role);
        
        // ตรวจสอบว่า user มี role เป็น ADMIN หรือ MAJOR_ADMIN หรือไม่
        if (user.role === "ADMIN" || user.role === "MAJOR_ADMIN") {
          console.log("User is ADMIN - allowing access");
          setIsAdmin(true);
        } else {
          console.log("User is not ADMIN - denying access");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAdmin(false);
      }

      setIsChecking(false);
    };

    checkAdminAccess();
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังตรวจสอบสิทธิ์...</div>
      </div>
    );
  }

  if (!isAdmin) {
    // ถ้าไม่ใช่ admin ให้ redirect กลับไปหน้า login หรือ home
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectRouteAdmin;
