import { useGetAgentesAduanalesQuery } from "@/apis/agentesAduanalesApi";
import { useGetBancosQuery } from "@/apis/bancosApi";
import { useGetCompradoresQuery } from "@/apis/compradoresApi";
import { useGetDocumentosQuery } from "@/apis/documentosApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useGetMonedasQuery } from "@/apis/monedasApi";
import { useGetProveedoresQuery } from "@/apis/proveedoresApi";
import { useGetProyectosQuery } from "@/apis/proyectosApi";
import { useGetTiposActivoQuery } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faCircleArrowLeft, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Select, Table, Textarea, TextInput } from "flowbite-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function NuevaCartaComercial() {
  const nav = useNavigate();

  const { data: catTiposActivo } = useGetTiposActivoQuery();
  const { data: catProyectos } = useGetProyectosQuery();
  const { data: catBancos } = useGetBancosQuery();
  const { data: catProveedores } = useGetProveedoresQuery();
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catAgentesAduanales } = useGetAgentesAduanalesQuery();
  const { data: catMonedas } = useGetMonedasQuery();
  const { data: catCompradores } = useGetCompradoresQuery();
  const { data: catDocumentos } = useGetDocumentosQuery();

  const _handleBack = useCallback(() => {
    nav(-1);
  }, []);

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

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6">
        <div className="md:col-span-3">
          <Label value="Tipo de Carta de Crédito" />
          <TextInput defaultValue="Comercial" type="text" disabled />
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Activo" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catTiposActivo?.map((item, index) => (
              <option key={index.toString()}>{item.Nombre}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Proyecto" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catProyectos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Banco" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catBancos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Proveedor" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catProveedores
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Empresa" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catEmpresas
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Agente Aduanal" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catAgentesAduanales
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Moneda" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catMonedas
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Tipo de Pago" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            <option value="Estándar">Estándar</option>
            <option value="A Terceros">A Terceros</option>
            <option value="Otros">Otros</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Responsable" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            <option value="Estándar">Estándar</option>
            <option value="A Terceros">A Terceros</option>
            <option value="Otros">Otros</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Label value="Comprador" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catCompradores
              ?.filter((b) => b.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6 bg-yellow-50 py-6">
        <div className="md:col-span-3">
          <Label value="% Tolerancia" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="No. Orden de Compra" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="No. Orden de Compra" />
          <TextInput />
        </div>
        <div className="md:col-span-3">
          <Label value="Costo Apertura" />
          <TextInput />
        </div>
        <div className="md:col-span-3">
          <Label value="Monto Orden de Compra" />
          <TextInput />
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Original LC" />
          <TextInput />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Efectuados" />
          <TextInput />
        </div>

        <div className="md:col-span-3">
          <Label value="Pagos Programados" />
          <TextInput />
        </div>

        <div className="md:col-span-3">
          <Label value="Monto Dispuesto" />
          <TextInput />
        </div>

        <div className="md:col-span-3">
          <Label value="Saldo Insoluto" />
          <TextInput />
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 px-6">
        <div className="md:col-span-3">
          <Label value="Fecha Apertura" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha Límite de Embarque" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="Fecha de Vencimiento" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="Incoterm" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="Embarques Parciales" />
          <Select>
            <option value="0">Seleccione</option>
            <option value="Permitidos">Permitidos</option>
            <option value="No Permitidos">No permitidos</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Transbordos" />
          <Select>
            <option value="0">Seleccione</option>
            <option value="Permitidos">Permitidos</option>
            <option value="No Permitidos">No permitidos</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Punto de Embarque" />
          <TextInput type="text" />
        </div>
        <div className="md:col-span-3">
          <Label value="Punto de Desembarque" />
          <TextInput type="text" />
        </div>
      </div>

      <div className="bg-yellow-50 py-6 px-6">
        <div className="mb-6">
          <Label value="Descripción de la Mercancía" />
          <Textarea />
        </div>
        <div className="mb-6">
          <Label value="Descripción de la Carta de Crédito" />
          <Textarea />
        </div>
        <div className="mb-6">
          <Label value="Pago vs Carta de Aceptación" />
          <Textarea />
        </div>
        <div className="mb-6">
          <Label value="Consignación de la Mercancía" />
          <Textarea />
        </div>
        <div className="mb-6">
          <Label value="Consideraciones Adicionales" />
          <Textarea />
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6 mb-6 p-6">
        <div className="md:col-span-3">
          <Label value="Días para presentar documentos" />
          <TextInput type="number" />
        </div>
        <div className="md:col-span-3">
          <Label value="Días de plazo proveedor" />
          <TextInput type="number" />
        </div>
        <div className="md:col-span-3">
          <Label value="Condiciones de Pago" />
          <Select>
            <option>Seleccione opción</option>
            <option value="Pago a la vista">Pago a la vista</option>
            <option value="Pago diferido">Pago diferido</option>
            <option value="Pago refinanciado">Pago refinanciado</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Número de Periodos" />
          <TextInput type="number" />
        </div>
        <div className="md:col-span-3">
          <Label value="Banco Corresponsal" />
          <Select>
            <option value={0}>Seleccione Opción</option>
            {catBancos
              ?.filter((c) => c.Activo)
              .map((item, index) => (
                <option key={index.toString()}>{item.Nombre}</option>
              ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Seguro por cuenta" />
          <Select>
            <option>Seleccione opción</option>
            <option>Ordenante</option>
            <option>Beneficiario</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Gastos y comisiones corresponsal" />
          <Select>
            <option>Seleccione opción</option>
            <option>Ordenante</option>
            <option>Beneficiario</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Confirmar banco notificador" />
          <Select>
            <option>Seleccione opción</option>
            <option>Requerido</option>
            <option>No requerido</option>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Label value="Tipo de Emisión" />
          <Select>
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
      </div>
    </>
  );
}
export default NuevaCartaComercial;
