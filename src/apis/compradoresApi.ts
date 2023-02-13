import { IComprador, IRespuestaFormato, ICompradorInsert, ICompradorUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const compradoresApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompradores: builder.query<IComprador[], void>({
      providesTags: ["Compradores"],
      query: () => `/compradores`,
    }),
    addComprador: builder.mutation<IRespuestaFormato, ICompradorInsert>({
      invalidatesTags: ["Compradores"],
      query: (data) => {
        return {
          url: `/compradores`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateComprador: builder.mutation<IRespuestaFormato, ICompradorUpdate>({
      invalidatesTags: ["Compradores"],
      query: (data) => {
        return {
          url: `/compradores/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleComprador: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Compradores"],
      query: (data) => {
        return {
          url: `/compradores/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetCompradoresQuery, useAddCompradorMutation, useUpdateCompradorMutation, useToggleCompradorMutation } = compradoresApiSlice;
