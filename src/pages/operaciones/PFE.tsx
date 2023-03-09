import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

export const PFE = () => {
  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Pagos PFE", href: `${apiHost}/#/operaciones/pfe` },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Programación de Pagos PFE" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-4"></div>
      </div>
    </>
  );
};
