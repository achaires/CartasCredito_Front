import { useGenerarReporteMutation, useGetEmpresasQuery, useLazyGetReportesQuery } from "@/apis";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";
import { useConvertirMutation } from "@/apis/conversionMonedaApi";
import Datepicker from "react-tailwindcss-datepicker";
/* import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source"; */

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const ReportesSabana = () => {
  const { data: empresas, isLoading, error } = useGetEmpresasQuery();
  const [getReportes, { data: reportesRsp, isLoading: isLoadingReportes, error: getReportesError }] = useLazyGetReportesQuery();
  const [generarReporte, { data: genReporteRsp, isLoading: isLoadingGenReporte, error: genReporteError }] = useGenerarReporteMutation();
  const [convertirMoneda, { data: conversionRes, isLoading: conversionIsLoading }] = useConvertirMutation();

  const [empresaId, setEmpresaId] = useState(0);
  const [tipoReporteId, setTipoReporteId] = useState(0);
  /* const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState(""); */
  const [fechaDivisas, setFechaDivisas] = useState({
    startDate: null,
    endDate: null,
  });

  const [fechaRango, setFechaRango] = useState({
    startDate: null,
    endDate: null,
  });

  // @ts-ignore
  const _handleDateChange = (newValue) => {
    setFechaRango(newValue);
  };

  // @ts-ignore
  const _handleDivisaDateChange = (newValue) => {
    setFechaDivisas(newValue);
  };

  const _onFechaDivisasChange = (val: string) => {
    // @ts-ignore
    setFechaDivisas(val);
  };

  const _onSubmit = () => {
    if (tipoReporteId < 1) {
      toast.error("Seleccione tipo de reporte");

      return;
    }

    if (fechaRango.startDate === null || fechaRango.endDate === null) {
      toast.error("Seleccione rango de fecha");

      return;
    }

    generarReporte({
      EmpresaId: empresaId,
      TipoReporteId: tipoReporteId,
      FechaInicio: fechaRango.startDate,
      FechaFin: fechaRango.endDate,
      FechaDivisas: fechaDivisas.startDate ?? "",
    });
  };

  const _filenameCellComponent = useCallback(
    (rowData: ColumnCellTemplateData) => {
      return (
        <a target="_blank" href={`${apiHost}/Reportes/${rowData.data.Filename}`}>
          Descargar
        </a>
      );
    },
    [reportesRsp]
  );

  useEffect(() => {
    getReportes();
  }, []);

  useEffect(() => {
    if (conversionRes) {
      if (!conversionRes.Flag) {
        toast.error("No se ha encontrado el tipo de cambio para esta fecha");
      }
    }
  }, [conversionRes]);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs links={[{ name: "Reportes", href: `${apiHost}/#/reportes/` }]} />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Reportes" icon={faChartPie} />
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
          <div className="flex-2 mb-4 lg:mb-0">
            <Label value="Tipo de Reporte" />
            <Select
              className="w-full"
              onChange={(e) => {
                setTipoReporteId(Number(e.target.value));
              }}>
              <option value="0">Seleccione Opción</option>
              <option value="1">Análisis Ejecutivo de Cartas</option>
              <option value="8">Análisis Cartas de Crédito</option>
              <option value="2">Comisiones por Tipo de Comisión</option>
              {/* <option value="3">Cartas de Crédito Stand By</option>
              <option value="4">Vencimientos de Cartas de Crédito</option>
              <option value="5">Comisiones de Cartas de Crédito por Estatus</option>
              <option value="6">Líneas de Crédito Disponibles</option>
              <option value="7">Total Outstanding</option> */}
            </Select>
          </div>
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Rango de Fecha" />
            {/* <TextInput
              type="date"
              onChange={(e) => setFechaInicio(e.target.value)}
            /> */}
            <Datepicker displayFormat="DD-MM-YYYY" value={fechaRango} onChange={_handleDateChange} showFooter={false} />
          </div>
          <div className="flex-1 mb-4 lg:mb-0">
            <Label value="Conversión de Divisas" />
            <Datepicker displayFormat="DD-MM-YYYY" value={fechaDivisas} onChange={_handleDivisaDateChange} showFooter={false} asSingle />
            {/* <TextInput
              type="date"
              onChange={(e) => _onFechaDivisasChange(e.target.value)}
            /> */}
          </div>
        </div>

        {!conversionIsLoading && conversionRes && <div className="mb-6">Utilizando tipo de cambio: {conversionRes?.DataString}</div>}

        <div className="flex-1 mb-4 lg:mb-0">
          <Button onClick={(e) => _onSubmit()}>Generar Reporte</Button>
        </div>

        {/* {(isLoadingReporteAnalisisCartas || isLoadingComisionesPorTipoComision) && (
          <div className="mb-6 flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        )} */}

        <div className="mb-6">
          {reportesRsp && !isLoadingReportes && (
            <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={reportesRsp}>
              <Paging defaultPageSize={10} />
              <HeaderFilter visible={true} />
              <SearchPanel visible={true} />
              <Selection mode="multiple" showCheckBoxesMode="always" />
              <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
              <Column dataField="TipoReporte" />
              <Column dataField="Creado" dataType="datetime" format="dd/MM/yyyy HH:mm" defaultSortOrder="asc" sortIndex={0} />
              <Column dataField="Descarga" cellRender={_filenameCellComponent} />
            </DataGrid>
          )}
        </div>
      </div>
    </>
  );
};
