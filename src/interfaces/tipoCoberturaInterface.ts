export interface ITipoCobertura {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface ITipoCoberturaInsert {
  Nombre: string;
  Descripcion?: string;
}

export interface ITipoCoberturaUpdate extends ITipoCoberturaInsert {
  Id: number;
}
