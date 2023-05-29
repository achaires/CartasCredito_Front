import { IPFEPrograma, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const pfeApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPrograma: builder.query<IPFEPrograma, void>({
      providesTags: ["PFEProgramas"],
      query: () => `/pfeprogramas/insert`,
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

export const { } = pfeApiSlice;
