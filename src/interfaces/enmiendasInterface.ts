export interface IEnmienda {
  Id: number;
  CartaCreditoId: string;
  DocumentoSwift: string;
  ImporteLC: number;
  FechaLimiteEmbarque: string;
  FechaVencimiento: string;
  DescripcionMercancia: string;
  ConsideracionesAdicionales: string;
  InstruccionesEspeciales: string;
  Estatus: number;
  Prev_DocumentoSwift: string;
  Prev_ImporteLC: string;
  Prev_FechaLimiteEmbarque: string;
  Prev_FechaVencimiento: string;
  Prev_DescripcionMercancia: string;
  Prev_ConsideracionesAdicionales: string;
  Prev_InstruccionesEspeciales: string;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
  Activo: boolean;
}

export interface IEnmiendaInsert {
  CartaCreditoId: string;
  ConsideracionesAdicionales: string;
  DescripcionMercancia: string;
  FechaLimiteEmbarque: string;
  FechaVencimiento: string;
  ImporteLC: number;
  InstruccionesEspeciales: string;
}

export interface IEnmiendaUpdate extends IEnmiendaInsert {
  Id: number;
  Estatus: number;
}
