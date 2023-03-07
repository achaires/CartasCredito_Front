import { ICartaCreditoComision } from "./cartaComisionesInterface";
import { IPago } from "./cartaPagoInterface";

export interface ICartaComercial {
  Consecutive?: number;
  Id?: string;
  NumCartaCredito?: string;
  TipoCarta?: string;
  TipoCartaId?: number;
  TipoStandBy?: string;
  TipoActivo?: string;
  Banco?: string;
  Empresa?: string;
  Proveedor?: string;
  Moneda?: string;
  TipoActivoId?: number;
  ProyectoId?: number;
  Proyecto?: string;
  BancoId?: number;
  ProveedorId?: number;
  EmpresaId?: number;
  AgenteAduanalId?: number;
  AgenteAduanal?: string;
  MonedaId?: number;
  TipoPago?: string;
  Responsable?: string;
  CompradorId?: number;
  Comprador?: string;
  PorcentajeTolerancia?: number;
  NumOrdenCompra?: string;
  CostoApertura?: number;
  MontoOrdenCompra?: number;
  MontoOriginalLC?: number;
  PagosEfectuados?: number;
  PagosProgramados?: number;
  MontoDispuesto?: number;
  SaldoInsoluto?: number;
  FechaApertura?: string;
  Incoterm?: string;
  FechaLimiteEmbarque?: string;
  FechaVencimiento?: string;
  EmbarquesParciales?: string;
  Transbordos?: string;
  PuntoEmbarque?: string;
  PuntoDesembarque?: string;
  DescripcionMercancia?: string;
  DescripcionCartaCredito?: string;
  InstruccionesEspeciales?: string;
  PagoCartaAceptacion?: string;
  ConsignacionMercancia?: string;
  ConsideracionesAdicionales?: string;
  ConsideracionesReclamacion?: string;
  DiasParaPresentarDocumentos?: number;
  DiasPlazoProveedor?: number;
  CondicionesPago?: string;
  NumeroPeriodos?: number;
  BancoCorresponsalId?: number;
  BancoCorresponsal?: string;
  SeguroPorCuenta?: string;
  GastosComisionesCorresponsal?: string;
  ConfirmacionBancoNotificador?: string;
  TipoEmision?: string;
  DocumentoSwift?: string;
  Creado?: string;
  CreadoPor?: string;
  Estatus?: number;
  Activo?: boolean;
  Pagos?: IPago[] | null;
  Comisiones?: ICartaCreditoComision[] | null;
}

export interface ICartaCreditoFiltrar {
  NumCarta?: string | null;
  TipoCarta?: string | null;
  TipoCartaId?: string | null;
  TipoActivoId?: string | null;
  MonedaId?: string | null;
  ProveedorId?: string | null;
  EmpresaId?: string | null;
  BancoId?: string | null;
  Estatus?: string | null;
  FechaInicio?: string | null;
  FechaFin?: string | null;
}

export interface ISwiftNumCartaRequest {
  CartaCreditoId: string;
  NumCarta: string;
  SwiftFile: FileList;
}
