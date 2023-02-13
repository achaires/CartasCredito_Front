import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

export const AdminHeader = () => {
  const ref = useRef();

  useOutsideClick(ref, () => {
    setShowProfileDropdown(false);
  });

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const _handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    //logout();
  };

  useEffect(() => {
    /* const initUser = async () => {
      const rsp = await getUser();

      if (rsp) {
        setUserInfo(rsp);
      }
    };

    initUser(); */
  }, []);

  return (
    <header id="dashboard__header" className="px-6">
      <div id="header__search" className="flex-1">
        {/* <input type="text" placeholder="Buscar..." className="w-full border-0 outline-0 focus:border-0 focus:outline-0" /> */}
      </div>
      <div id="header__tools">
        <button
          ref={ref}
          className="flex w-48 items-center justify-end gap-4"
          onClick={(e) => {
            e.preventDefault();
            setShowProfileDropdown(!showProfileDropdown);
          }}>
          <FontAwesomeIcon icon={faUserCircle} className="fa-2x" />
          <span>{/* {userInfo !== null && userInfo.Nombre} */}Test Users</span>
        </button>
        <div className={`dropdown ${showProfileDropdown ? "active" : ""}`}>
          <ul className="dropdown__list shadow">
            <li>
              <a href="#">Mi Cuenta</a>
            </li>
            <li>
              <a href="#" onClick={_handleLogout} to="#">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
