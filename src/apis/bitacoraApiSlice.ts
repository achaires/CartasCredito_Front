import { IBitacoraMovimiento, IBitacoraMovimientoFiltro } from "@/interfaces";
import { rootApi } from "./rootApi";

export const bitacoraApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovimientos: builder.query<IBitacoraMovimiento[], IBitacoraMovimientoFiltro>({
      providesTags: ["Bitacora"],
      query: (data) => {
        return {
          url: `/bitacoramovimientos/filtrar`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useGetMovimientosQuery, useLazyGetMovimientosQuery } = bitacoraApiSlice;
