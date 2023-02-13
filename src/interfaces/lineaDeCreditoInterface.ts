export interface ILineaDeCredito {
  Id: number;
  EmpresaId: number;
  Empresa: string;
  BancoId: number;
  Banco: string;
  Monto: number;
  Cuenta: string;
  Activo: boolean;
  CreadoPor: string;
  Creado: string;
  Actualizado?: string;
  Eliminado?: string;
}

export interface ILineaDeCreditoInsert {
  EmpresaId: number;
  BancoId: number;
  Monto: number;
  Cuenta: string;
}

export interface ILineaDeCreditoUpdate extends ILineaDeCreditoInsert {
  Id: number;
}
