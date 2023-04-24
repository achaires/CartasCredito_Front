export interface IBitacoraMovimiento {
  Id: number;
  Titulo: string;
  Descripcion: string;
  CartaCreditoId: string;
  ModeloNombre: string;
  ModeloId: number;
  CreadoPor: string;
  CreadoPorId: string;
  Creado: Date | null;
}

export interface IBitacoraMovimientoFiltro {
  DateStart: number;
  DateEnd: number;
}
