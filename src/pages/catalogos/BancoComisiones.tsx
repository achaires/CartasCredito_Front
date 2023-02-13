import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faBank, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export const BancoComisiones = () => {
  const nav = useNavigate();

  const _handleBack = () => {
    nav("/catalogos/bancos");
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Bancos", href: "/catalogos/bancos" },
              { name: "Comisiones", href: `#` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Bancos" subtitle="Comisiones" icon={faBank} />
        </div>

        <div className="mb-6">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
        </div>
      </div>
    </>
  );
};
