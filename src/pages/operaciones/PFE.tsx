import { useGetEmpresasQuery } from "@/apis";
import { useSearchProgramaMutation } from "@/apis/pfeApi";
import { AdminBreadcrumbs, AdminPageHeader, PFETIpoCambioModal } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faFileEdit, faFileInvoiceDollar, faPencil, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Select, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

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
  const [pa1, setPa1] = useState(0);
  const [pa2, setPa2] = useState(0);
  const [pa, setPa] = useState(0);

  const [programaMonedas, setProgramaMonedas] = useState<Array<PFEProgramaMoneda>>([]);

  const { data: catEmpresas } = useGetEmpresasQuery();
  const [pfeBuscar, { data: programaPFErsp, isLoading, isSuccess, isError, error }] = useSearchProgramaMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ValidationSchema>();

  /** EVENT HANDLERS */
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

    console.log(formData);

    pfeBuscar(formData);
  });

  /** EFFECT HOOKS */
  useEffect(() => {
    if (isSuccess && programaPFErsp && programaPFErsp.Pagos) {
      const uniqueCurrencies: { [key: string]: boolean } = {};

      for (var i = 0; i < programaPFErsp.Pagos.length; i++) {
        var pago = programaPFErsp.Pagos[i];
        if (pago.CartaCredito) {
          console.log(pago.CartaCredito.MonedaId, pago.CartaCredito.Moneda);
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
                        <td className="px-4 py-4">24.75</td>
                        <td className="px-4 py-4">35.95</td>
                        <td className="px-4 py-4">99.99</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <Table className="text-xs" cellPadding={0} cellSpacing={0}>
                  <Table.Head>
                    <Table.HeadCell>&nbsp;</Table.HeadCell>
                    <Table.HeadCell>Moneda</Table.HeadCell>
                    <Table.HeadCell>PA</Table.HeadCell>
                    <Table.HeadCell>PA+1</Table.HeadCell>
                    <Table.HeadCell>PA+2</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {programaMonedas.map((item, index) => (
                      <Table.Row key={index.toString()}>
                        <Table.Cell>
                          <a href="#">
                            <FontAwesomeIcon icon={faFileEdit} className="h-6" />
                          </a>
                        </Table.Cell>
                        <Table.Cell>{item.Moneda}</Table.Cell>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>0</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table> */}
              </div>
            </div>
          </form>
        </div>
      </div>

      <PFETIpoCambioModal
        monedaId={tipoCambioMonedaId}
        moneda={tipoCambioMoneda}
        show={showTipoCambioModal}
        handleClose={() => {
          setShowTipoCambioModal(false);
        }}
        pa={pa}
        pa1={pa1}
        pa2={pa2}
        setPa={setPa}
        setPa2={setPa2}
        setPa1={setPa1}
      />
    </>
  );
};
