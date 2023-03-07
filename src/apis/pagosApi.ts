import { IPago, IRespuestaFormato, IPagoInsert, IPagoUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const pagosApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPagosVencidos: builder.query<IPago[], void>({
      providesTags: ["Pagos"],
      query: () => `/pagosvencidos`,
    }),
    getPagosProgramados: builder.query<IPago[], void>({
      providesTags: ["Pagos"],
      query: () => `/pagosprogramados`,
    }),
    addPago: builder.mutation<IRespuestaFormato, IPagoInsert>({
      invalidatesTags: ["Pagos"],
      query: (data) => {
        return {
          url: `/pagos`,
          method: "POST",
          body: data,
        };
      },
    }),
    updatePago: builder.mutation<IRespuestaFormato, IPagoUpdate>({
      invalidatesTags: ["Pagos"],
      query: (data) => {
        return {
          url: `/pagos/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    togglePago: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Pagos"],
      query: (data) => {
        return {
          url: `/pagos/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetPagosVencidosQuery,
  useGetPagosProgramadosQuery,
  useAddPagoMutation,
  useUpdatePagoMutation,
  useTogglePagoMutation,
  useLazyGetPagosProgramadosQuery,
  useLazyGetPagosVencidosQuery,
} = pagosApiSlice;
