import { useGetBancosQuery } from "@/apis/bancosApi";
import { useLazyFiltrarCartasComercialesQuery, useLazyGetCartasComercialesQuery } from "@/apis/cartasCreditoApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { useGetProveedoresQuery } from "@/apis/proveedoresApi";
import { useGetTiposActivoQuery } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { ICartaCreditoFiltrar, IMoneda } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faEdit, faEye, faFileInvoiceDollar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Label, Select, Spinner, Table, TextInput, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import { apiHost } from "@/utils/apiConfig";

import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

const currentDate = new Date();
const firstMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const CartasDeCredito = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [dateStart, setDateStart] = useState(firstMonthDate.toISOString());
  const [dateEnd, setDateEnd] = useState(currentDate.toISOString());

  // @ts-ignore
  const _handleDateChange = (newValue) => {
    setDateStart(newValue.startDate);
    setDateEnd(newValue.endDate);
  };

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors, isDirty },
  } = useForm<ICartaCreditoFiltrar>();

  const _handleNuevaCartaComercial = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-comercial");
  }, []);

  const _handleNuevaCartaStandBy = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-standby");
  }, []);

  //const [getCartasCredito, cartasCredito] = useLazyGetCartasComercialesQuery();
  const [filtrarCartasCredito, { data: cartasCreditoFiltradas, isFetching, isSuccess }] = useLazyFiltrarCartasComercialesQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catBancos } = useGetBancosQuery();
  const { data: catProveedores } = useGetProveedoresQuery();
  const { data: catTiposActivo } = useGetTiposActivoQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();

  const _handleFiltroSubmit = handleSubmit((formData) => {
    /* if (!isDirty) {
      dispatch(addToast({ title: "Información", type: "error", message: "La búsqueda es muy amplia. Seleccione dos o más filtros para reducir la cantidad de resultados" }));
      return;
    } */

    filtrarCartasCredito({
      ...formData,
      FechaInicio: dateStart,
      FechaFin: dateEnd,
    });
  });

  useEffect(() => {
    _handleFiltroSubmit();
  }, []);

  const _detailCellComponent = useCallback((rowData: ColumnCellTemplateData) => {
    return (
      <div className="flex gap-2 m-auto items-center justify-center">
        <Link to={`/operaciones/cartas-de-credito/${rowData.data.Id}`}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Link>
        {rowData.data.Estatus < 2 && rowData.data.TipoCarta === "Comercial" && (
          <Link to={`/operaciones/cartas-de-credito/${rowData.data.Id}/editar`}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        )}

        {rowData.data.Estatus < 2 && rowData.data.TipoCarta === "StandBy" && (
          <Link to={`/operaciones/cartas-de-credito/${rowData.data.Id}/editar-standby`}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        )}
      </div>
    );
  }, []);

  const _estatusCellComponent = useCallback((rowData: ColumnCellTemplateData) => {
    if (rowData.data && rowData.data.Estatus === 2) {
      return <p>Emitida</p>;
    }

    if (rowData.data && rowData.data.Estatus === 21) {
      return <p>Enmienda Pendiente</p>;
    }

    if (rowData.data && rowData.data.Estatus === 3) {
      return <p>Enmienda Pendiente</p>;
    }

    if (rowData.data && rowData.data.Estatus === 4) {
      return <p>Pagada</p>;
    }

    return <p>Registrada</p>;
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <AdminBreadcrumbs
          links={[
            { name: "Operaciones", href: "#" },
            {
              name: "Cartas de Crédito",
              href: `${apiHost}/#/operaciones/cartas-de-credito`,
            },
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

      <div className="mb-6 md:grid md:grid-cols-12 md:gap-4">
        <div className="md:col-span-3">
          <Label value="Rango de Fecha" />
          <Datepicker
            displayFormat="YYYY-MM-DD"
            value={{ startDate: dateStart, endDate: dateEnd }}
            onChange={_handleDateChange}
            showFooter={true}
            configs={{ footer: { cancel: "Cancelar", apply: "Aplicar" } }}
          />
        </div>
        <div className="md:col-span-3">
          <Label value="No. Carta Crédito" />
          <TextInput {...register("NumCarta")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Moneda" />
          <Select {...register("MonedaId")}>
            <option value={0}>Seleccione opción</option>
            {catMonedas?.map((item: IMoneda, index: number) => (
              <option key={index.toString()} value={item.Id}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Banco" />
          <Select {...register("BancoId")}>
            <option value={0}>Seleccione opción</option>
            {catBancos?.map((item, index) => (
              <option key={index.toString()} value={item.Id}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Carta" />
          <Select {...register("TipoCarta")}>
            <option value={0}>Seleccione opción</option>
            <option value={17}>Comercial</option>
            <option value={18}>Stand By</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Proveedor" />
          <Select {...register("ProveedorId")}>
            <option value={0}>Seleccione opción</option>
            {catProveedores?.map((item, index) => (
              <option key={index.toString()} value={item.Id}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Estatus de la Carta" />
          <Select>
            <option value={0}>Seleccione opción</option>
            <option value={1}>Registrada</option>
            <option value={2}>Emitida</option>
            <option value={3}>Enmienda Pendiente</option>
            <option value={4}>Pagada</option>
            <option value={5}>Cancelada</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Activo" />
          <Select {...register("TipoActivoId")}>
            <option value={0}>Seleccione opción</option>
            {catTiposActivo?.map((item, index) => (
              <option key={index.toString()} value={item.Id}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Empresa" />
          <Select {...register("EmpresaId")}>
            <option value={0}>Seleccione opción</option>
            {catEmpresas?.map((item, index) => (
              <option key={index.toString()} value={item.Id}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={(e) => _handleFiltroSubmit()}>Buscar</Button>
      </div>

      {isFetching && (
        <div className="mb-6 flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}

      <div className="mb-6">
        {isSuccess && cartasCreditoFiltradas && (
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={cartasCreditoFiltradas}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="NumCartaCredito" caption="Num. Carta" />
            <Column dataField="TipoCarta" />
            <Column dataField="TipoActivo" />
            <Column dataField="Proveedor" />
            <Column dataField="Empresa" />
            <Column dataField="Banco" />
            <Column dataField="Moneda" />
            <Column dataField="MontoOriginalLC" dataType="number" format="currency" />
            <Column caption="Estatus" cellRender={_estatusCellComponent} />
            <Column caption="" cellRender={_detailCellComponent} width={80} />
          </DataGrid>
        )}
      </div>
    </div>
  );
};
