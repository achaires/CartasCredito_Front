import { useGetEmpresasQuery } from "@/apis";
import { useLazyGetReporteAnalisisCartasQuery } from "@/apis/reportesApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
/* import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source"; */

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const ReportesSabana = () => {
  const { data: empresas, isLoading, error } = useGetEmpresasQuery();

  const [empresaId, setEmpresaId] = useState(0);
  const [tipoReporteId, setTipoReporteId] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [
    getReporteAnalisisCartas,
    { data: analisisCartasRsp, isSuccess: isSuccessReporteAnalisisCartas, isError: isErrorReporteAnalisisCartas, isLoading: isLoadingReporteAnalisisCartas },
  ] = useLazyGetReporteAnalisisCartasQuery();

  const _onSubmit = () => {
    if (tipoReporteId < 1) {
      toast.error("Seleccione tipo de reporte");

      return;
    }

    if (fechaInicio.length < 1 || fechaFin.length < 1) {
      toast.error("Seleccione fecha desde y hasta");

      return;
    }

    getReporteAnalisisCartas({
      EmpresaId: empresaId,
      TipoReporteId: tipoReporteId,
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
    });
  };

  /* const dataSource = new PivotGridDataSource({
    fields: [
      { dataField: "Empresa" },
      { dataField: "Banco" },
      { dataField: "Proveedor" },
      { dataField: "DescripcionMercancia" },
      { dataField: "PuntoEmbarque" },
      { dataField: "Moneda" },
      { dataField: "MontoOriginalLC" },
      { dataField: "DiasPlazoProveedor" },
    ],
    store: analisisCartasRsp && analisisCartasRsp.Content ? analisisCartasRsp.Content : [],
  }); */

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Reportes", href: "#" },
              { name: "Tipo Sábana", href: `${apiHost}/#/reportes/sabana` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Reportes" subtitle="Tipo Sábana" icon={faChartPie} />
        </div>

        <div className="mb-6 lg:flex items-center justify-between gap-4 lg:w-full">
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Empresa" />
            <Select
              className="w-full"
              onChange={(e) => {
                setEmpresaId(Number(e.target.value));
              }}>
              <option value={0}>TODAS</option>
              {empresas &&
                empresas.map((item, index) => (
                  <option key={index.toString()} value={item.Id}>
                    {item.Nombre}
                  </option>
                ))}
            </Select>
          </div>
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Tipo de Reporte" />
            <Select
              className="w-full"
              onChange={(e) => {
                setTipoReporteId(Number(e.target.value));
              }}>
              <option value="0">Seleccione Opción</option>
              <option value="1">Análisis de Cartas</option>
            </Select>
          </div>
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Desde" />
            <TextInput type="date" onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Hasta" />
            <TextInput type="date" onChange={(e) => setFechaFin(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 mb-4 lg:mb-0">
          <Button onClick={(e) => _onSubmit()}>Generar Reporte</Button>
        </div>

        {isLoadingReporteAnalisisCartas && (
          <div className="mb-6 flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        )}

        <div className="mb-6">
          {isSuccessReporteAnalisisCartas && analisisCartasRsp && (
            <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={analisisCartasRsp.Content}>
              <Paging defaultPageSize={10} />
              <HeaderFilter visible={true} />
              <SearchPanel visible={true} />
              <Selection mode="multiple" showCheckBoxesMode="always" />
              <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
              <Column dataField="Empresa" />
              <Column dataField="Banco" />
              <Column dataField="Proveedor" />
              <Column dataField="DescripcionMercancia" caption="Producto" />
              <Column dataField="PuntoEmbarque" caption="País" />
              <Column dataField="Moneda" />
              <Column dataField="MontoOriginalLC" dataType="number" format="currency" caption="Importe Total" />
              <Column dataField="DiasPlazoProveedor" dataType="number" caption="Días plazo proveedor despues de B/L" />
            </DataGrid>
          )}
        </div>

        {/* <div className="my-6">
          {isSuccessReporteAnalisisCartas && analisisCartasRsp && (
            <PivotGrid dataSource={dataSource} allowSortingBySummary={true} allowFiltering={true} showBorders={true}>
              <FieldChooser enabled={true} height={650} />
            </PivotGrid>
          )}
        </div> */}
      </div>
    </>
  );
};
