import { IEmpresa } from "./empresaInterface";
import { IRole } from "./rolesInterface";

export interface IUserProfile {
  Id: number;
  Name: string | null;
  LastName: string | null;
  DisplayName: string | null;
  UserId: string;
  Notes: string | null;
}

export interface IUser {
  AccessFailedCount: number;
  Activo: boolean;
  Email: string;
  Id: string;
  LockoutEnabled: boolean;
  LockoutEndDateUtc: string;
  NewPasswordPlain: string;
  PasswordHash: string;
  PhoneNumber: string;
  PhoneNumberConfirmed: boolean;
  Profile: IUserProfile | null;
  Roles: IRole[] | null;
  TwoFactorEnabled: boolean;
  UserName: string;
  Empresas: IEmpresa[] | null;
  RoleId: string | null;
}

export interface IUserInsert {
  UserName: string;
  Name: string;
  LastName: string;
  Email: string;
  PhoneNumber?: string | null;
  Notes?: string | null;
  Empresas?: Array<number> | null;
  RolId: string;
}

export interface IUserUpdate {
  Id: string;
  UserName?: string;
  Name?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string | null;
  Notes?: string | null;
  Empresas?: Array<number> | null;
  Activo?: boolean;
  RolId: string;
}
