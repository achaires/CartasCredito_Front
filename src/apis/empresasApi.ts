import { IEmpresa, IEmpresaInsert, IEmpresaUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const empresasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmpresas: builder.query<IEmpresa[], void>({
      providesTags: ["Empresas"],
      query: () => `/empresas`,
    }),
    addEmpresa: builder.mutation<IRespuestaFormato, IEmpresaInsert>({
      invalidatesTags: ["Empresas"],
      query: (data) => {
        return {
          url: `/empresas`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateEmpresa: builder.mutation<IRespuestaFormato, IEmpresaUpdate>({
      invalidatesTags: ["Empresas"],
      query: (data) => {
        return {
          url: `/empresas/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleEmpresa: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Empresas"],
      query: (data) => {
        return {
          url: `/empresas/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetEmpresasQuery, useAddEmpresaMutation, useUpdateEmpresaMutation, useToggleEmpresaMutation } = empresasApiSlice;
