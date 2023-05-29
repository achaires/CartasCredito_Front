import { useGetEmpresasQuery } from "@/apis";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { apiHost } from "@/utils/apiConfig";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
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

  const { data: catEmpresas } = useGetEmpresasQuery();

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

  const _handleSubmitSearch = handleSubmit((formData) => {
    if (Number(formData.EmpresaId) < 1) {
      toast.error('Seleccione empresa', { position: "top-right" });
      return;
    }
    console.log(formData)
  });

  /** EFFECT HOOKS */
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
                <Table>
                  <Table.Head>
                    <Table.HeadCell>&nbsp;</Table.HeadCell>
                    <Table.HeadCell>Moneda</Table.HeadCell>
                    <Table.HeadCell>PA</Table.HeadCell>
                    <Table.HeadCell>PA+1</Table.HeadCell>
                    <Table.HeadCell>PA+2</Table.HeadCell>
                  </Table.Head>
                  <Table.Body></Table.Body>
                </Table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
