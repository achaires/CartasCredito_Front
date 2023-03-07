import { useLazyGetCartaComercialQuery, useUpdateCartaComercialEstatusMutation } from "@/apis/cartasCreditoApi";
import { AdminBreadcrumbs, AdminPageHeader, CartaSwiftModal } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faFileInvoiceDollar, faCircleArrowLeft, faUpload, faDollarSign, faCheckCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import numeral from "numeral";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type EstatusButtonProps = {
  estatus: number;
};

export const EstatusButton = ({ estatus }: EstatusButtonProps) => {
  var btn = (
    <Button size="sm" className="bg-brandPrimary">
      Registrada
    </Button>
  );
  switch (estatus) {
    case 1:
      btn = (
        <Button size="sm" className="bg-brandPrimary">
          Registrada
        </Button>
      );
      break;
    case 2:
      btn = (
        <Button size="sm" color="dark">
          Emitida
        </Button>
      );
      break;
    case 3:
      btn = (
        <Button size="sm" color="warning">
          Enmienda Pendiente
        </Button>
      );
      break;
    case 4:
      btn = (
        <Button size="sm" color="success">
          Pagada
        </Button>
      );
      break;
    case 5:
      btn = (
        <Button size="sm" className="bg-brandPrimary">
          Registrada
        </Button>
      );
      break;
  }

  return btn;
};

export const CartasDeCreditoDetalle = () => {
  const routeParams = useParams();
  const nav = useNavigate();

  const [showCartaPagadaModal, setShowCartaPagadaModal] = useState(false);
  const [showSwiftModal, setShowSwiftModal] = useState(false);

  const dispatch = useAppDispatch();

  const [getCartaComercial, { data: cartaCreditoDetalle }] = useLazyGetCartaComercialQuery();
  const [updateEstatus, { data: updatedCartaCredito, isSuccess: updateEstatusSuccess, isError: updateEstatusError }] = useUpdateCartaComercialEstatusMutation();

  const _handleBack = useCallback(() => {
    nav(`/operaciones/cartas-de-credito`);
  }, []);

  useEffect(() => {
    if (routeParams.cartaCreditoId) {
      getCartaComercial(routeParams.cartaCreditoId);
    }
  }, [routeParams]);

  useEffect(() => {
    if (updateEstatusSuccess) {
      if (updatedCartaCredito) {
        if (updatedCartaCredito.Errors && updatedCartaCredito.Errors.length > 0) {
          dispatch(addToast({ title: "Error", message: "Ocurrió un problema al actualizar", type: "error" }));
        } else {
          dispatch(addToast({ title: "Éxito", message: "El estatus ha sido cambiado", type: "success" }));
          setShowCartaPagadaModal(false);
        }
      } else {
        dispatch(addToast({ title: "Error", message: "Ocurrió un problema al actualizar", type: "error" }));
      }
    }

    if (updateEstatusError) {
      dispatch(addToast({ title: "Error", message: "Ocurrió un problema al actualizar", type: "error" }));
    }
  }, [updateEstatusSuccess, updateEstatusError, updatedCartaCredito]);

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Cartas de Crédito", href: "/operaciones/cartas-de-credito" },
              { name: "Detalle de Carta", href: "#" },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Cartas de Crédito" subtitle="Detalle de Carta de Crédito" icon={faFileInvoiceDollar} />
        </div>

        <div className="">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-4 mb-6 px-6">
        <div className="col-span-3">{cartaCreditoDetalle && cartaCreditoDetalle.Estatus && <EstatusButton estatus={cartaCreditoDetalle.Estatus} />}</div>
        {cartaCreditoDetalle && cartaCreditoDetalle.DocumentoSwift !== "" && (
          <div className="col-span-9 text-right">
            <a target="_blank" className="bg-brandPrimary p-2 rounded text-white" href={cartaCreditoDetalle.DocumentoSwift}>
              Descargar Archivo Swift
            </a>
          </div>
        )}

        {/* @if (Model.DocumentoSwift != "")
                    {
                        <a target="_blank" className="btn btn-dark" href="@Utility.HostUrl/Uploads/@Model.DocumentoSwift">Descargar Archivo Swift</a>
                    } */}
        {/* <button type="submit" className="btn btn-dark">
            Clonar
          </button> */}
      </div>

      <form className="pb-24">
        <div className="md:grid md:grid-cols-12 md:gap-4 mb-6 px-6">
          <div className="md:col-span-3">
            <Label value="No. Carta de Crédito:" />
            <TextInput type="text" name="numCarta" defaultValue={cartaCreditoDetalle?.NumCartaCredito} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Tipo de Carta:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.TipoCarta} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Tipo de Activo:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.TipoActivo} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Proyecto:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Proyecto} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Banco:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Banco} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Proveedor:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Proveedor} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Empresa:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Empresa} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Agente Aduanal:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.AgenteAduanal} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Moneda:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Moneda} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Tipo de Pago:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.TipoPago} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Responsable:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Responsable} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Comprador:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Comprador} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="% Tolerancia:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.PorcentajeTolerancia} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="No. Orden de Compra:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.NumOrdenCompra} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Costo de Apertura:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.CostoApertura).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Monto Orden de Compra:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.MontoOrdenCompra).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Monto Original L/C:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.MontoOriginalLC).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Pagos Efectuados:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.PagosEfectuados).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Pagos Programados:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.PagosProgramados).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Monto Dispuesto:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.MontoDispuesto).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Saldo Insoluto:" />
            <TextInput type="text" defaultValue={numeral(cartaCreditoDetalle?.SaldoInsoluto).format("$0,0.00")} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Fecha de Apertura:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.FechaApertura} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Icoterm:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Incoterm} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Fecha Límite de Embarque:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.FechaLimiteEmbarque} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Fecha de Vencimiento:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.FechaVencimiento} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Embarques Parciales:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.EmbarquesParciales} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Transbordos:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.Transbordos} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Punto de Embarque:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.PuntoEmbarque} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Punto de Desembarque:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.PuntoDesembarque} disabled />
          </div>
        </div>

        <div className="bg-yellow-50 py-6 px-6">
          <div className="mb-4">
            <Label value="Descripción de Mercancía:" />
            <Textarea disabled defaultValue={cartaCreditoDetalle?.DescripcionMercancia} />
          </div>

          <div className="mb-4">
            <Label value="Descripción de la carta de crédito:" />
            <Textarea disabled defaultValue={cartaCreditoDetalle?.DescripcionCartaCredito} />
          </div>

          <div className="mb-4">
            <Label value="Pago vs carta de aceptación:" />
            <Textarea disabled defaultValue={cartaCreditoDetalle?.PagoCartaAceptacion} />
          </div>

          <div className="mb-4">
            <Label value="Consignación de mercancía:" />
            <Textarea disabled defaultValue={cartaCreditoDetalle?.ConsignacionMercancia} />
          </div>

          <div className="mb-4">
            <Label value="Consideraciones adicionales:" />
            <Textarea disabled defaultValue={cartaCreditoDetalle?.ConsideracionesAdicionales} />
          </div>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-4 mb-6 p-6">
          <div className="md:col-span-3">
            <Label value="Días para presentar documentos:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.DiasParaPresentarDocumentos} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Días de plazo proveedor:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.DiasPlazoProveedor} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Condiciones de pago:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.CondicionesPago} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Número de periodos:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.NumeroPeriodos} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Banco Corresponsal:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.BancoCorresponsal} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Seguro por Cuenta:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.SeguroPorCuenta} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Gastos y Comisiones de Corresponsal:" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.GastosComisionesCorresponsal} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Confirmar Banco Notificador" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.ConfirmacionBancoNotificador} disabled />
          </div>
          <div className="md:col-span-3">
            <Label value="Tipo de Emisión" />
            <TextInput type="text" defaultValue={cartaCreditoDetalle?.TipoEmision} disabled />
          </div>
        </div>
      </form>

      <div id="controles-footer" className="fixed bottom-0 left-0 w-full bg-brandPrimary p-6 text-white flex items-center justify-center gap-12">
        {/* <a href="#" className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faPencil} className="h-6" />
          <span className="text-sm">Editar Solicitud</span>
        </a>
        */}
        {cartaCreditoDetalle && cartaCreditoDetalle.Estatus && Number(cartaCreditoDetalle.Estatus) === 1 && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowSwiftModal(true);
            }}
            className="flex flex-col items-center justify-around gap-2">
            <FontAwesomeIcon icon={faUpload} className="h-6" />
            <span className="text-sm">Archivo Swift</span>
          </a>
        )}

        <Link to={`/operaciones/cartas-de-credito/${cartaCreditoDetalle?.Id}/pagos`} className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faDollarSign} className="h-6" />
          <span className="text-sm">Pagos</span>
        </Link>
        <Link to={`/operaciones/cartas-de-credito/${cartaCreditoDetalle?.Id}/comisiones`} className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faPlusCircle} className="h-6" />
          <span className="text-sm">Comisiones</span>
        </Link>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowCartaPagadaModal(true);
          }}
          className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="h-6" />
          <span className="text-sm">Registrar Pagada</span>
        </a>
        {/* <a href="#" className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-6" />
          <span className="text-sm">Enmiendas</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-around gap-2">
          <FontAwesomeIcon icon={faPrint} className="h-6" />
          <span className="text-sm">Imprimir</span>
        </a> */}
      </div>

      {cartaCreditoDetalle && cartaCreditoDetalle.Id && (
        <CartaSwiftModal show={showSwiftModal} handleClose={() => setShowSwiftModal(false)} cartaCreditoId={cartaCreditoDetalle.Id} />
      )}

      <Modal dismissible={true} show={showCartaPagadaModal} onClose={() => setShowCartaPagadaModal(false)}>
        <Modal.Header>Confirmar</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {updatedCartaCredito &&
              updatedCartaCredito.Errors &&
              updatedCartaCredito.Errors.map((item, index) => (
                <Alert key={index.toString()} color="failure" className="mb-6">
                  <span>
                    <span className="font-medium">Información</span> {item}
                  </span>
                </Alert>
              ))}
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer. ¿Está seguro de continuar?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-brandPrimary hover:bg-brandDark" onClick={() => updateEstatus({ ...cartaCreditoDetalle, Estatus: 4 })}>
            Continuar
          </Button>
          <Button color="gray" onClick={() => setShowCartaPagadaModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
