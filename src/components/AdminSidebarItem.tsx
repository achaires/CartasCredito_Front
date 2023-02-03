import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  title: string;
  href: string;
  icon?: IconProp | null;
  links?: SidebarItemLink[] | null;
};

type SidebarItemLink = {
  href: string;
  title: string;
};

export const AdminSidebarItem = ({ title, href, icon = null, links = [] }: Props) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  return (
    <li className={`sidebar__list-item`}>
      {links && links.length > 0 && (
        <a
          href="#"
          className={showSubmenu ? `active` : ``}
          onClick={(e) => {
            e.preventDefault();
            setShowSubmenu(!showSubmenu);
          }}>
          {icon !== null && <FontAwesomeIcon className="fa-fw" icon={icon} />}
          <span>{title}</span>
        </a>
      )}

      {links && links.length < 1 && (
        <Link to={href}>
          {icon !== null && <FontAwesomeIcon className="fa-fw" icon={icon} />} <span>{title}</span>
        </Link>
      )}

      {links && links.length > 0 && (
        <ul className={showSubmenu ? `active` : ``}>
          {links.map((item, index) => {
            return (
              <li key={index.toString()}>
                <Link to={item.href}>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};
