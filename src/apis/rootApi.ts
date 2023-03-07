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
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiHost}/api`,
    credentials: "same-origin",
    /* prepareHeaders: (headers, { getState }) => {
      if (!headers.has("content-type")) {
        headers.set("accept", "application/json");
        headers.set("content-type", "application/json");
      }

      return headers;
    }, */
  }),
  endpoints: (builder) => ({}),
});
