export interface IComprador {
  Id: number;
  EmpresaId: number;
  TipoPersonaFiscalId: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface ICompradorInsert {
  EmpresaId: number;
  TipoPersonaFiscalId: number;
  Nombre: string;
  Descripcion?: string;
}

export interface ICompradorUpdate extends ICompradorInsert {
  Id: number;
}
