import { IEnmienda, IEnmiendaInsert, IEnmiendaUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const enmiendasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addEnmienda: builder.mutation<IRespuestaFormato, IEnmiendaInsert>({
      invalidatesTags: ["Enmiendas", "CartasCreditoDetalle", "CartasCredito"],
      query: (data) => {
        return {
          url: `/enmiendas`,
          method: "POST",
          body: data,
        };
      },
    }),
    approveEnmienda: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Enmiendas", "CartasCreditoDetalle", "CartasCredito"],
      query: (id) => {
        return {
          url: `/enmiendas/aprobar/${id}`,
          method: "POST",
        };
      },
    }),
  }),
});

export const { useAddEnmiendaMutation, useApproveEnmiendaMutation } = enmiendasApiSlice;
