import { IEnmienda, IEnmiendaInsert, IEnmiendaUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const enmiendasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addEnmienda: builder.mutation<IRespuestaFormato, IEnmiendaInsert>({
      invalidatesTags: ["Enmiendas"],
      query: (data) => {
        return {
          url: `/enmiendas`,
          method: "POST",
          body: data,
        };
      },
    }),
    approveEnmienda: builder.mutation<IRespuestaFormato, IEnmiendaUpdate>({
      invalidatesTags: ["Enmiendas"],
      query: (data) => {
        return {
          url: `/enmiendas/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

export const { useAddEnmiendaMutation, useApproveEnmiendaMutation } = enmiendasApiSlice;
