import { faArrowsToCircle, faChartArea, faChartPie, faList, faTable, faTableList, faUsers } from "@fortawesome/free-solid-svg-icons";
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
          <AdminSidebarItem title={`Dashboard`} href={`/`} icon={faChartArea} />

          {/*

          <AdminSidebarItem
            title={`Usuarios`}
            href={`#`}
            icon={faUsers}
            links={[
              { title: "Roles", href: "/negocios" },
              { title: "Registro", href: "/plantas" },
            ]}
          /> */}

          <AdminSidebarItem
            title={`Catálogos`}
            href={`#`}
            icon={faList}
            links={[
              { title: "Agentes Aduanales", href: "/catalogos/agentes-aduanales" },
              { title: "Bancos", href: "/catalogos/bancos" },
              { title: "Compradores", href: "/catalogos/compradores" },
              { title: "Divisiones", href: "/catalogos/divisiones" },
              { title: "Empresas", href: "/catalogos/empresas" },
              { title: "Líneas de Crédito", href: "/catalogos/lineas-de-credito" },
              { title: "Listado de Documentos", href: "/catalogos/listado-de-documentos" },
              { title: "Monedas", href: "/catalogos/monedas" },
              { title: "Proveedores", href: "/catalogos/proveedores" },
              { title: "Proyectos", href: "/catalogos/proyectos" },
              { title: "Tipos de Comisión", href: "/catalogos/comisiones" },
              { title: "Tipos de Activo", href: "/catalogos/tipos-de-activo" },
              { title: "Tipos de Cobertura", href: "/catalogos/tipos-de-cobertura" },
            ]}
          />

          <AdminSidebarItem
            title={`Operaciones`}
            href={`#`}
            icon={faArrowsToCircle}
            links={[
              { title: "Cartas de Crédito", href: "/operaciones/cartas-de-credito" },
              { title: "PFE", href: "/operaciones/pfe" },
              /* { title: "Enmiendas", href: "/operaciones/" },
              { title: "Pagos", href: "/operaciones/" },
              { title: "Comisiones", href: "/operaciones/" },
              { title: "Bitácora de Movimientos", href: "/operaciones/" }, */
            ]}
          />

          {/* <AdminSidebarItem title="Reportes" href="#" icon={faChartPie} /> */}
        </ul>
      </div>
    </aside>
  );
};
