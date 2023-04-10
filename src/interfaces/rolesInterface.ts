import { IPermission } from "./permissionsInterface";

export interface IRole {
  Id: string;
  Name: string;
  Activo: boolean;
  Permissions: Array<IPermission> | null;
}

export interface IRoleInsert {
  Name: string;
  Permissions?: Array<number>;
}

export interface IRoleUpdate {
  Id: string;
  Name: string;
  Permissions?: Array<number>;
}
