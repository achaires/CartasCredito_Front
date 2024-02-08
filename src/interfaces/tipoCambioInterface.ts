import { IContacto } from "./contactoInterface";

export interface ITipoCambio {
  Id: number;
  MonedaOriginal: string;
  MonedaNueva: string;
  Conversion: number;
}