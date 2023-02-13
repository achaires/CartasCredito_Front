import { IComision, IComisionInsert, IComisionUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const comisionesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getComisiones: builder.query<IComision[], void>({
      providesTags: ["Comisiones"],
      query: () => `/comisiones`,
    }),
    addComision: builder.mutation<IRespuestaFormato, IComisionInsert>({
      invalidatesTags: ["Comisiones"],
      query: (data) => {
        return {
          url: `/comisiones`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateComision: builder.mutation<IRespuestaFormato, IComisionUpdate>({
      invalidatesTags: ["Comisiones"],
      query: (data) => {
        return {
          url: `/comisiones/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleComision: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Comisiones"],
      query: (data) => {
        return {
          url: `/comisiones/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetComisionesQuery, useAddComisionMutation, useUpdateComisionMutation, useToggleComisionMutation } = comisionesApiSlice;
