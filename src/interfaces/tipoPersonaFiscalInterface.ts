export interface ITipoPersonaFiscal {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface ITipoPersonaFiscalInsert {
  Nombre: string;
  Descripcion?: string;
}

export interface ITipoPersonaFiscalUpdate extends ITipoPersonaFiscalInsert {
  Id: number;
}
