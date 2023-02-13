export interface IMoneda {
  Id: number;
  Nombre: string;
  Abbr: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface IMonedaInsert {
  Nombre: string;
  Abbr?: string;
  Descripcion?: string;
}

export interface IMonedaUpdate extends IMonedaInsert {
  Id: number;
}
