import { AdminBrand, AdminHeader, AdminLoadingActivity, AdminSidebar } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToast, setIsLoading } from "@/store/uiSlice";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useAppDispatch();
  const ui = useAppSelector((s) => s.ui);

  const testIsLoading = useCallback(() => {
    dispatch(setIsLoading(true));
  }, []);

  const testToast = useCallback(() => {
    dispatch(
      addToast({
        title: "Test",
        message: "This is a test",
        type: "success",
        time: new Date().toISOString(),
      })
    );
  }, []);

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
