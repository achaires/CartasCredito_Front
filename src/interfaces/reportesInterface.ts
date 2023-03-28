export interface IReporteAnalisisCartaRequest {
  TipoReporteId: number;
  EmpresaId?: number | null;
  FechaInicio: string;
  FechaFin: string;
}

export interface IReporteRequest {
  TipoReporteId: number;
  EmpresaId?: number | null;
  FechaInicio: string;
  FechaFin: string;
}
