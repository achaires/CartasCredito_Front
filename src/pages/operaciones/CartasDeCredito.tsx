import { useGetCartasComercialesQuery, useLazyGetCartasComercialesQuery } from "@/apis/cartasCreditoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Table, Tooltip } from "flowbite-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CartasDeCredito = () => {
  const nav = useNavigate();

  const _handleNuevaCartaComercial = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-comercial");
  }, []);

  const _handleNuevaCartaStandBy = useCallback(() => {
    nav("/operaciones/cartas-de-credito/nueva-carta-standby");
  }, []);

  const [getCartasCredito, cartasCredito] = useLazyGetCartasComercialesQuery();

  useEffect(() => {
    let curDate = new Date();

    getCartasCredito({ FechaInicio: curDate.toISOString().split("T")[0], FechaFin: curDate.toISOString().split("T")[0] });
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
          <Dropdown.Item onClick={_handleNuevaCartaStandBy}>Nueva Carta Stand By</Dropdown.Item>
        </Dropdown>
      </div>

      <div className="mb-6">
        <Table>
          <Table.Head>
            <Table.HeadCell>No. Carta Crédito</Table.HeadCell>
            <Table.HeadCell>Tipo</Table.HeadCell>
            <Table.HeadCell>Activo</Table.HeadCell>
            <Table.HeadCell>Proveedor</Table.HeadCell>
            <Table.HeadCell>Empresa</Table.HeadCell>
            <Table.HeadCell>Banco</Table.HeadCell>
            <Table.HeadCell>Moneda</Table.HeadCell>
            <Table.HeadCell>Monto</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cartasCredito.data &&
              cartasCredito.data.map((item, index) => {
                return (
                  <Table.Row key={index.toString()}>
                    <Table.Cell className="">{item.NumCartaCredito}</Table.Cell>
                    <Table.Cell className="">{item.TipoCarta}</Table.Cell>
                    <Table.Cell className="">{item.TipoActivo}</Table.Cell>
                    <Table.Cell className="">{item.Proveedor}</Table.Cell>
                    <Table.Cell className="">{item.Empresa}</Table.Cell>
                    <Table.Cell className="">{item.Banco}</Table.Cell>
                    <Table.Cell className="">{item.Moneda}</Table.Cell>
                    <Table.Cell className="">{item.MontoOriginalLC}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
