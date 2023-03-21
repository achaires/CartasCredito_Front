export interface IReporteAnalisisCartaRequest {
  TipoReporteId: number;
  EmpresaId?: number | null;
  FechaInicio: string;
  FechaFin: string;
}
