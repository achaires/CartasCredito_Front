import { IContacto } from "./contactoInterface";

export interface IBanco {
  Id: number;
  Nombre: string;
  Descripcion: string;
  TotalLinea: number;
  Activo: boolean;
  CreadoPor?: string;
  Creado?: string;
  Actualizado?: string;
  Eliminado?: string;
  Contactos?: IContacto[];
}

export interface IBancoInsert {
  Nombre: string;
  Descripcion?: string | null;
}

export interface IBancoUpdate extends IBancoInsert {
  Id: number;
}
