export interface IReporte {
  Id: number;
  TipoReporte: string;
  Creado: string;
  CreadoPorId: string;
  CreadoPor: string;
  Filename: string;
}

export interface IReporteRequest {
  TipoReporte: string;
  EmpresaId: number | null;
  Desde: string;
  Hasta: string;
}
