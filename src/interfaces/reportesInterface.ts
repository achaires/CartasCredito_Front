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
    FechaInicio: string | null;
    FechaFin: string | null;
    FechaVencimientoInicio: string | null;
    FechaVencimientoFin: string | null;
  FechaDivisas: string;
}
