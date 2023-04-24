import { IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const reportesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportes: builder.query<IRespuestaFormato, void>({
      query: (data) => {
        return {
          url: `/reportes/`,
          body: data,
          method: "POST",
        };
      },
    }),
    getReporteComisionesTipoComision: builder.query<IRespuestaFormato, IReporteRequest>({
      query: (data) => {
        return {
          url: `/reportes/comisionestipocomision`,
          body: data,
          method: "POST",
        };
      },
    }),
  }),
});

export const { useLazyGetReporteAnalisisCartasQuery, useLazyGetReporteComisionesTipoComisionQuery } = reportesApiSlice;
