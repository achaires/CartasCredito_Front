import { useGetBancosQuery } from "@/apis/bancosApi";
import { useAddCartaComercialMutation, useAddCartaStandByMutation, useLazyGetCartaComercialQuery, useUpdateCartaStandByMutation } from "@/apis/cartasCreditoApi";
import { useGetCompradoresQuery } from "@/apis/compradoresApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faCircleArrowLeft, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import DatePicker from "react-datepicker";
import { IComprador } from "@/interfaces";

// Fix DatePicker + React Hook Form: https://github.com/Hacker0x01/react-datepicker/issues/2165#issuecomment-696095748

const validationSchema = z.object({
  TipoCartaId: z.number().min(1),
  TipoStandBy: z.string().min(1),
  BancoId: z.number().min(1),
  EmpresaId: z.number().min(1),
  MonedaId: z.number().min(1),
  CompradorId: z.number().min(1),
  MontoOriginalLC: z.number().min(1),
  FechaApertura: z.date().refine((fa) => fa.toString()),
  FechaLimiteEmbarque: z.date().refine((fle) => fle.toString()),
  FechaVencimiento: z.date().refine((fv) => fv.toString()),
  /* Incoterm: z.string().min(1), */
  ConsideracionesReclamacion: z.string().min(1),
  ConsideracionesAdicionales: z.string().min(1),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const DatePickerCustomInput = ({ value, onClick }: { value: string; onClick: React.MouseEventHandler<HTMLInputElement> }, ref: React.Ref<HTMLInputElement>) => (
  <TextInput onClick={onClick} value={value} readOnly />
);

export const CartaEditarStandBy = () => {
  const routeParams = useParams();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const [availableCompradores, setAvailableCompradores] = useState<Array<IComprador>>([]);
  const watchEmpresa = watch("EmpresaId");

  const { data: catBancos } = useGetBancosQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catCompradores } = useGetCompradoresQuery();

  const [getCartaComercial, { data: cartaCreditoDetalle, isLoading: isLoadingDetalle, isSuccess: isSuccessDetalle }] = useLazyGetCartaComercialQuery();
  const [updateCartaStandBy, { data: responseData, isSuccess, isError, isLoading, error }] = useUpdateCartaStandByMutation();

  const dispatch = useAppDispatch();

  const _handleBack = useCallback(() => {
    nav(-1);
  }, []);

  const _handleSubmit = handleSubmit((formData) => {
    //@ts-ignore
    updateCartaStandBy({ Id: cartaCreditoDetalle?.Id, ...formData });
  });

  useEffect(() => {
    if (routeParams.cartaCreditoId) {
      getCartaComercial(routeParams.cartaCreditoId);
    }
  }, [routeParams]);

  useEffect(() => {
    if (isSuccessDetalle && cartaCreditoDetalle) {
      setValue("TipoStandBy", cartaCreditoDetalle.TipoStandBy || "");
      setValue("BancoId", cartaCreditoDetalle.BancoId || 0);
      setValue("EmpresaId", cartaCreditoDetalle.EmpresaId || 0);
      setValue("MonedaId", cartaCreditoDetalle.MonedaId || 0);
      setValue("CompradorId", cartaCreditoDetalle.CompradorId || 0);
      setValue("MontoOriginalLC", cartaCreditoDetalle.MontoOriginalLC || 0);
      setValue("ConsideracionesAdicionales", cartaCreditoDetalle.ConsideracionesAdicionales || "");
      setValue("ConsideracionesReclamacion", cartaCreditoDetalle.ConsideracionesReclamacion || "");

      if (cartaCreditoDetalle.FechaApertura) {
        var faDate = new Date(cartaCreditoDetalle.FechaApertura);
        setValue("FechaApertura", faDate);
      }

      if (cartaCreditoDetalle.FechaLimiteEmbarque) {
        var fle = new Date(cartaCreditoDetalle.FechaLimiteEmbarque);
        setValue("FechaLimiteEmbarque", fle);
      }

      if (cartaCreditoDetalle.FechaVencimiento) {
        var fv = new Date(cartaCreditoDetalle.FechaVencimiento);
        setValue("FechaVencimiento", fv);
      }
    }
  }, [isSuccessDetalle]);

  useEffect(() => {
    if (catCompradores) {
      setAvailableCompradores(catCompradores.filter((c) => c.Activo));
    }
  }, [catCompradores]);

  useEffect(() => {
    if (watchEmpresa && catCompradores) {
      let newCompradores = [...catCompradores];
      setAvailableCompradores(newCompradores.filter((c) => c.Activo).filter((c) => c.EmpresaId === watchEmpresa));
    }
  }, [watchEmpresa]);

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
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              {
                name: "Cartas de Crédito",
                href: `${apiHost}/#/operaciones/cartas-de-credito`,
              },
              {
                name: "Nueva Carta de Crédito Stand By",
                href: `${apiHost}/#/operaciones/cartas-de-credito/nueva-carta-standby`,
              },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Cartas de Crédito" subtitle="Crear Stand By" icon={faFileInvoiceDollar} />
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
          <TextInput defaultValue="Stand By" type="text" disabled />
          <input type="hidden" value={18} {...register("TipoCartaId", { valueAsNumber: true })} />
        </div>

        <div className="md:col-span-3">
          <Label value="Tipo Stand By" />
          <Select {...register("TipoStandBy")} color={`${formErrors.TipoStandBy && "failure"}`}>
            <option value="">Seleccione Opción</option>
            <option value="A Favor">A Favor</option>
            <option value="A Cargo">A Cargo</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Banco" />
          <Select {...register("BancoId", { valueAsNumber: true })} color={`${formErrors.BancoId && "failure"}`}>
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
          <Label value="Empresa" />
          <Select {...register("EmpresaId", { valueAsNumber: true })}>
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
          <Label value="Moneda" />
          <Select {...register("MonedaId", { valueAsNumber: true })}>
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
          <Label value="Comprador" />
          <Select {...register("CompradorId", { valueAsNumber: true })}>
            <option value={0}>Seleccione Opción</option>
            {availableCompradores.map((item, index) => (
              <option value={item.Id} key={index.toString()}>
                {item.Nombre}
              </option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Original LC" />
          <TextInput type="number" {...register("MontoOriginalLC", { valueAsNumber: true })} />
        </div>

        {/* <div className="md:col-span-3">
          <Label value="Incoterm" />
          <TextInput type="text" {...register("Incoterm")} />
        </div> */}
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6">
        <div className="md:col-span-3">
          <Label value="Fecha Apertura" />
          <Controller
            control={control}
            name="FechaApertura"
            render={({ field }) => (
              <DatePicker
                customInput={React.createElement(React.forwardRef(DatePickerCustomInput))}
                placeholderText="Seleccione Fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat="yyyy/MM/dd"
              />
            )}
          />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha Límite de Embarque" />
          <Controller
            control={control}
            name="FechaLimiteEmbarque"
            render={({ field }) => (
              <DatePicker
                customInput={React.createElement(React.forwardRef(DatePickerCustomInput))}
                placeholderText="Seleccione Fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat="yyyy/MM/dd"
              />
            )}
          />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha de Vencimiento" />
          <Controller
            control={control}
            name="FechaVencimiento"
            render={({ field }) => (
              <DatePicker
                customInput={React.createElement(React.forwardRef(DatePickerCustomInput))}
                placeholderText="Seleccione Fecha"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat="yyyy/MM/dd"
              />
            )}
          />
        </div>
      </div>

      <div className="bg-yellow-50 py-6 px-6 md:flex gap-6">
        <div className="mb-4 flex-1">
          <Label value="Consideraciones Generales de Reclamación" />
          <Textarea rows={5} className="text-sm" {...register("ConsideracionesReclamacion")} />
        </div>
        <div className="mb-4 flex-1">
          <Label value="Consideraciones Adicionales" />
          <Textarea rows={5} className="text-sm" {...register("ConsideracionesAdicionales")} />
        </div>
      </div>

      <div className="m-6">
        <div className="mt-6">
          <Button onClick={_handleSubmit}>ACTUALIZAR SOLICITUD</Button>
        </div>
      </div>
    </>
  );
};
