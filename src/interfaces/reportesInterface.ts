export interface IReporte {
  Id: number;
  TipoReporte: string;
  Creado: string;
  CreadoPorId: string;
  CreadoPor: string;
  Filename: string;
}

export interface IReporteRequest {
  TipoReporteId: number;
  EmpresaId: number | null;
  FechaInicio: string;
  FechaFin: string;
  FechaDivisas: string;
}
