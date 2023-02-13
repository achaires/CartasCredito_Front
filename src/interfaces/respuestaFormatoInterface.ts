export interface IRespuestaFormato {
  Flag: boolean;
  Errors: Array<string> | null;
  Content: Array<string> | null;
  DataInt: number | null;
  DataDecimal: number | null;
  Info: string | null;
  DataString: string | null;
  DataString1: string | null;
  DataString2: string | null;
  DataString3: string | null;
}
