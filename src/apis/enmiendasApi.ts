import { IEnmienda, IEnmiendaInsert, IRespuestaFormato } from "@/interfaces";
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
  }),
});

export const { useAddEnmiendaMutation } = enmiendasApiSlice;
