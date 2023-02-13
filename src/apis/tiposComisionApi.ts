import { ITipoComision, IRespuestaFormato, ITipoComisionInsert, ITipoComisionUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const tiposComisionApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTiposComision: builder.query<ITipoComision[], void>({
      providesTags: ["TiposComision"],
      query: () => `/tiposcomision`,
    }),
    addTipoComision: builder.mutation<IRespuestaFormato, ITipoComisionInsert>({
      invalidatesTags: ["TiposComision"],
      query: (data) => {
        return {
          url: `/tiposcomision`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateTipoComision: builder.mutation<IRespuestaFormato, ITipoComisionUpdate>({
      invalidatesTags: ["TiposComision"],
      query: (data) => {
        return {
          url: `/tiposcomision/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleTipoComision: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["TiposComision"],
      query: (data) => {
        return {
          url: `/tiposcomision/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetTiposComisionQuery, useAddTipoComisionMutation, useUpdateTipoComisionMutation, useToggleTipoComisionMutation } = tiposComisionApiSlice;
