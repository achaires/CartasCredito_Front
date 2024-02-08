export interface IProyecto {
  Id: number;
  EmpresaId: number;
  Nombre: string;
  Descripcion: string;
  FechaApertura: string;
  FechaCierre: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
    Eliminado: string;
    FechaAperturaStr: string;
    FechaCierreStr: string;
}

export interface IProyectoInsert {
  EmpresaId: number;
  Nombre: string;
  Descripcion?: string;
  FechaApertura: string;
    FechaCierre: string;
    FechaAperturaStr: string;
    FechaCierreStr: string;
}

export interface IProyectoUpdate extends IProyectoInsert {
  Id: number;
}
