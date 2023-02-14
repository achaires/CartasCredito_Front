import { ICartaComercial, ICartaCreditoFiltrar, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const cartasCreditoApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCartasComerciales: builder.query<ICartaComercial[], ICartaCreditoFiltrar>({
      providesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/cartascredito`,
          method: "GET",
          params: data,
        };
      },
    }),
    filtrarCartasComerciales: builder.query<ICartaComercial[], ICartaCreditoFiltrar>({
      providesTags: ["CartasCredito"],
      query: (filtros) => {
        return {
          url: `/operaciones/filtrar`,
          method: "POST",
          body: filtros,
        };
      },
    }),
    addCartaComercial: builder.mutation<IRespuestaFormato, ICartaComercial>({
      invalidatesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/cartascredito`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateCartaComercial: builder.mutation<IRespuestaFormato, ICartaComercial>({
      invalidatesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/cartascredito/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleCartaComercial: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/cartascredito/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetCartasComercialesQuery,
  useLazyGetCartasComercialesQuery,
  useAddCartaComercialMutation,
  useUpdateCartaComercialMutation,
  useToggleCartaComercialMutation,
  useLazyFiltrarCartasComercialesQuery,
} = cartasCreditoApiSlice;
