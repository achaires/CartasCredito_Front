import { ITipoCobertura, IRespuestaFormato, ITipoCoberturaInsert, ITipoCoberturaUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const tiposCoberturaApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTiposCobertura: builder.query<ITipoCobertura[], void>({
      providesTags: ["TiposCobertura"],
      query: () => `/tiposcobertura`,
    }),
    addTipoCobertura: builder.mutation<IRespuestaFormato, ITipoCoberturaInsert>({
      invalidatesTags: ["TiposCobertura"],
      query: (data) => {
        return {
          url: `/tiposcobertura`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateTipoCobertura: builder.mutation<IRespuestaFormato, ITipoCoberturaUpdate>({
      invalidatesTags: ["TiposCobertura"],
      query: (data) => {
        return {
          url: `/tiposcobertura/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleTipoCobertura: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["TiposCobertura"],
      query: (data) => {
        return {
          url: `/tiposcobertura/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetTiposCoberturaQuery, useAddTipoCoberturaMutation, useUpdateTipoCoberturaMutation, useToggleTipoCoberturaMutation } = tiposCoberturaApiSlice;
