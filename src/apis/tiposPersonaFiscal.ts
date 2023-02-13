import { ITipoPersonaFiscal, IRespuestaFormato, ITipoPersonaFiscalInsert, ITipoPersonaFiscalUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const tiposPersonaFiscalApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTiposPersonaFiscal: builder.query<ITipoPersonaFiscal[], void>({
      providesTags: ["TiposPersonaFiscal"],
      query: () => `/tipospersonafiscal`,
    }),
    addTipoPersonaFiscal: builder.mutation<IRespuestaFormato, ITipoPersonaFiscalInsert>({
      invalidatesTags: ["TiposPersonaFiscal"],
      query: (data) => {
        return {
          url: `/tipospersonafiscal`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateTipoPersonaFiscal: builder.mutation<IRespuestaFormato, ITipoPersonaFiscalUpdate>({
      invalidatesTags: ["TiposPersonaFiscal"],
      query: (data) => {
        return {
          url: `/tipospersonafiscal/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleTipoPersonaFiscal: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["TiposPersonaFiscal"],
      query: (data) => {
        return {
          url: `/tipospersonafiscal/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetTiposPersonaFiscalQuery, useAddTipoPersonaFiscalMutation, useUpdateTipoPersonaFiscalMutation, useToggleTipoPersonaFiscalMutation } =
  tiposPersonaFiscalApiSlice;
