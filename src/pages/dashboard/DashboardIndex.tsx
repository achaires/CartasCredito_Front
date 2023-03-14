import { useGetPagosProgramadosQuery, useGetPagosVencidosQuery } from "@/apis";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "devextreme-react/data-grid";

const columns = ["FechaVencimiento", "Empresa"];

export const DashboardIndex = () => {
  const { data: pagosProgramados } = useGetPagosProgramadosQuery();
  const { data: pagosVencidos } = useGetPagosVencidosQuery();

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs links={[{ name: "Dashboard", href: "#" }]} />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Pagos Programados" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} defaultColumns={columns} keyExpr="Id" dataSource={pagosProgramados} />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Pagos Vencidos" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} defaultColumns={columns} keyExpr="Id" dataSource={pagosVencidos} />
        </div>
      </div>
    </>
  );
};
