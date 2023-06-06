import { IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const descargasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getSwiftBase64: builder.query<IRespuestaFormato, string>({
      query: (cartaCreidtoId) => `/descargas/swift/${cartaCreidtoId}`,
    }),
  }),
});

export const { useLazyGetSwiftBase64Query } = descargasApiSlice;
