import { ITipoCambio, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const tipoCambioApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
        getTipoCambios: builder.query<ITipoCambio[], void>({
      providesTags: ["TipoCambio"],
      query: () => `/tipoCambio`,
    }),
        getTipoCambio: builder.query<ITipoCambio, number>({
            providesTags: ["TipoCambio"],
            query: (bancoId) => `/tipoCambio/${bancoId}`,
    }),
  }),
});

export const { useGetTipoCambiosQuery, useGetTipoCambioQuery } = tipoCambioApiSlice;
