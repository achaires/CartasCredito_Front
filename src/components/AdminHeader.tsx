import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import useOutsideClick from "@/hooks/useOutsideClick";
import { useAppDispatch, useAppSelector } from "@/store";
import { authIsLoading, loggedOut } from "@/store/authSlice";

export const AdminHeader = () => {
  const ref = useRef();

  useOutsideClick(ref, () => {
    setShowProfileDropdown(false);
  });

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const authState = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const _handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(loggedOut());
    localStorage.removeItem("accessToken");
    dispatch(authIsLoading(false));
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
          // @ts-ignore
          ref={ref}
          className="flex w-48 items-center justify-end gap-4"
          onClick={(e) => {
            e.preventDefault();
            setShowProfileDropdown(!showProfileDropdown);
          }}>
          <FontAwesomeIcon icon={faUserCircle} className="fa-2x" />
          <span>{authState.isLoggedIn && authState.user?.Profile?.DisplayName}</span>
        </button>
        <div className={`dropdown ${showProfileDropdown ? "active" : ""}`}>
          <ul className="dropdown__list shadow">
            {/* <li>
              <a href="#">Mi Cuenta</a>
            </li> */}
            <li>
              <a href="#" onClick={_handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
