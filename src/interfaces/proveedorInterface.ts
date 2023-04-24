import { IContacto } from "./contactoInterface";

export interface IProveedor {
  Id: number;
  PaisId: number;
  EmpresaId: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado?: string;
  Eliminado?: string;
  Contacto?: IContacto;
  Pais?: string | null;
}

export interface IProveedorInsert {
  PaisId: number;
  EmpresaId: number;
  Nombre: string;
  Descripcion?: string;
  Contacto?: IContacto;
  Pais?: string;
}

export interface IProveedorUpdate extends IProveedorInsert {
  Id: number;
}
