import { ICartaComercial } from "./cartaComercialInterface";

export interface IPago {
  Id: number;
  FechaVencimiento: string;
  FechaPago?: string | null;
  MontoPago: number | null;
  MontoPagado?: number | null;
  RegistroPagoPor?: string | null;
  CreadoPor?: string | null;
  CartaCreditoId: string | null;
  NumeroPago?: number | null;
  NumeroFactura?: string | null;
  Estatus: number | null;
  Activo: boolean | null;
  Creado: string | null;
  Actualizado?: string | null;
  Eliminado?: string | null;
  EstatusText?: string | null;
  EstatusClass?: string | null;
  Empresa?: string | null;
  Proveedor?: string | null;
  CartaCredito?: ICartaComercial;
  TipoCambio?: number;
  MonedaId?: number;
  ComisionId?: number;
  PFEActivo?: boolean;
}

export interface IPagoComisionInsert {
  CartaCreditoId: string;
  FechaPago: string;
  MontoPago: number;
  ComisionId: number;
  MonedaId: number;
  TipoCambio: number;
}

export interface IPagoInsert {
  CartaCreditoId: string;
  NumeroFactura: string;
  FechaVencimiento: string;
  MontoPago: number;
}

export interface IPagoUpdate {
  Id: number;
  Estatus: number;
  FechaPago: string;
}
