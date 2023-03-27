export interface IEnmienda {
  Id: number;
  CartaCreditoId: string;
  DocumentoSwift: string;
  ImporteLC: number;
  FechaLimiteEmbarque: Date;
  FechaVencimiento: Date;
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
  ConsideracionesAdicionales?: string | null | undefined;
  DescripcionMercancia?: string | null | undefined;
  FechaLimiteEmbarque?: Date | null | undefined;
  FechaVencimiento?: Date | null | undefined;
  ImporteLC?: number | null | undefined;
  InstruccionesEspeciales?: string | null | undefined;
}

export interface IEnmiendaUpdate extends IEnmiendaInsert {
  Id: number;
  Estatus: number;
}
