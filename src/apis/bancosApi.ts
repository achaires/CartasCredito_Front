import { IBanco, IBancoInsert, IBancoUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const bancosApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getBancos: builder.query<IBanco[], void>({
      providesTags: ["Bancos"],
      query: () => `/bancos`,
    }),
    getBanco: builder.query<IBanco, number>({
      providesTags: ["Bancos"],
      query: (bancoId) => `/bancos/${bancoId}`,
    }),
    addBanco: builder.mutation<IRespuestaFormato, IBancoInsert>({
      invalidatesTags: ["Bancos"],
      query: (data) => {
        return {
          url: `/bancos`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateBanco: builder.mutation<IRespuestaFormato, IBancoUpdate>({
      invalidatesTags: ["Bancos"],
      query: (data) => {
        return {
          url: `/bancos/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleBanco: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Bancos"],
      query: (data) => {
        return {
          url: `/bancos/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useAddBancoMutation, useGetBancosQuery, useLazyGetBancoQuery, useUpdateBancoMutation, useToggleBancoMutation } = bancosApiSlice;
