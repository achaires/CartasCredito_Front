import { faChartArea, faTableList } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { AdminSidebarItem } from "./AdminSidebarItem";

type Props = {
  showSidebar: boolean;
};

export const AdminSidebar = ({ showSidebar = false }: Props) => {
  return (
    <aside id="dashboard__sidebar" className={showSidebar ? "active" : ""}>
      <div className="sidebar__inner">
        <ul className="sidebar__list">
          <AdminSidebarItem
            title={`Reporte de Incidentes`}
            href={`#`}
            icon={faChartArea}
            links={[
              { title: "Gráfico", href: "/reportes/grafico" },
              { title: "Listado", href: "/reportes/incidentes" },
            ]}
          />

          <AdminSidebarItem
            title={`Catálogos`}
            href={`#`}
            icon={faTableList}
            links={[
              { title: "Negocios", href: "/negocios" },
              { title: "Plantas", href: "/plantas" },
              { title: "Administradores", href: "/administradores" },
              { title: "Usuarios", href: "/usuarios" },
              { title: "Puntos de Inspección", href: "/puntosinspeccion" },
              { title: "Rutas", href: "/rutas" },
              { title: "Tipos de Incientes", href: "/tiposincidentes" },
            ]}
          />
        </ul>
      </div>
    </aside>
  );
};
