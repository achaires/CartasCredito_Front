import { IReporteAnalisisCartaRequest, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const reportesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getReporteAnalisisCartas: builder.query<IRespuestaFormato, IReporteAnalisisCartaRequest>({
      query: (data) => {
        return {
          url: `/reportes/analisiscartas`,
          body: data,
          method: "POST",
        };
      },
    }),
  }),
});

export const { useLazyGetReporteAnalisisCartasQuery } = reportesApiSlice;
