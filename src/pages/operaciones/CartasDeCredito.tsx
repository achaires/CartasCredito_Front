import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "flowbite-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const CartasDeCredito = () => {
  const nav = useNavigate();

  const _handleNuevaCartaComercial = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-comercial");
  }, []);

  const _handleNuevaCartaStandBy = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-standby");
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <AdminBreadcrumbs
          links={[
            { name: "Operaciones", href: "#" },
            { name: "Cartas de Crédito", href: "/operaciones/cartas-de-credito" },
          ]}
        />
      </div>
      <div className="mb-6">
        <AdminPageHeader title="Cartas de Crédito" icon={faFileInvoiceDollar} />
      </div>

      <div className="mb-6">
        <Dropdown label="Nueva Carta de Crédito" dismissOnClick={false}>
          <Dropdown.Item onClick={_handleNuevaCartaComercial}>Nueva Carta Comercial</Dropdown.Item>
          <Dropdown.Item onClick={_handleNuevaCartaStandBy}>Nueva Carta Stand By</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};
