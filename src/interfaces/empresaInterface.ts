export interface IEmpresa {
  Id: number;
  DivisionId: number;
  Division: string;
  Nombre: string;
  RFC: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
}

export interface IEmpresaInsert {
  Nombre: string;
  DivisionId: number | null;
  RFC: string | null;
  Descripcion?: string | null;
}

export interface IEmpresaUpdate extends IEmpresaInsert {
  Id: number;
}
