import { useGetEmpresasQuery } from "@/apis";
import { useAddProgramaMutation, useSearchProgramaMutation, useUpdateProgramaMutation } from "@/apis/pfeApi";
import { AdminBreadcrumbs, AdminPageHeader, PFETIpoCambioModal } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faFileEdit, faFileInvoiceDollar, faFloppyDisk, faPencil, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { IPFETipoCambio, IPago } from "@/interfaces";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

const validationSchema = z.object({
  Anio: z.number(),
  Periodo: z.number(),
  EmpresaId: z.number(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type PFEProgramaMoneda = {
  MonedaId: number;
  Moneda: string;
};

export const PFE = () => {
  const nav = useNavigate();

  const [curDate, setCurDate] = useState(new Date());
  const [yearOptions, setYearOptions] = useState<Array<number>>([]);
  const [periodOptions, setPeriodOptions] = useState<Array<string>>([
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]);

  const [showTipoCambioModal, setShowTipoCambioModal] = useState(false);
  const [tipoCambioMonedaId, setTipoCambioMonedaId] = useState(0);
  const [tipoCambioMoneda, setTipoCambioMoneda] = useState("");
  const [selectedPagos, setSelectedPagos] = useState<Array<IPago>>([]);

  const [tiposCambio, setTiposCambio] = useState<IPFETipoCambio[]>([]);

  const [programaMonedas, setProgramaMonedas] = useState<Array<PFEProgramaMoneda>>([]);

  const { data: catEmpresas } = useGetEmpresasQuery();
  const [pfeBuscar, { data: programaPFErsp, isLoading, isSuccess, isError, error }] = useSearchProgramaMutation();
  const [pfeGuardar, { data: programaPFEGuardarRsp, isLoading: isSaving, isSuccess: isSaveSuccess, isError: isSaveError, error: saveError }] =
    useAddProgramaMutation();
  const [pfeActualizar, { data: programaPFEActualizarRsp, isLoading: isUpdating, isSuccess: isUpdtateSuccess, isError: isUpdateError, error: updateError }] =
    useUpdateProgramaMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ValidationSchema>();

  /** EVENT HANDLERS */
  const _handleSelectedRowChange = (e: number[]) => {
    var newSelpagos: IPago[] = [];
    if (programaPFErsp && programaPFErsp.Pagos) {
      for (var i = 0; i < programaPFErsp.Pagos.length; i++) {
        var pago = programaPFErsp.Pagos[i];
        if (e.includes(pago.Id)) {
          newSelpagos.push(pago);
        }
      }
    }

    setSelectedPagos(newSelpagos);
  };
  const _handleBack = () => {
    nav("/operaciones/pfe");
  };

  const _handleShowTipoCambioModal = (moneda: string, monedaId: number) => {
    setShowTipoCambioModal(true);
    setTipoCambioMonedaId(monedaId);
    setTipoCambioMoneda(moneda);
  };

  const _handleSubmitSearch = handleSubmit((formData) => {
    if (Number(formData.EmpresaId) < 1) {
      toast.error("Seleccione empresa", { position: "top-right" });
      return;
    }

    setSelectedPagos([]);

    pfeBuscar(formData);
  });

  const _handleSubmitSave = () => {
    if (selectedPagos.length < 1) {
      toast.error("Seleccione al menos un pago", { position: "top-right" });
      return;
    }

    if (tiposCambio.length < 1) {
      toast.error("Ingrese los tipos de cambio", { position: "top-right" });
      return;
    }

    if (programaPFErsp) {
      if (programaPFErsp.Id && programaPFErsp.Id > 0) {
        console.log("Actualizar programa", programaPFErsp.Id);
        let pfeProg = {
          Id: programaPFErsp.Id,
          Anio: programaPFErsp.Anio,
          Periodo: programaPFErsp.Periodo,
          EmpresaId: programaPFErsp.EmpresaId,
          TiposCambio: tiposCambio,
          Pagos: selectedPagos,
        };

        pfeActualizar(pfeProg);
      } else {
        console.log("Crear programa");
        let pfeProg = {
          Anio: programaPFErsp.Anio,
          Periodo: programaPFErsp.Periodo,
          EmpresaId: programaPFErsp.EmpresaId,
          TiposCambio: tiposCambio,
          Pagos: selectedPagos,
        };

        pfeGuardar(pfeProg);
      }
    }
  };

  /** EFFECT HOOKS */
  useEffect(() => {
    if (isUpdtateSuccess) {
      toast.success("Programa actualizado correctamente", { position: "top-right" });
    }
  }, []);

  useEffect(() => {
    if (isSuccess && programaPFErsp && programaPFErsp.Id && programaPFErsp.Id > 0) {
      toast.success("Se encontró un programa guardado con anterioridad", { position: "top-right" });

      // cargar programa de pagos existente
      var progSelectedPagos: Array<IPago> = [];

      if (programaPFErsp.Pagos) {
        for (var i = 0; i < programaPFErsp.Pagos.length; i++) {
          if (programaPFErsp.Pagos[i].PFEActivo) {
            progSelectedPagos.push(programaPFErsp.Pagos[i]);
          }
        }
      }

      setSelectedPagos(progSelectedPagos);

      // cargar tipos de cambio de programa
      if (programaPFErsp.TiposCambio) {
        setTiposCambio(programaPFErsp.TiposCambio);
      }
    }

    if (isSuccess && programaPFErsp && programaPFErsp.Pagos) {
      const uniqueCurrencies: { [key: string]: boolean } = {};

      for (var i = 0; i < programaPFErsp.Pagos.length; i++) {
        var pago = programaPFErsp.Pagos[i];
        if (pago.CartaCredito) {
          var monedaId = pago.CartaCredito.MonedaId;
          var moneda = pago.CartaCredito.Moneda;

          var key = `${monedaId}-${moneda}`;

          if (!uniqueCurrencies[key]) {
            uniqueCurrencies[key] = true;
          }
        }
      }

      var resultado = Object.keys(uniqueCurrencies).map(function (key) {
        var parts = key.split("-");
        return { MonedaId: parseInt(parts[0]), Moneda: parts[1] };
      });

      setProgramaMonedas(resultado);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSaveSuccess) {
      toast.success("Se guardó el programa correctamente", { position: "top-right" });
      _handleSubmitSearch();
    }
  }, [isSaveSuccess]);

  useEffect(() => {
    let newYearOptions = [];
    for (var i = curDate.getFullYear(); i >= 2018; i--) {
      newYearOptions.push(i);
    }

    setYearOptions(newYearOptions);
  }, [curDate]);

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <AdminBreadcrumbs
            links={[
              { name: "Operaciones", href: "#" },
              { name: "Programación de Pagos PFE", href: `${apiHost}/#/operaciones/pfe` },
            ]}
          />
        </div>
        <div className="mb-4">
          <AdminPageHeader title="Programación de Pagos PFE" icon={faFileInvoiceDollar} />
        </div>

        <div className="mb-4">
          <form onSubmit={_handleSubmitSearch}>
            <div className="md:grid md:grid-cols-12 gap-4">
              <div className="md:col-span-6 lg:col-span-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label value="Año" />
                    <Select {...register("Anio", { valueAsNumber: true })}>
                      <option value="0">Seleccione</option>
                      {yearOptions.map((item, index) => (
                        <option key={index.toString()} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label value="Periodo" />
                    <Select {...register("Periodo", { valueAsNumber: true })}>
                      <option value="0">Seleccione</option>
                      {periodOptions.map((item, index) => (
                        <option key={index.toString()} value={index + 1}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label value="Empresa" />
                  <Select {...register("EmpresaId", { valueAsNumber: true })}>
                    <option value="0">Seleccione Empresa</option>
                    {catEmpresas &&
                      catEmpresas
                        .filter((i) => i.Activo)
                        .map((item, index) => (
                          <option key={index.toString()} value={item.Id}>
                            {item.Nombre}
                          </option>
                        ))}
                  </Select>
                </div>
                <div className="mt-4">
                  <Button type="submit">GENERAR PROGRAMA</Button>
                </div>
              </div>

              <div className="md:col-span-6 lg:col-start-8 lg:col-span-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <Label value="Tipo de Cambio en MXN" />
                  <Label value="PA=Periodo Actual" />
                </div>
                <table className="border-b border-gray-200 shadow w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-xs text-gray-500">&nbsp;</th>
                      <th className="px-4 py-2 text-xs text-gray-500">Moneda</th>
                      <th className="px-4 py-2 text-xs text-gray-500">PA</th>
                      <th className="px-4 py-2 text-xs text-gray-500">PA+1</th>
                      <th className="px-4 py-2 text-xs text-gray-500">PA+2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programaMonedas.map((item, index) => (
                      <tr className="whitespace-nowrap" key={index.toString()}>
                        <td className="px-4 py-4">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              _handleShowTipoCambioModal(item.Moneda, item.MonedaId);
                            }}>
                            <FontAwesomeIcon icon={faFileEdit} className="h-6" />
                          </a>
                        </td>
                        <td className="px-4 py-4">{item.Moneda}</td>
                        <td className="px-4 py-4">
                          {tiposCambio.map((i) => {
                            if (i.MonedaId === item.MonedaId) {
                              return i.PA;
                            }
                          })}
                        </td>
                        <td className="px-4 py-4">
                          {tiposCambio.map((i) => {
                            if (i.MonedaId === item.MonedaId) {
                              return i.PA1;
                            }
                          })}
                        </td>
                        <td className="px-4 py-4">
                          {tiposCambio.map((i) => {
                            if (i.MonedaId === item.MonedaId) {
                              return i.PA2;
                            }
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
        {isSuccess && programaPFErsp && (
          <div className="mb-4">
            <h3>Pagos Programados</h3>

            <div>
              <DataGrid
                showBorders={true}
                showColumnLines={true}
                showRowLines={true}
                keyExpr="Id"
                dataSource={programaPFErsp.Pagos}
                selectedRowKeys={selectedPagos.map((i) => i.Id)}
                onSelectedRowKeysChange={_handleSelectedRowChange}>
                <Paging defaultPageSize={10} />
                <HeaderFilter visible={true} />
                <Selection mode="multiple" showCheckBoxesMode="always" />
                <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
                <Column dataField="CartaCredito.NumCartaCredito" caption="Num. Carta" />
                <Column dataField="CartaCredito.TipoCarta" />
                <Column dataField="NumeroPago" />
                <Column dataField="FechaVencimiento" dataType="datetime" format="dd/MM/yyyy" defaultSortOrder="desc" sortIndex={0} />
                <Column dataField="MontoPago" dataType="number" format="currency" />
                <Column dataField="CartaCredito.Moneda" />
              </DataGrid>

              <div className="mt-4 flex items-center gap-6 justify-end">
                <a
                  href="#"
                  title="Guardar Pronóstico"
                  onClick={(e) => {
                    e.preventDefault();
                    _handleSubmitSave();
                  }}>
                  <FontAwesomeIcon size="2x" icon={faFloppyDisk} />
                </a>

                {/* <a
                  href="#"
                  title="Eliminar Pronóstico"
                  onClick={(e) => {
                    e.preventDefault();
                  }}>
                  <FontAwesomeIcon size="2x" icon={faTrash} />
                </a> */}
              </div>
            </div>
          </div>
        )}
      </div>

      <PFETIpoCambioModal
        monedaId={tipoCambioMonedaId}
        moneda={tipoCambioMoneda}
        show={showTipoCambioModal}
        handleClose={() => {
          setShowTipoCambioModal(false);
        }}
        handleSubmit={(tipoCambio) => {
          let newTiposCambio: IPFETipoCambio[] = [];

          if (tiposCambio.find((tc) => tc.MonedaId === tipoCambio.MonedaId)) {
            let index = tiposCambio.findIndex((tc) => tc.MonedaId === tipoCambio.MonedaId);
            newTiposCambio = [...tiposCambio];
            newTiposCambio[index] = tipoCambio;
          } else {
            newTiposCambio = [...tiposCambio, tipoCambio];
          }

          setTiposCambio(newTiposCambio);
          setShowTipoCambioModal(false);
        }}
      />
    </>
  );
};
