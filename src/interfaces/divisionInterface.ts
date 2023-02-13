export interface IDivision {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface IDivisionInsert {
  Nombre: string;
  Descripcion?: string | null;
}

export interface IDivisionUpdate extends IDivisionInsert {
  Id: number;
}
