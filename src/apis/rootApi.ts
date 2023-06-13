import { RootState } from "@/store";
import { apiHost } from "@/utils/apiConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "Divisiones",
    "Empresas",
    "AgentesAduanales",
    "Bancos",
    "CartasCredito",
    "Contactos",
    "Comisiones",
    "Compradores",
    "Enmiendas",
    "LineasDeCredito",
    "Documentos",
    "Monedas",
    "Proveedores",
    "Proyectos",
    "TiposActivo",
    "TiposComision",
    "TiposCobertura",
    "TiposPersonaFiscal",
    "CartasCreditoDetalle",
    "Pagos",
    "CartaCreditoComisiones",
    "Users",
    "UserDetail",
    "Roles",
    "Permissions",
    "PFEProgramas",
    "PFEPagos",
    "Bitacora",
    "Reportes",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiHost}/api`,
    credentials: "same-origin",
    prepareHeaders: (headers, { getState }) => {
      const s = getState() as RootState;

      if (s.auth.accessToken) {
        headers.set("authorization", `Bearer ${s.auth.accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
