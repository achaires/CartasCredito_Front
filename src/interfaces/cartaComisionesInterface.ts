import { IPago } from "./cartaPagoInterface";

export interface ICartaCreditoComision {
  NumeroComision: number;
  Id: number;
  CartaCreditoId: string;
  ComisionId: number;
  FechaCargo: string;
  MonedaId: number;
  PagoMonedaId: number;
  PagoMoneda: string;
  Monto: number;
  Activo: boolean;
  CreadoPor: string;
  Estatus: number;
  Moneda: string;
  Comision: string;
  PagoId: number;
  TipoCambio: number;
  FechaPago: string;
  MontoPagado: number;
  Comentarios?: string;
  EstatusText?: string | null;
  EstatusClass?: string | null;
}

export interface ICartaCreditoComisionInsert {
  CartaCreditoId: string;
  ComisionId: number;
  FechaCargo: string;
  Monto: number;
  NumReferencia: number | null;
}

export interface ICartaCreditoComisionUpdate {
  Id: number;
}
