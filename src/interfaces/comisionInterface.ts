export interface IComision {
  Id: number;
  BancoId: number;
  Nombre: string;
  Descripcion: string;
  Costo: number;
  SwiftApertura: string;
  SwiftOtro: string;
  PorcentajeIVA: number;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface IComisionInsert {
  BancoId: number;
  Nombre: string;
  Descripcion?: string | null;
  Costo: number;
  SwiftApertura: string;
  SwiftOtro: string;
  PorcentajeIVA: number;
}

export interface IComisionUpdate extends IComisionInsert {
  Id: number;
}
