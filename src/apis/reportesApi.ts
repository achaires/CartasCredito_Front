import { IReporte, IReporteRequest, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const reportesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportes: builder.query<IReporte[], void>({
      providesTags: ["Reportes"],
      query: (data) => {
        return {
          url: `/reportes/historial`,
          body: data,
          method: "POST",
        };
      },
    }),
    generarReporte: builder.mutation<IReporte[], IReporteRequest>({
      invalidatesTags: ["Reportes"],
      query: (data) => {
        return {
          url: `/reportes2/generar`,
          body: data,
          method: "POST",
        };
      },
    }),
  }),
});

export const { useGenerarReporteMutation, useLazyGetReportesQuery, useGetReportesQuery } = reportesApiSlice;
