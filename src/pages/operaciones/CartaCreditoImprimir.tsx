import { useLazyGetCartaComercialQuery } from "@/apis";
import gisLogo from "../../assets/img/gis-logo-gris.png";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminLoadingActivity } from "@/components";

const curDate = new Date();

export const CartaCreditoImprimir = () => {
  const routeParams = useParams();
  const [getCartaComercial, { data: cartaCreditoDetalle, isLoading }] = useLazyGetCartaComercialQuery();

  useEffect(() => {
    if (routeParams.cartaCreditoId) {
      getCartaComercial(routeParams.cartaCreditoId);
    }
  }, [routeParams]);

  if (isLoading || !cartaCreditoDetalle) {
    return (
      <div>
        <AdminLoadingActivity />
      </div>
    );
  }

  if (!isLoading && cartaCreditoDetalle && cartaCreditoDetalle.TipoCarta === "StandBy") {
    return (
      <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
        <div className="flex items-center mb-4">
          <div>
            <img src={gisLogo} className="w-40" />
          </div>
          <div className="text-center flex-1">
            <div className="font-bold text-2xl">Reportes de Cartas de Crédito</div>
          </div>
        </div>
        <div className="flex">
          <div className="font-bold flex-1">Carta de Crédito Stand By - No. {cartaCreditoDetalle.NumCartaCredito}</div>
          <div className="flex-1 text-right">
            Fecha / Hora de Impresión{" "}
            {`${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`}
          </div>
        </div>
        <div className="mt-4">
          <table className="border border-black w-full" cellPadding={4}>
            <tbody>
              <tr className="border-b border-black">
                <td className="font-bold text-lg" colSpan={3}>
                  Datos generales
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/2 border-r border-black">
                  <strong>Banco:</strong> {cartaCreditoDetalle.Banco}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/2 border-r border-black" colSpan={2}>
                  <strong>Comprador:</strong> {cartaCreditoDetalle.Comprador}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black">
                  <strong>Monto original L/C:</strong> {cartaCreditoDetalle.MontoOriginalLC}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/2 border-r border-black">
                  <strong>Pagos efectuados:</strong> {cartaCreditoDetalle.PagosEfectuados}
                  <br />
                  <strong>Saldo insoluto:</strong> {cartaCreditoDetalle.SaldoInsoluto}
                </td>
                <td className="w-1/2 border-r border-black" colSpan={2}>
                  <strong>Pagos programados:</strong> {cartaCreditoDetalle.PagosProgramados}
                  <br />
                  <strong>Monto dispuesto:</strong> {cartaCreditoDetalle.MontoDispuesto}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="font-bold text-lg" colSpan={3}>
                  Fechas
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/2 border-r border-black">
                  <strong>Fecha de apertura:</strong> {cartaCreditoDetalle.FechaApertura}
                </td>
                <td className="w-1/2 border-r border-black" colSpan={2}>
                  <strong>Fecha de vencimiento:</strong> {cartaCreditoDetalle.FechaVencimiento?.toString()}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/2 border-r border-black" colSpan={2}>
                  <strong>Fecha límite de embarque:</strong> {cartaCreditoDetalle.FechaLimiteEmbarque?.toString()}
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black" colSpan={3}>
                  <strong className="block">Consideraciones generales de reclamación:</strong> {cartaCreditoDetalle.ConsideracionesReclamacion}
                </td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black" colSpan={3}>
                  <strong className="block">Consideraciones adicionales:</strong> {cartaCreditoDetalle.ConsideracionesAdicionales}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <div className="flex items-center mb-4">
        <div>
          <img src={gisLogo} className="w-40" />
        </div>
        <div className="text-center flex-1">
          <div className="font-bold text-2xl">Reportes de Cartas de Crédito</div>
        </div>
      </div>
      <div className="flex">
        <div className="font-bold flex-1">Carta de crédito comercial - No. {cartaCreditoDetalle.NumCartaCredito}</div>
        <div className="flex-1 text-right">
          Fecha / Hora de Impresión{" "}
          {`${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`}
        </div>
      </div>
      <div className="mt-4">
        <table className="border border-black w-full" cellPadding={4}>
          <tbody>
            <tr className="border-b border-black">
              <td className="font-bold text-lg" colSpan={3}>
                Datos generales
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Banco:</strong> {cartaCreditoDetalle.Banco}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Proveedor:</strong> {cartaCreditoDetalle.Proveedor}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Tipo de activo:</strong> {cartaCreditoDetalle.TipoActivo}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Proyecto:</strong> {cartaCreditoDetalle.Proyecto}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Agente aduanal:</strong> {cartaCreditoDetalle.AgenteAduanal}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Comprador:</strong> {cartaCreditoDetalle.Comprador}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="font-bold text-lg" colSpan={3}>
                Montos
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Número de orden de compra:</strong> {cartaCreditoDetalle.NumOrdenCompra}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Costo apertura:</strong> {cartaCreditoDetalle.CostoApertura}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Monto orden compra:</strong> {cartaCreditoDetalle.MontoOrdenCompra}
              </td>
              <td className="border-r border-black">
                <strong>Monto original L/C:</strong> {cartaCreditoDetalle.MontoOriginalLC}
              </td>
              <td className="border-r border-black">
                <strong>Tolerancia:</strong> {cartaCreditoDetalle.PorcentajeTolerancia}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Pagos efectuados:</strong> {cartaCreditoDetalle.PagosEfectuados}
                <br />
                <strong>Saldo insoluto:</strong> {cartaCreditoDetalle.SaldoInsoluto}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Pagos programados:</strong> {cartaCreditoDetalle.PagosProgramados}
                <br />
                <strong>Monto dispuesto:</strong> {cartaCreditoDetalle.MontoDispuesto}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="font-bold text-lg" colSpan={3}>
                Fechas
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Fecha de apertura:</strong> {cartaCreditoDetalle.FechaApertura}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Fecha de vencimiento:</strong> {cartaCreditoDetalle.FechaVencimiento?.toString()}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Incoterm:</strong> {cartaCreditoDetalle.Incoterm}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Fecha límite de embarque:</strong> {cartaCreditoDetalle.FechaLimiteEmbarque?.toString()}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="w-1/2 border-r border-black">
                <strong>Embarques parciales:</strong> {cartaCreditoDetalle.EmbarquesParciales}
              </td>
              <td className="w-1/2 border-r border-black" colSpan={2}>
                <strong>Transbordos:</strong> {cartaCreditoDetalle.Transbordos}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="font-bold text-lg" colSpan={3}>
                Especificaciones Generales
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Punto de embarque:</strong> {cartaCreditoDetalle.PuntoEmbarque}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Punto de embarque:</strong> {cartaCreditoDetalle.PuntoDesembarque}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Descripción de mercancía:</strong> {cartaCreditoDetalle.DescripcionMercancia}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Descripción de la carta de crédito:</strong> {cartaCreditoDetalle.DescripcionCartaCredito}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Consideraciones adicionales:</strong> {cartaCreditoDetalle.ConsideracionesAdicionales}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Pago vs carta aceptación:</strong> {cartaCreditoDetalle.PagoCartaAceptacion}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Consignación de mercancía:</strong> {cartaCreditoDetalle.ConsignacionMercancia}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <strong className="block">Instrucciones especiales:</strong> {cartaCreditoDetalle.InstruccionesEspeciales}
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <div className="flex">
                  <div className="flex-1">
                    <strong className="block">Días para presentar documentos</strong> {cartaCreditoDetalle.DiasParaPresentarDocumentos}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Días de plazo proveedor</strong> {cartaCreditoDetalle.DiasPlazoProveedor}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Número de periodos</strong> {cartaCreditoDetalle.NumeroPeriodos}
                  </div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <div className="flex">
                  <div className="flex-1">
                    <strong className="block">Condiciones de Pago:</strong> {cartaCreditoDetalle.CondicionesPago}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Banco corresponsal:</strong> {cartaCreditoDetalle.BancoCorresponsal}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Confirmar banco notificador:</strong> {cartaCreditoDetalle.CondicionesPago}
                  </div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="border-r border-black" colSpan={3}>
                <div className="flex">
                  <div className="flex-1">
                    <strong className="block">Seguro por cuenta:</strong> {cartaCreditoDetalle.CondicionesPago}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Gastos y comisiones de corresponsal:</strong> {cartaCreditoDetalle.BancoCorresponsal}
                  </div>
                  <div className="flex-1">
                    <strong className="block">Tipo de emisión:</strong> {cartaCreditoDetalle.TipoEmision}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
