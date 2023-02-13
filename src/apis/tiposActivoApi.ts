import { ITipoActivo, IRespuestaFormato, ITipoActivoInsert, ITipoActivoUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const tiposActivoApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTiposActivo: builder.query<ITipoActivo[], void>({
      providesTags: ["TiposActivo"],
      query: () => `/tiposactivo`,
    }),
    addTipoActivo: builder.mutation<IRespuestaFormato, ITipoActivoInsert>({
      invalidatesTags: ["TiposActivo"],
      query: (data) => {
        return {
          url: `/tiposactivo`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateTipoActivo: builder.mutation<IRespuestaFormato, ITipoActivoUpdate>({
      invalidatesTags: ["TiposActivo"],
      query: (data) => {
        return {
          url: `/tiposactivo/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleTipoActivo: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["TiposActivo"],
      query: (data) => {
        return {
          url: `/tiposactivo/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetTiposActivoQuery, useAddTipoActivoMutation, useUpdateTipoActivoMutation, useToggleTipoActivoMutation } = tiposActivoApiSlice;
