export interface ITipoActivo {
  Id: number;
  Nombre: string;
  Responsable: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface ITipoActivoInsert {
  Nombre: string;
  Responsable: string;
  Descripcion?: string;
}

export interface ITipoActivoUpdate extends ITipoActivoInsert {
  Id: number;
}
