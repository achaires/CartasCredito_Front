import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useLazyGetMovimientosQuery } from "@/apis/bitacoraApiSlice";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IBitacoraMovimiento } from "@/interfaces";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

var curDate = new Date();

export const Bitacora = () => {
  const nav = useNavigate();

  const [dateStart, setDateStart] = useState(new Date(curDate.getFullYear(), curDate.getMonth(), 1));
  const [dateEnd, setDateEnd] = useState(new Date());

  const [getMovimientos, { data: catalogoData, isLoading, error }] = useLazyGetMovimientosQuery();

  useEffect(() => {
    getMovimientos({ DateStart: Math.floor(dateStart.getTime() / 1000), DateEnd: Math.floor(dateEnd.getTime() / 1000) });
  }, []);

  const _detalleCellComponent = useCallback((rowData: ColumnCellTemplateData<IBitacoraMovimiento>) => {
    if (rowData.data && rowData.data.CartaCreditoId) {
      return (
        <Link to={`/operaciones/cartas-de-credito/${rowData.data.CartaCreditoId}`}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Link>
      );
    }

    return <>NA</>;
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Seguridad", href: "#" },
              { name: "Bitácora de Movimientos", href: `${apiHost}/#/bitacora` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Bitácora de Movimientos" icon={faList} />
        </div>

        <div className="my-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={catalogoData}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="Titulo" />
            <Column dataField="CreadoPor" caption="Usuario" />
            <Column dataField="Creado" caption="Fecha Movimiento" dataType="datetime" format="dd/MM/yyyy HH:mm a" defaultSortOrder="asc" sortIndex={0} />
            <Column caption="Detalle" cellRender={_detalleCellComponent} width={80} />
          </DataGrid>
        </div>
      </div>
    </>
  );
};
