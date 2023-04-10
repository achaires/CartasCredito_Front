export interface IPFE_Programa {
  Id: number;
  Anio: number;
  Periodo: number;
  EmpresaId: number;
  PFE_Pagos: IPFE_Pago[] | null;
}

export interface IPFE_Pago {
  Id: number;
  PagoId: number;
  PFE_ProgramaId: number;
}

export interface IPFE_ProgramaSearch {
  Anio: number;
  Periodo: number;
  EmpresaId: number;
}
