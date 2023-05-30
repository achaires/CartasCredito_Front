import { IPago } from "./cartaPagoInterface";

export interface IPFETipoCambio {
  MonedaId: number;
  PA: number;
  PA1: number;
  PA2: number;
}

export interface IPFEPrograma {
  Pagos?: IPago[];
  TiposCambio?: IPFETipoCambio[];
  Id?: number;
  Anio: number;
  Periodo: number;
  EmpresaId: number;
}

export interface IPFEProgramaPagos {
  ProgramaId: number;
  PagoId: number;
}
