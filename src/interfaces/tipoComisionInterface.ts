export interface ITipoComision {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface ITipoComisionInsert {
  Nombre: string;
  Descripcion?: string;
}

export interface ITipoComisionUpdate extends ITipoComisionInsert {
  Id: number;
}
