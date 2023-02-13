import { IMoneda, IRespuestaFormato, IMonedaInsert, IMonedaUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const monedasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonedas: builder.query<IMoneda[], void>({
      providesTags: ["Monedas"],
      query: () => `/monedas`,
    }),
    addMoneda: builder.mutation<IRespuestaFormato, IMonedaInsert>({
      invalidatesTags: ["Monedas"],
      query: (data) => {
        return {
          url: `/monedas`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateMoneda: builder.mutation<IRespuestaFormato, IMonedaUpdate>({
      invalidatesTags: ["Monedas"],
      query: (data) => {
        return {
          url: `/monedas/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleMoneda: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Monedas"],
      query: (data) => {
        return {
          url: `/monedas/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetMonedasQuery, useAddMonedaMutation, useUpdateMonedaMutation, useToggleMonedaMutation } = monedasApiSlice;
