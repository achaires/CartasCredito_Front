import { AdminBrand, AdminHeader, AdminSidebar } from "@/components";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

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
      <main id="dashboard__main">Hello World</main>
      <footer id="dashboard__footer">&copy; 2023</footer>
    </div>
  );
};
