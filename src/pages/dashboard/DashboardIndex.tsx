import { useGetPagosProgramadosQuery, useGetPagosVencidosQuery } from "@/apis";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import DataGrid, { Export, Selection, Button, Column, FilterRow, Grouping, GroupPanel, HeaderFilter, Pager, Paging, SearchPanel } from "devextreme-react/data-grid";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const DashboardIndex = () => {
  const nav = useNavigate();
  const { data: pagosProgramados } = useGetPagosProgramadosQuery();
  const { data: pagosVencidos } = useGetPagosVencidosQuery();

  const _handleDetalleClick = useCallback((e: any) => {
    nav(`/operaciones/cartas-de-credito/${e.row.data.CartaCredito.Id}`);
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs links={[{ name: "Dashboard", href: "#" }]} />
        </div>

        <div className="mb-0">
          <AdminPageHeader title="Pagos Programados" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={pagosProgramados}>
            <HeaderFilter visible={true} />
            <Paging defaultPageSize={10} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="CartaCredito.NumCartaCredito" caption="Num. Carta Crédito" />
            <Column dataField="CartaCredito.DescripcionCartaCredito" caption="Descripción" />
            <Column dataField="FechaVencimiento" caption="Fecha Vencimiento" dataType="datetime" format="yyyy-MM-dd" defaultSortIndex="asc" sortIndex={0} />
            <Column dataField="MontoPago" caption="Monto Programado" format="currency" dataType="number" alignment="right" />
            <Column dataField="CartaCredito.Moneda" caption="Moneda" />
            <Column type="buttons">
              <Button name="Detalle" icon="find" hint="Ver Detalle" onClick={_handleDetalleClick} />
            </Column>
          </DataGrid>
        </div>

        <div className="mb-0">
          <AdminPageHeader title="Pagos Vencidos" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={pagosVencidos}>
            <HeaderFilter visible={true} />
            <Paging defaultPageSize={10} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="CartaCredito.NumCartaCredito" caption="Num. Carta Crédito" />
            <Column dataField="CartaCredito.DescripcionCartaCredito" caption="Descripción" />
            <Column dataField="FechaVencimiento" caption="Fecha Vencimiento" dataType="datetime" format="yyyy-MM-dd" defaultSortIndex="asc" sortIndex={0} />
            <Column dataField="MontoPago" caption="Monto Programado" format="currency" dataType="number" alignment="right" />
            <Column dataField="CartaCredito.Moneda" caption="Moneda" />
            <Column type="buttons">
              <Button name="Detalle" icon="find" hint="Ver Detalle" onClick={_handleDetalleClick} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </>
  );
};
