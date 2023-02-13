export interface IDocumento {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface IDocumentoInsert {
  Nombre: string;
  Descripcion?: string;
}

export interface IDocumentoUpdate extends IDocumentoInsert {
  Id: number;
}
