import { ILineaDeCredito, IRespuestaFormato, ILineaDeCreditoInsert, ILineaDeCreditoUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const lineasDeCreditoApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getLineasDeCredito: builder.query<ILineaDeCredito[], void>({
      providesTags: ["LineasDeCredito"],
      query: () => `/lineasdecredito`,
    }),
    addLineaDeCredito: builder.mutation<IRespuestaFormato, ILineaDeCreditoInsert>({
      invalidatesTags: ["LineasDeCredito"],
      query: (data) => {
        return {
          url: `/lineasdecredito`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateLineaDeCredito: builder.mutation<IRespuestaFormato, ILineaDeCreditoUpdate>({
      invalidatesTags: ["LineasDeCredito"],
      query: (data) => {
        return {
          url: `/lineasdecredito/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleLineaDeCredito: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["LineasDeCredito"],
      query: (data) => {
        return {
          url: `/lineasdecredito/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetLineasDeCreditoQuery, useAddLineaDeCreditoMutation, useUpdateLineaDeCreditoMutation, useToggleLineaDeCreditoMutation } = lineasDeCreditoApi;
