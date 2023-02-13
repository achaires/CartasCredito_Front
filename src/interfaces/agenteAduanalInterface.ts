import { IContacto } from "./contactoInterface";

export interface IAgenteAduanal {
  Id: number;
  EmpresaId: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado: string;
  Eliminado: string;
  Contacto?: IContacto;
}

export interface IAgenteAduanalInsert {
  EmpresaId: number;
  Nombre: string;
  Descripcion?: string | null;
}

export interface IAgenteAduanalUpdate extends IAgenteAduanalInsert {
  Id: number;
}
