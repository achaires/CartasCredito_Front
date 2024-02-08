import { useGetAgentesAduanalesQuery } from "@/apis/agentesAduanalesApi";
import { useGetBancosQuery } from "@/apis/bancosApi";
import { useAddCartaComercialMutation, useLazyGetCartaComercialQuery, useUpdateCartaComercialMutation } from "@/apis/cartasCreditoApi";
import { useGetCompradoresQuery } from "@/apis/compradoresApi";
import { useGetDocumentosQuery } from "@/apis/documentosApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { useGetProveedoresQuery } from "@/apis/proveedoresApi";
import { useGetProyectosQuery } from "@/apis/proyectosApi";
import { useGetTiposActivoQuery } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faCircleArrowLeft, faFileInvoiceDollar, faInfoCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Label, Select, Table, Textarea, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { CustomSpinner } from "@/components";

import { z } from "zod";
import DatePicker from "react-datepicker";
import { useGetUsersQuery } from "@/apis";
import { toast } from "react-hot-toast";
import { IComprador } from "@/interfaces";

// Fix DatePicker + React Hook Form: https://github.com/Hacker0x01/react-datepicker/issues/2165#issuecomment-696095748

const validationSchema = z
  .object({
    TipoCartaId: z.number().min(1),
    TipoActivoId: z.number().min(1),
    ProyectoId: z.number().min(1),
    BancoId: z.number().min(1),
    ProveedorId: z.number().min(1),
    EmpresaId: z.number().min(1),
    AgenteAduanalId: z.number().min(1),
    MonedaId: z.number().min(1),
    TipoPago: z.string(),
    Responsable: z.string(),
    CompradorId: z.number().min(1),
    PorcentajeTolerancia: z.number(),
    NumOrdenCompra: z.string().min(1),
    CostoApertura: z.number().min(1),
    MontoOrdenCompra: z.number().min(1),
    MontoOriginalLC: z.number().min(1),
    FechaApertura: z.date().refine((fa) => fa.toString()),
    FechaLimiteEmbarque: z.date().refine((fle) => fle.toString()),
    FechaVencimiento: z.date().refine((fv) => fv.toString()),
      Incoterm: z.string().min(1),
      EmbarquesParciales: z.string().min(1),
    Transbordos: z.string().min(1),
    PuntoEmbarque: z.string().min(1),
    PuntoDesembarque: z.string().min(1),
    DescripcionMercancia: z.string().min(1),
    DescripcionCartaCredito: z.string().min(1),
    PagoCartaAceptacion: z.string().min(1),
    ConsignacionMercancia: z.string().min(1),
    ConsideracionesAdicionales: z.string().min(1),
    DiasParaPresentarDocumentos: z.number().min(1).max(21),
    DiasPlazoProveedor: z.number().min(1),
    CondicionesPago: z.string().min(1),
    BancoCorresponsalId: z.number().min(1),
    SeguroPorCuenta: z.string().min(1),
    GastosComisionesCorresponsal: z.string().min(1),
    ConfirmacionBancoNotificador: z.string().min(1),
      TipoEmision: z.string().min(1),
      NumeroPeriodos: z.number().min(1),
  })
  .refine(
    (args) => {
      let tiempoLimite = args.FechaVencimiento.getTime();
      let tiempoCalculado = args.FechaLimiteEmbarque.getTime() + 86400000 * args.DiasParaPresentarDocumentos;

      if (tiempoLimite > tiempoCalculado) {
        return true;
      } else {
        return false;
      }
    },
    {
      message: "La fecha límite de embarque no puede ser mayor a la fecha de vencimiento",
      path: ["FechaLimiteEmbarque"],
    }
  );

type DocAgregado = {
  DocId: number;
  Originales: number;
  Copias: number;
  Nombre?: string;
};

type ValidationSchema = z.infer<typeof validationSchema>;

const DatePickerCustomInput = ({ value, onClick }: { value: string; onClick: React.MouseEventHandler<HTMLInputElement> }, ref: React.Ref<HTMLInputElement>) => (
  <TextInput onClick={onClick} value={value} readOnly />
);

export const CartaCreditoEditar = () => {
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

  const { data: catTiposActivo } = useGetTiposActivoQuery();
  const { data: catProyectos } = useGetProyectosQuery();
  const { data: catBancos } = useGetBancosQuery();
  const { data: catProveedores } = useGetProveedoresQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catAgentesAduanales } = useGetAgentesAduanalesQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catCompradores } = useGetCompradoresQuery();
  const { data: catDocumentos } = useGetDocumentosQuery();
  const { data: catUsuarios } = useGetUsersQuery();

  const [getCartaComercial, { data: cartaCreditoDetalle, isLoading: isLoadingDetalle, isSuccess: isSuccessDetalle }] = useLazyGetCartaComercialQuery();
  const [updateCarta, { data: responseData, isSuccess, isError, isLoading, error }] = useUpdateCartaComercialMutation();

  const [docsAgregados, setDocsAgregados] = useState<Array<DocAgregado>>([]);
  const [docId, setDocId] = useState(0);
  const [docCopias, setDocCopias] = useState(0);
  const [docOriginales, setDocOriginales] = useState(0);
  const [availableCompradores, setAvailableCompradores] = useState<Array<IComprador>>([]);
  const watchEmpresa = watch("EmpresaId");

    const dispatch = useAppDispatch();


    const [cargaTerminada, setCargaTerminada] = useState(false);

  const _handleBack = useCallback(() => {
    nav(-1);
  }, []);

  const _docAgregar = () => {
    if (docId < 1 || docCopias < 1 || docOriginales < 1) {
      toast.error("Seleccione documento, copias y originales");
      return;
    }

    let newDocsAgregados = Array<DocAgregado>();

    newDocsAgregados = [...docsAgregados];

    if (catDocumentos) {
      let docAgregado = catDocumentos.find((i) => i.Id === docId);

      newDocsAgregados.push({
        DocId: docId,
        Copias: docCopias,
        Originales: docOriginales,
        Nombre: docAgregado?.Nombre,
      });

      setDocsAgregados(newDocsAgregados);

      setDocId(0);
      setDocCopias(0);
      setDocOriginales(0);
    }
  };

  const _docEliminar = (docId: number) => {
    let newDocsAgregados = Array<DocAgregado>();
    let docIndex = docsAgregados.findIndex((i) => i.DocId === docId);

    newDocsAgregados = [...docsAgregados];

    if (docIndex > -1) {
      newDocsAgregados.splice(docIndex, 1);
    }

    setDocsAgregados(newDocsAgregados);
  };

  const _handleSubmit = handleSubmit((formData) => {
    //@ts-ignore
      updateCarta({ DocumentoANegociar: docsAgregados, Id: cartaCreditoDetalle?.Id, ...formData });
  });

  useEffect(() => {
    if (routeParams.cartaCreditoId) {
      getCartaComercial(routeParams.cartaCreditoId);
    }
  }, [routeParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('This will run after 1 second!');
            if (isSuccessDetalle && cartaCreditoDetalle) {
                setValue("TipoActivoId", cartaCreditoDetalle.TipoActivoId || 0);
                setValue("ProyectoId", cartaCreditoDetalle.ProyectoId || 0);
                setValue("BancoId", cartaCreditoDetalle.BancoId || 0);
                setValue("ProveedorId", cartaCreditoDetalle.ProveedorId || 0);
                setValue("EmpresaId", cartaCreditoDetalle.EmpresaId || 0);
                setValue("AgenteAduanalId", cartaCreditoDetalle.AgenteAduanalId || 0);
                setValue("MonedaId", cartaCreditoDetalle.MonedaId || 0);
                setValue("TipoPago", cartaCreditoDetalle.TipoPago || "");
                setValue("Responsable", cartaCreditoDetalle.Responsable || "");
                setValue("PorcentajeTolerancia", cartaCreditoDetalle.PorcentajeTolerancia || 0);
                setValue("NumOrdenCompra", cartaCreditoDetalle.NumOrdenCompra || "");
                setValue("CostoApertura", cartaCreditoDetalle.CostoApertura || 0);
                setValue("MontoOrdenCompra", cartaCreditoDetalle.MontoOrdenCompra || 0);
                setValue("MontoOriginalLC", cartaCreditoDetalle.MontoOriginalLC || 0);
                setValue("Incoterm", cartaCreditoDetalle.Incoterm || "");
                setValue("EmbarquesParciales", cartaCreditoDetalle.EmbarquesParciales || "");
                setValue("Transbordos", cartaCreditoDetalle.Transbordos || "");
                setValue("PuntoEmbarque", cartaCreditoDetalle.PuntoEmbarque || "");
                setValue("PuntoDesembarque", cartaCreditoDetalle.PuntoDesembarque || "");
                setValue("DescripcionMercancia", cartaCreditoDetalle.DescripcionMercancia || "");
                setValue("DescripcionCartaCredito", cartaCreditoDetalle.DescripcionCartaCredito || "");
                setValue("PagoCartaAceptacion", cartaCreditoDetalle.PagoCartaAceptacion || "");
                setValue("ConsignacionMercancia", cartaCreditoDetalle.ConsignacionMercancia || "");
                setValue("ConsideracionesAdicionales", cartaCreditoDetalle.ConsideracionesAdicionales || "");
                setValue("DiasParaPresentarDocumentos", cartaCreditoDetalle.DiasParaPresentarDocumentos || 0);
                setValue("DiasPlazoProveedor", cartaCreditoDetalle.DiasPlazoProveedor || 0);
                setValue("CondicionesPago", cartaCreditoDetalle.CondicionesPago || "");
                setValue("BancoCorresponsalId", cartaCreditoDetalle.BancoCorresponsalId || 0);
                setValue("SeguroPorCuenta", cartaCreditoDetalle.SeguroPorCuenta || "");
                setValue("GastosComisionesCorresponsal", cartaCreditoDetalle.GastosComisionesCorresponsal || "");
                setValue("ConfirmacionBancoNotificador", cartaCreditoDetalle.ConfirmacionBancoNotificador || "");
                setValue("TipoEmision", cartaCreditoDetalle.TipoEmision || "");
                setValue("NumeroPeriodos", cartaCreditoDetalle.NumeroPeriodos || 0);

                if (cartaCreditoDetalle.DocumentoANegociar != null) {
                    let newDocsAgregados = Array<DocAgregado>();
                    for (var i = 0; i < cartaCreditoDetalle.DocumentoANegociar?.length; i++) {
                        newDocsAgregados.push({
                            DocId: cartaCreditoDetalle.DocumentoANegociar[i].IdDocumento,
                            Copias: cartaCreditoDetalle.DocumentoANegociar[i].Copias,
                            Originales: cartaCreditoDetalle.DocumentoANegociar[i].Originales,
                            Nombre: cartaCreditoDetalle.DocumentoANegociar[i].Nombre,
                        });

                        setDocsAgregados(newDocsAgregados);
                    }
                }

                /*--*/
                const timer2 = setTimeout(() => {
                    setValue("CompradorId", cartaCreditoDetalle.CompradorId || 0);
                }, 700);
                /*--*/
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

                setCargaTerminada(true);
            }
        }, 3000);


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
          message: "Ocurrió un problema al actualizar la carta de crédito",
          title: "Error",
          type: "error",
        })
      );
    }

    if (isSuccess) {
      if (responseData && responseData.DataInt && responseData.DataString && responseData.DataString.length > 0) {
        dispatch(
          addToast({
            message: "Carta de Crédito actualizada con éxito",
            title: "Éxito",
            type: "success",
          })
        );
      } else {
        dispatch(
          addToast({
            message: "Ocurrió un problema al actualizar la carta de crédito",
            title: "Error",
            type: "error",
          })
        );
      }
    }
  }, [isSuccess, isError, isLoading, error, responseData]);
    /*
    var cargado = false;
    if (isLoading || !cartaCreditoDetalle ||
        !catTiposActivo ||
        !catProyectos ||
        !catBancos ||
        !catProveedores ||
        !catEmpresas ||
        !catAgentesAduanales ||
        !catMonedas ||
        !catCompradores ||
        !catDocumentos ||
        !catUsuarios) {
        console.log("falta algun catalogo")
    } else {
        if (!cargado) {
            cargado = true;
            console.log("carta cargada inicio---------------------------------------------");
            console.log(cartaCreditoDetalle, catTiposActivo,
                catProyectos,
                catBancos,
                catProveedores,
                catEmpresas,
                catAgentesAduanales,
                catMonedas,
                catCompradores,
                catDocumentos,
                catUsuarios);

            console.log("carta cargada fin---------------------------------------------");
        }
    }*/

    /*if (isLoading || !cartaCreditoDetalle) {
        console.log("b");
        return (
            <div>
                <AdminLoadingActivity />
            </div>
        );
    } else {
        console.log("aaaaa");
    }*/


    const renderDetalle = (
        <div>
        </div>
    );
    const UnrenderDetalle = (
        <div>
            <CustomSpinner />
        </div>
    );

  return (
      <>
          {!cargaTerminada ? UnrenderDetalle : renderDetalle}
      <div className="p-6">
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Cartas de Crédito", href: `${apiHost}/#/operaciones/cartas-de-credito` },
              { name: "Editar Carta de Crédito Comercial", href: `${apiHost}/#/operaciones/cartas-de-credito/nueva-carta-comercial` },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Cartas de Crédito" subtitle="Editar" icon={faFileInvoiceDollar} />
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
          <input type="hidden" value={17} {...register("TipoCartaId", { valueAsNumber: true })} />
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Activo" />
          <Select {...register("TipoActivoId", { valueAsNumber: true })} color={`${formErrors.TipoActivoId && "failure"}`}>
            <option value={0}>Seleccione Opción</option>
            {catTiposActivo
              ?.filter((ta) => ta.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Nombre}
                </option>
              ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Proyecto" />
          <Select {...register("ProyectoId", { valueAsNumber: true })} color={`${formErrors.ProyectoId && "failure"}`}>
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
          <Label value="Proveedor" />
          <Select {...register("ProveedorId", { valueAsNumber: true })}>
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
          <Label value="Agente Aduanal" />
          <Select {...register("AgenteAduanalId", { valueAsNumber: true })}>
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
          <Label value="Tipo de Pago" />
          <Select {...register("TipoPago")}>
            <option value="0">Seleccione Opción</option>
                      <option value="Estandar">Estandar</option>
            <option value="Terceros">Terceros</option>
            <option value="Otros">Otros</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Responsable" />
          <Select {...register("Responsable")}>
            <option value={""}>Seleccione Opción</option>
            {catUsuarios
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option value={item.Id} key={index.toString()}>
                  {item.Profile?.DisplayName}
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
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6 bg-yellow-50 py-6">
        <div className="md:col-span-3">
          <Label value="% Tolerancia" />
          <TextInput type="number" {...register("PorcentajeTolerancia", { valueAsNumber: true })} />
        </div>
        <div className="md:col-span-3">
          <Label value="No. Orden de Compra" />
          <TextInput type="text" {...register("NumOrdenCompra")} />
        </div>
        <div className="md:col-span-3">
          <Label value="Costo Apertura" />
          <TextInput type="number" {...register("CostoApertura", { valueAsNumber: true })} />
        </div>
        <div className="md:col-span-3">
          <Label value="Monto Orden de Compra" />
          <TextInput type="number" {...register("MontoOrdenCompra", { valueAsNumber: true })} />
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Original LC" />
          <TextInput type="number" {...register("MontoOriginalLC", { valueAsNumber: true })} />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Efectuados" />
          <TextInput disabled />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Programados" />
          <TextInput disabled />
        </div>
      </div>

      {formErrors.FechaLimiteEmbarque && (
        <div className="px-6 mb-4">
          <Alert color="failure">
            <ul className="list-disc ml-6">
              <li>La FECHA LÍMITE DE EMBARQUE no puede ser mayor a la FECHA DE VENCIMIENTO</li>
              <li>La FECHA DE VENCIMIENTO debe ser por lo menos igual a la FECHA LÍMITE DE EMBARQUE + DÍAS DE PLAZO PARA PRESENTAR DOCUMENTOS</li>
            </ul>
          </Alert>
        </div>
      )}

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
          {/* <TextInput type="date" {...register("FechaApertura", { valueAsDate: true })} /> */}
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
          {/* <TextInput type="date" {...register("FechaLimiteEmbarque", { valueAsDate: true })} /> */}
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
          {/* <TextInput type="date" {...register("FechaVencimiento", { valueAsDate: true })} /> */}
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
        <div className="mb-4">
          <Label value="Descripción de la Mercancía" />
          <Textarea className="text-sm" {...register("DescripcionMercancia")} />
        </div>
        <div className="mb-4">
          <Label value="Descripción de la Carta de Crédito" />
          <Textarea className="text-sm" {...register("DescripcionCartaCredito")} />
        </div>
        <div className="mb-4">
          <Label value="Pago vs Carta de Aceptación" />
          <Textarea className="text-sm" {...register("PagoCartaAceptacion")} />
        </div>
        <div className="mb-4">
          <Label value="Consignación de la Mercancía" />
          <Textarea className="text-sm" {...register("ConsignacionMercancia")} />
        </div>
        <div className="mb-4">
          <Label value="Consideraciones Adicionales" />
          <Textarea className="text-sm" {...register("ConsideracionesAdicionales")} />
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 p-6">
        <div className="md:col-span-3">
          <Label value="Días para presentar documentos" />
          <TextInput type="number" {...register("DiasParaPresentarDocumentos", { valueAsNumber: true })} />
        </div>
        <div className="md:col-span-3">
          <Label value="Días de plazo proveedor" />
          <TextInput type="number" {...register("DiasPlazoProveedor", { valueAsNumber: true })} />
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
            <TextInput type="number" {...register("NumeroPeriodos", { valueAsNumber: true })} />
        </div>
        <div className="md:col-span-3">
          <Label value="Banco Corresponsal" />
          <Select {...register("BancoCorresponsalId", { valueAsNumber: true })}>
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
                  <Label value="Confirmación Banco Notificador" />
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
            <option value="Líneas de crédito">Líneas de crédito</option>
                      <option value="Provisión de fondos">Provisión de fondos</option>
                      <option value="Provisión de tesorería">Provisión de tesorería</option>
          </Select>
        </div>
      </div>

      <div className="m-6">
        <div className="md:grid md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6">
            <Label value="Documentos a Negociar: " />
            <Select onChange={(e) => setDocId(Number(e.target.value))} value={Number(docId)}>
              <option value="0">Seleccione</option>
              {catDocumentos &&
                catDocumentos
                  .filter((d) => d.Activo)
                  .map((item, index) => (
                    <option key={index.toString()} value={item.Id}>
                      {item.Nombre}
                    </option>
                  ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label value="Copias" />
                      <TextInput type="number" onChange={(e) => setDocCopias(Number(e.target.value))} value={Number(docCopias)} />
          </div>
          <div className="md:col-span-2">
            <Label value="Originales" />
                      <TextInput type="number" onChange={(e) => setDocOriginales(Number(e.target.value))} value={Number(docOriginales)} />
          </div>
          <div className="md:col-span-2 pt-4">
            <Button onClick={_docAgregar}>Agregar</Button>
          </div>
        </div>
      </div>

      <Table className="mt-6">
        <Table.Head>
          <Table.HeadCell>Documentos a negociar</Table.HeadCell>
          <Table.HeadCell>Copias</Table.HeadCell>
          <Table.HeadCell>Originales</Table.HeadCell>
          <Table.HeadCell>Eliminar</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {docsAgregados.map((item, index) => {
            return (
              <Table.Row key={index.toString()}>
                <Table.Cell width="60%">{item.Nombre}</Table.Cell>
                <Table.Cell>{item.Copias}</Table.Cell>
                <Table.Cell>{item.Originales}</Table.Cell>
                <Table.Cell>
                  <Button color="warning" size="sm" onClick={() => _docEliminar(item.DocId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <div className="m-6">
        <div className="mt-6">
          <Button onClick={_handleSubmit}>ACTUALIZAR SOLICITUD</Button>
        </div>
      </div>
    </>
  );
};
