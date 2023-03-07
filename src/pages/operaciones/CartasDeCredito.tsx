import { useGetBancosQuery } from "@/apis/bancosApi";
import { useGetCartasComercialesQuery, useLazyFiltrarCartasComercialesQuery, useLazyGetCartasComercialesQuery } from "@/apis/cartasCreditoApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { useGetProveedoresQuery } from "@/apis/proveedoresApi";
import { useGetTiposActivoQuery } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { ICartaCreditoFiltrar } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faEye, faFileInvoiceDollar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Label, Select, Spinner, Table, TextInput, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import numeral from "numeral";

const currentDate = new Date();
const firstMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const CartasDeCredito = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [dateStart, setDateStart] = useState(firstMonthDate);
  const [dateEnd, setDateEnd] = useState(currentDate);

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

  const [getCartasCredito, cartasCredito] = useLazyGetCartasComercialesQuery();
  const [filtrarCartasCredito, cartasCreditoFiltradas] = useLazyFiltrarCartasComercialesQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catBancos } = useGetBancosQuery();
  const { data: catProveedores } = useGetProveedoresQuery();
  const { data: catTiposActivo } = useGetTiposActivoQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();

  const _handleFiltroSubmit = handleSubmit((formData) => {
    if (!isDirty) {
      dispatch(addToast({ title: "Información", type: "error", message: "La búsqueda es muy amplia. Seleccione dos o más filtros para reducir la cantidad de resultados" }));
      return;
    }

    // @ts-ignore
    filtrarCartasCredito({ ...formData, FechaInicio: dateStart, FechaFin: dateEnd });
  });

  useEffect(() => {
    let curDate = new Date();
    curDate.setHours(23);
    curDate.setMinutes(59);
    curDate.setSeconds(59);

    let dateStart = new Date(curDate.getFullYear(), curDate.getMonth(), 1);

    getCartasCredito({ FechaInicio: dateStart.toISOString().split("T")[0], FechaFin: curDate.toISOString().split("T")[0] });
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
          {/* <Dropdown.Item onClick={_handleNuevaCartaStandBy}>Nueva Carta Stand By</Dropdown.Item> */}
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
            {catMonedas?.map((item, index) => (
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
        {/* <div className="md:col-span-3">
          <Label value="Estado de la Carta" />
          <Select {...register("Estatus")}>
            <option value={0}>Seleccione opción</option>
            <option value={0}>Regular</option>
            <option value={1}>Vencida</option>
          </Select>
        </div> */}
      </div>

      <div className="mb-6">
        <Button onClick={(e) => _handleFiltroSubmit()}>Buscar</Button>
      </div>

      {cartasCreditoFiltradas.isFetching && (
        <div className="mb-6 flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}

      <div className="mb-6">
        <Table>
          <Table.Head>
            <Table.HeadCell>No. Carta Crédito</Table.HeadCell>
            <Table.HeadCell>Tipo</Table.HeadCell>
            {/* <Table.HeadCell>Activo</Table.HeadCell> */}
            <Table.HeadCell>Proveedor</Table.HeadCell>
            <Table.HeadCell>Empresa</Table.HeadCell>
            <Table.HeadCell>Banco</Table.HeadCell>
            <Table.HeadCell>Moneda</Table.HeadCell>
            <Table.HeadCell align="right">Monto</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cartasCreditoFiltradas.data &&
              cartasCreditoFiltradas.data.map((item, index) => {
                return (
                  <Table.Row key={index.toString()}>
                    <Table.Cell className="">{item.NumCartaCredito}</Table.Cell>
                    <Table.Cell className="">{item.TipoCarta}</Table.Cell>
                    {/* <Table.Cell className="">{item.TipoActivo}</Table.Cell> */}
                    <Table.Cell className="">{item.Proveedor}</Table.Cell>
                    <Table.Cell className="">{item.Empresa}</Table.Cell>
                    <Table.Cell className="">{item.Banco}</Table.Cell>
                    <Table.Cell className="">{item.Moneda}</Table.Cell>
                    <Table.Cell align="right">{numeral(item.MontoOriginalLC).format("$0,0.00")}</Table.Cell>
                    <Table.Cell>
                      <Tooltip content="Ver Detalle">
                        <Link to={`/operaciones/cartas-de-credito/${item.Id}`}>Detalle</Link>
                        {/* <Button color="dark" size="sm" onClick={(e) => nav(`/operaciones/cartas-de-credito/${item.Id}`)}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button> */}
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                );
              })}

            {cartasCredito.data &&
              cartasCredito.data.map((item, index) => {
                return (
                  <Table.Row key={index.toString()}>
                    <Table.Cell className="">{item.NumCartaCredito}</Table.Cell>
                    <Table.Cell className="">{item.TipoCarta}</Table.Cell>
                    {/* <Table.Cell className="">{item.TipoActivo}</Table.Cell> */}
                    <Table.Cell className="">{item.Proveedor}</Table.Cell>
                    <Table.Cell className="">{item.Empresa}</Table.Cell>
                    <Table.Cell className="">{item.Banco}</Table.Cell>
                    <Table.Cell className="">{item.Moneda}</Table.Cell>
                    <Table.Cell align="right">{numeral(item.MontoOriginalLC).format("$0,0.00")}</Table.Cell>
                    <Table.Cell>
                      <Tooltip content="Ver Detalle">
                        <Link to={`/operaciones/cartas-de-credito/${item.Id}`}>Detalle</Link>
                        {/* <Button color="dark" size="sm" onClick={(e) => nav(`/operaciones/cartas-de-credito/${item.Id}`)}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button> */}
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
