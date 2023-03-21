import { useLazyGetCartaComercialQuery } from "@/apis";
import { AdminLoadingActivity, AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { apiHost } from "@/utils/apiConfig";
import { faFileInvoiceDollar, faCircleArrowLeft, faSave, faClose, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import numeral from "numeral";
import { useAddEnmiendaMutation, useApproveEnmiendaMutation } from "@/apis/enmiendasApi";
import { useForm } from "react-hook-form";
import { IEnmienda, IEnmiendaInsert } from "@/interfaces";
import { addToast } from "@/store/uiSlice";

export const CartasCreditoEnmiendas = () => {
  const routeParams = useParams();
  const nav = useNavigate();

  const dispatch = useAppDispatch();

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IEnmiendaInsert>();

  const [getCartaComercial, { data: cartaCreditoDetalle, isLoading, isSuccess: isGetDetalleSuccess }] = useLazyGetCartaComercialQuery();
  const [addEnmienda, { data, isSuccess, isError }] = useAddEnmiendaMutation();
  const [approveEnmienda, { data: approveData, isSuccess: approveIsSuccess, isError: approveIsError }] = useApproveEnmiendaMutation();

  const _handleBack = useCallback(() => {
    nav(`/operaciones/cartas-de-credito/${cartaCreditoDetalle?.Id}`);
  }, [cartaCreditoDetalle]);

  const _handleSubmit = handleSubmit((formData) => {
    if (cartaCreditoDetalle && cartaCreditoDetalle.Id) {
      if (cartaCreditoDetalle.Estatus === 21 && cartaCreditoDetalle.Enmiendas) {
        approveEnmienda({ ...formData, CartaCreditoId: cartaCreditoDetalle.Id, Estatus: 2, Id: cartaCreditoDetalle.Enmiendas[0].Id });
      } else {
        addEnmienda({ ...formData, CartaCreditoId: cartaCreditoDetalle.Id });
      }
    }
  });
  useEffect(() => {
    if (routeParams.cartaCreditoId) {
      getCartaComercial(routeParams.cartaCreditoId);
    }
  }, [routeParams]);

  useEffect(() => {
    if (isGetDetalleSuccess && cartaCreditoDetalle && cartaCreditoDetalle.Enmiendas && cartaCreditoDetalle.Enmiendas[0] && cartaCreditoDetalle.Enmiendas[0].Estatus === 1) {
      setValue("ImporteLC", cartaCreditoDetalle.Enmiendas[0].ImporteLC);

      if (cartaCreditoDetalle.Enmiendas[0].FechaVencimiento) {
        let fv = cartaCreditoDetalle.Enmiendas[0].FechaVencimiento.split("T");
        setValue("FechaVencimiento", fv[0]);
      }

      if (cartaCreditoDetalle.Enmiendas[0].FechaLimiteEmbarque) {
        let fle = cartaCreditoDetalle.Enmiendas[0].FechaLimiteEmbarque.split("T");
        setValue("FechaLimiteEmbarque", fle[0]);
      }

      setValue("DescripcionMercancia", cartaCreditoDetalle.Enmiendas[0].DescripcionMercancia);
      setValue("ConsideracionesAdicionales", cartaCreditoDetalle.Enmiendas[0].ConsideracionesAdicionales);
      setValue("InstruccionesEspeciales", cartaCreditoDetalle.Enmiendas[0].InstruccionesEspeciales);
    }
  }, [isGetDetalleSuccess]);

  useEffect(() => {
    if (approveIsSuccess && approveData) {
      if (approveData.DataInt && approveData.DataInt > 0) {
        dispatch(
          addToast({
            title: "Información",
            type: "success",
            message: "Solicitud de enmienda aprobada correctamente",
          })
        );

        _handleBack();
      } else {
        dispatch(
          addToast({
            title: "Información",
            type: "error",
            message: approveData.Errors && approveData.Errors[0] ? approveData.Errors[0] : "Ocurrió un error desconocido",
          })
        );
      }
    }

    if (approveIsError && approveData && approveData.Errors) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: approveData.Errors[0],
        })
      );
    }
  }, [approveIsSuccess, approveData, approveIsError]);

  useEffect(() => {
    if (isSuccess && data) {
      if (data.DataInt && data.DataInt > 0) {
        dispatch(
          addToast({
            title: "Información",
            type: "success",
            message: "Solicitud de enmienda enviada correctamente",
          })
        );

        _handleBack();
      } else {
        dispatch(
          addToast({
            title: "Información",
            type: "error",
            message: data.Errors && data.Errors[0] ? data.Errors[0] : "Ocurrió un error desconocido",
          })
        );
      }
    }

    if (isError && data && data.Errors) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: data.Errors[0],
        })
      );
    }
  }, [isSuccess, data, isError]);

  if (isLoading || !cartaCreditoDetalle) {
    return <AdminLoadingActivity />;
  }

  return (
    <>
      <div className="p-6 text-sm">
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Cartas de Crédito", href: `${apiHost}/#/operaciones/cartas-de-credito` },
              { name: "Detalle de Carta", href: "#" },
              { name: "Enmiendas", href: "#" },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Cartas de Crédito" subtitle="Emiendas" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-4">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
        </div>

        <form className="mb-12" onSubmit={_handleSubmit}>
          <Card className="mb-4">
            <h3 className="text-lg font-bold">Registro - Edición de Enmienda</h3>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <p className="flex-1 flex items-center justify-between">
                  Fecha de Solicitud: <span>{new Date().toLocaleDateString()}</span>
                </p>
                <p className="flex-1 flex items-center justify-between">
                  Referencia de Carta de Crédito: <span>{cartaCreditoDetalle.NumCartaCredito}</span>
                </p>
                <p className="flex-1 flex items-center justify-between">
                  Nombre del Contacto de Solicitante: <span>Test User</span>
                </p>
              </div>
              <div className="md:col-span-4 md:col-start-9 flex items-center">
                <p className="flex-1 flex items-center justify-between">
                  Banco: <span>{cartaCreditoDetalle.Banco}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-5">
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5 flex items-center justify-between gap-4">
                <Label value="Importe de L/C" />
                <TextInput value={numeral(cartaCreditoDetalle.MontoOriginalLC).format("$ 0,0.00")} disabled />
              </div>
              <div className="md:col-span-5 md:col-start-7 flex items-center justify-between gap-4">
                <Label value="Nuevo Importe de L/C" />
                <TextInput {...register("ImporteLC")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5 flex items-center justify-between gap-4">
                <Label value="Fecha de Vencimiento" />
                <TextInput value={cartaCreditoDetalle.FechaVencimiento?.toString()} disabled />
              </div>
              <div className="md:col-span-5 md:col-start-7 flex items-center justify-between gap-4">
                <Label value="Nueva Fecha de Vencimiento" />
                <TextInput type="date" {...register("FechaVencimiento")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5 flex items-center justify-between gap-4">
                <Label value="Fecha Límite de Embarque" />
                <TextInput value={cartaCreditoDetalle.FechaLimiteEmbarque?.toString()} disabled />
              </div>
              <div className="md:col-span-5 md:col-start-7 flex items-center justify-between gap-4">
                <Label value="Nueva Fecha Límite de Embarque" />
                <TextInput type="date" {...register("FechaLimiteEmbarque")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <h3 className="font-bold">Descripción de Mercancías</h3>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-6">
                <Label value="Actual" />
                <Textarea value={cartaCreditoDetalle.DescripcionMercancia ? cartaCreditoDetalle.DescripcionMercancia : ""} disabled />
              </div>
              <div className="md:col-span-6">
                <Label value="Debe Decir" />
                <Textarea {...register("DescripcionMercancia")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <h3 className="font-bold">Consideraciones Adicionales</h3>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-6">
                <Label value="Actual" />
                <Textarea value={cartaCreditoDetalle.ConsideracionesAdicionales ? cartaCreditoDetalle.ConsideracionesAdicionales : ""} disabled />
              </div>
              <div className="md:col-span-6">
                <Label value="Debe Decir" />
                <Textarea {...register("ConsideracionesAdicionales")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="font-bold">Instrucciones Especiales</h3>
            <div className="md:grid md:grid-cols-12 md:gap-12">
              <div className="md:col-span-6">
                <Label value="Actual" />
                <Textarea value={cartaCreditoDetalle.InstruccionesEspeciales ? cartaCreditoDetalle.InstruccionesEspeciales : ""} disabled />
              </div>
              <div className="md:col-span-6">
                <Label value="Debe Decir" />
                <Textarea {...register("InstruccionesEspeciales")} required readOnly={cartaCreditoDetalle.Estatus === 21} />
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <Button color="failure" onClick={_handleBack}>
              <FontAwesomeIcon icon={faClose} className="mr-2" />
              Cancelar
            </Button>
            {cartaCreditoDetalle.Estatus !== 21 && (
              <Button type="submit">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Guardar
              </Button>
            )}

            {cartaCreditoDetalle.Estatus === 21 && (
              <Button type="submit" color="success">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Aprobar Solicitud de Enmienda
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
