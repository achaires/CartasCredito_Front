import { IPFEPrograma, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const pfeApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPrograma: builder.mutation<IPFEPrograma, IPFEPrograma>({
      invalidatesTags: ["PFEProgramas"],
      query: (data) => {
        return {
          url: `/pfeprogramas/buscar`,
          method: "POST",
          body: data,
        };
      },
    }),
    addPrograma: builder.mutation<IRespuestaFormato, IPFEPrograma>({
      invalidatesTags: ["PFEProgramas"],
      query: (data) => {
        return {
          url: `/pfeprogramas`,
          method: "POST",
          body: data,
        };
      },
    }),
    updatePrograma: builder.mutation<IRespuestaFormato, IPFEPrograma>({
      invalidatesTags: ["PFEProgramas"],
      query: (data) => {
        return {
          url: `/pfeprogramas/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

export const { useSearchProgramaMutation, useAddProgramaMutation, useUpdateProgramaMutation } = pfeApiSlice;
