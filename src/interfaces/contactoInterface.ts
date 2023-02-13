export interface IContacto {
  Id: number;
  ModelId: number;
  ModelNombre: string;
  Nombre: string | null;
  ApellidoPaterno: string | null;
  ApellidoMaterno: string | null;
  Telefono: string | null;
  Celular?: string | null;
  Email?: string | null;
  Fax?: string | null;
  Descripcion?: string;
  Activo: boolean;
}

export interface IContactoInsert {
  ModelId: number;
  ModelNombre: string;
  Nombre: string | null;
  ApellidoPaterno: string | null;
  ApellidoMaterno: string | null;
  Telefono: string | null;
  Celular?: string | null;
  Email?: string | null;
  Fax?: string | null;
  Descripcion?: string;
}

export interface IContactoUpdate {
  Id: number;
  Nombre: string | null;
  ApellidoPaterno: string | null;
  ApellidoMaterno: string | null;
  Telefono: string | null;
  Celular?: string | null;
  Email?: string | null;
  Fax?: string | null;
  Descripcion?: string;
}

export interface IContactoByModelQuery {
  ModelNombre: string;
  ModelId: string;
}
