import { useGetAgentesAduanalesQuery } from "@/apis/agentesAduanalesApi";
import { useGetBancosQuery } from "@/apis/bancosApi";
import { useAddCartaComercialMutation } from "@/apis/cartasCreditoApi";
import { useGetCompradoresQuery } from "@/apis/compradoresApi";
import { useGetDocumentosQuery } from "@/apis/documentosApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { useGetProveedoresQuery } from "@/apis/proveedoresApi";
import { useGetProyectosQuery } from "@/apis/proyectosApi";
import { useGetTiposActivoQuery } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminLoadingActivity, AdminPageHeader } from "@/components";
import { ICartaComercial } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faCircleArrowLeft, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Label, Select, Table, Textarea, TextInput } from "flowbite-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function NuevaCartaComercial() {
  const nav = useNavigate();

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<ICartaComercial>();

  const { data: catTiposActivo } = useGetTiposActivoQuery();
  const { data: catProyectos } = useGetProyectosQuery();
  const { data: catBancos } = useGetBancosQuery();
  const { data: catProveedores } = useGetProveedoresQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catAgentesAduanales } = useGetAgentesAduanalesQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catCompradores } = useGetCompradoresQuery();
  const { data: catDocumentos } = useGetDocumentosQuery();

  const [addCarta, { data: responseData, isSuccess, isError, isLoading, error }] = useAddCartaComercialMutation();

  const dispatch = useAppDispatch();

  const _handleBack = useCallback(() => {
    nav(-1);
  }, []);

  const _handleSubmit = handleSubmit((formData) => {
    addCarta(formData)
      .unwrap()
      .then((rsp) => {
        if (rsp.DataInt !== null && rsp.DataInt > 0) {
          nav(-1);
        }
      });
  });

  useEffect(() => {
    if (isError) {
      dispatch(
        addToast({
          message: "Ocurrió un problema al crear la carta de crédito",
          title: "Error",
          type: "error",
        })
      );
    }

    if (isSuccess) {
      if (responseData && responseData.DataInt && responseData.DataString && responseData.DataString.length > 0) {
        dispatch(
          addToast({
            message: "Carta de Crédito registrada con éxito",
            title: "Éxito",
            type: "success",
          })
        );
      } else {
        dispatch(
          addToast({
            message: "Ocurrió un problema al crear la carta de crédito",
            title: "Error",
            type: "error",
          })
        );
      }
    }
  }, [isSuccess, isError, isLoading, error, responseData]);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Cartas de Crédito", href: "/operaciones/cartas-de-credito" },
              { name: "Nueva Carta de Crédito Comercial", href: "/operaciones/cartas-de-credito/nueva-carta-comercial" },
            ]}
          />
        </div>
        <div className="mb-6">
          <AdminPageHeader title="Cartas de Crédito" subtitle="Crear" icon={faFileInvoiceDollar} />
        </div>

        <div className="">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
        </div>
      </div>

      {responseData &&
        responseData.Errors &&
        responseData.Errors.length > 0 &&
        responseData.Errors.map((item, index) => (
          <Alert key={index.toString()} color="failure" className="mb-6">
            <span>
              <span className="font-medium">Información</span> {item}
            </span>
          </Alert>
        ))}

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6">
        <div className="md:col-span-3">
          <Label value="Tipo de Carta de Crédito" />
          <TextInput defaultValue="Comercial" type="text" disabled />
          <input type="hidden" value={1} {...register("TipoCartaId")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Activo" />
          <Select {...register("TipoActivoId")}>
            <option value={0}>Seleccione Opción</option>
            {catTiposActivo?.map((item, index) => (
              <option value={item.Id} key={index.toString()}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Proyecto" />
          <Select {...register("ProyectoId")}>
            <option value={0}>Seleccione Opción</option>
            {catProyectos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Banco" />
          <Select {...register("BancoId")}>
            <option value={0}>Seleccione Opción</option>
            {catBancos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Proveedor" />
          <Select {...register("ProveedorId")}>
            <option value={0}>Seleccione Opción</option>
            {catProveedores
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Empresa" />
          <Select {...register("EmpresaId")}>
            <option value={0}>Seleccione Opción</option>
            {catEmpresas
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Agente Aduanal" />
          <Select {...register("AgenteAduanalId")}>
            <option value={0}>Seleccione Opción</option>
            {catAgentesAduanales
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Moneda" />
          <Select {...register("MonedaId")}>
            <option value={0}>Seleccione Opción</option>
            {catMonedas
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Tipo de Pago" />
          <Select {...register("TipoPago")}>
            <option value={0}>Seleccione Opción</option>
            <option value="Estándar">Estándar</option>
            <option value="A Terceros">A Terceros</option>
            <option value="Otros">Otros</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Responsable" />
          <TextInput {...register("Responsable")} />
        </div>

        <div className="md:col-span-3">
          <Label value="Comprador" />
          <Select {...register("CompradorId")} {...register("CompradorId")}>
            <option value={0}>Seleccione Opción</option>
            {catCompradores
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6 bg-yellow-50 py-6">
        <div className="md:col-span-3">
          <Label value="% Tolerancia" />
          <TextInput type="text" {...register("PorcentajeTolerancia")} />
        </div>
        <div className="md:col-span-3">
          <Label value="No. Orden de Compra" />
          <TextInput type="text" {...register("NumOrdenCompra")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Costo Apertura" />
          <TextInput {...register("CostoApertura")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Monto Orden de Compra" />
          <TextInput {...register("MontoOrdenCompra")} />
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Original LC" />
          <TextInput {...register("MontoOriginalLC")} />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Efectuados" />
          <TextInput disabled />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Programados" />
          <TextInput disabled />
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Dispuesto" />
          <TextInput disabled />
        </div>

        <div className="md:col-span-3">
          <Label value="Saldo Insoluto" />
          <TextInput disabled />
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6">
        <div className="md:col-span-3">
          <Label value="Fecha Apertura" />
          <TextInput type="date" {...register("FechaApertura")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha Límite de Embarque" />
          <TextInput type="date" {...register("FechaLimiteEmbarque")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha de Vencimiento" />
          <TextInput type="date" {...register("FechaVencimiento")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Incoterm" />
          <TextInput type="text" {...register("Incoterm")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Embarques Parciales" />
          <Select {...register("EmbarquesParciales")}>
            <option value="0">Seleccione</option>
            <option value="Permitidos">Permitidos</option>
            <option value="No Permitidos">No permitidos</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Transbordos" />
          <Select {...register("Transbordos")}>
            <option value="0">Seleccione</option>
            <option value="Permitidos">Permitidos</option>
            <option value="No Permitidos">No permitidos</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Punto de Embarque" />
          <TextInput type="text" {...register("PuntoEmbarque")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Punto de Desembarque" />
          <TextInput type="text" {...register("PuntoDesembarque")} />
        </div>
      </div>

      <div className="bg-yellow-50 py-6 px-6">
        <div className="mb-6">
          <Label value="Descripción de la Mercancía" />
          <Textarea {...register("DescripcionMercancia")} />
        </div>
        <div className="mb-6">
          <Label value="Descripción de la Carta de Crédito" />
          <Textarea {...register("DescripcionCartaCredito")} />
        </div>
        <div className="mb-6">
          <Label value="Pago vs Carta de Aceptación" />
          <Textarea {...register("PagoCartaAceptacion")} />
        </div>
        <div className="mb-6">
          <Label value="Consignación de la Mercancía" />
          <Textarea {...register("ConsignacionMercancia")} />
        </div>
        <div className="mb-6">
          <Label value="Consideraciones Adicionales" />
          <Textarea {...register("ConsideracionesAdicionales")} />
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 p-6">
        <div className="md:col-span-3">
          <Label value="Días para presentar documentos" />
          <TextInput type="number" {...register("DiasParaPresentarDocumentos")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Días de plazo proveedor" />
          <TextInput type="number" {...register("DiasPlazoProveedor")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Condiciones de Pago" />
          <Select {...register("CondicionesPago")}>
            <option>Seleccione opción</option>
            <option value="Pago a la vista">Pago a la vista</option>
            <option value="Pago diferido">Pago diferido</option>
            <option value="Pago refinanciado">Pago refinanciado</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Número de Periodos" />
          <TextInput type="number" {...register("NumeroPeriodos")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Banco Corresponsal" />
          <Select {...register("BancoCorresponsalId")}>
            <option value={0}>Seleccione Opción</option>
            {catBancos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Seguro por cuenta" />
          <Select {...register("SeguroPorCuenta")}>
            <option>Seleccione opción</option>
            <option>Ordenante</option>
            <option>Beneficiario</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Gastos y comisiones corresponsal" />
          <Select {...register("GastosComisionesCorresponsal")}>
            <option>Seleccione opción</option>
            <option>Ordenante</option>
            <option>Beneficiario</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Confirmar banco notificador" />
          <Select {...register("ConfirmacionBancoNotificador")}>
            <option>Seleccione opción</option>
            <option>Requerido</option>
            <option>No requerido</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Emisión" />
          <Select {...register("TipoEmision")}>
            <option>Seleccione Tipo de Emisión</option>
            <option value="Línea de Crédito">Línea de Crédito</option>
            <option value="Provisión de Fondos">Provisión de Fondos</option>
            <option value="Provisión de Tesorería">Provisión de Tesorería</option>
          </Select>
        </div>
      </div>

      <div className="m-6">
        <Table>
          <Table.Head>
            <Table.HeadCell>Documentos a negociar</Table.HeadCell>
            <Table.HeadCell>Copias</Table.HeadCell>
            <Table.HeadCell>Originales</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {catDocumentos?.map((item, index) => {
              return (
                <Table.Row key={index.toString()}>
                  <Table.Cell width="60%">{item.Nombre}</Table.Cell>
                  <Table.Cell>
                    <TextInput type="number" />
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput type="number" />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>

        <div className="mt-6">
          <Button onClick={_handleSubmit}>REGISTRAR SOLICITUD</Button>
        </div>
      </div>
    </>
  );
}
export default NuevaCartaComercial;
