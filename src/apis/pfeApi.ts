import { IPFE_Programa, IPFE_ProgramaSearch, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const pfeApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPFEProgramas: builder.query<IPFE_Programa[], void>({
      providesTags: ["PFE_Programas"],
      query: () => `/pfeprogramas`,
    }),
    searchPFEPRograma: builder.query<IPFE_Programa, IPFE_ProgramaSearch>({
      providesTags: ["PFE_Programas"],
      query: (data) => {
        return {
          url: `/pfeprogramas/buscar`,
          method: "post",
          body: data,
        };
      },
    }),
    addPFEPrograma: builder.mutation<IRespuestaFormato, IPFE_Programa>({
      invalidatesTags: ["PFE_Programas"],
      query: (data) => {
        return {
          url: `/pfeprogramas/agregar`,
          method: "POST",
          body: data,
        };
      },
    }),
    updatePFEPrograma: builder.mutation<IRespuestaFormato, IPFE_Programa>({
      invalidatesTags: ["PFE_Programas"],
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

export const { useGetPFEProgramasQuery, useLazySearchPFEPRogramaQuery, useAddPFEProgramaMutation, useUpdatePFEProgramaMutation } = pfeApiSlice;
