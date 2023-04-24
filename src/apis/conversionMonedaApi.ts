import { IConversionMonedaConvertir, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const conversionMonedaApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    convertir: builder.mutation<IRespuestaFormato, IConversionMonedaConvertir>({
      invalidatesTags: ["Comisiones"],
      query: (data) => {
        return {
          url: `/conversionmoneda/convertir`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useConvertirMutation } = conversionMonedaApiSlice;
