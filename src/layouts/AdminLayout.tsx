import { AdminBrand, AdminHeader, AdminLoadingActivity, AdminSidebar } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToast, setIsLoading } from "@/store/uiSlice";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useAppDispatch();
  const ui = useAppSelector((s) => s.ui);
  const auth = useAppSelector((s) => s.auth);

  if (!auth.isLoggedIn || auth.accessToken.length < 1) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="dashboard">
      <a
        className="menu-icon"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setShowSidebar(!showSidebar);
        }}>
        <FontAwesomeIcon icon={faBars} />
      </a>

      <AdminHeader />
      <AdminBrand showSidebar={showSidebar} />
      <AdminSidebar showSidebar={showSidebar} />
      <main id="dashboard__main">
        {ui.isLoading && <AdminLoadingActivity />}
        {!ui.isLoading && <Outlet />}
      </main>
      {/* <footer id="dashboard__footer">&copy; 2023</footer> */}
    </div>
  );
};
