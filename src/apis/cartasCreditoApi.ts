import { ICartaComercial, ICartaCreditoClonar, ICartaCreditoFiltrar, IRespuestaFormato, ISwiftNumCartaRequest } from "@/interfaces";
import { rootApi } from "./rootApi";

export const cartasCreditoApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCartasComerciales: builder.query<ICartaComercial[], ICartaCreditoFiltrar>({
      providesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/operaciones/filtrar`,
          method: "POST",
          body: data,
        };
      },
    }),
    getCartaComercial: builder.query<ICartaComercial, string>({
      providesTags: ["CartasCreditoDetalle"],
      query: (ccId) => {
        return {
          url: `/cartascredito/${ccId}`,
          method: "GET",
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
    clonarCartaComercial: builder.mutation<IRespuestaFormato, ICartaCreditoClonar>({
      invalidatesTags: ["CartasCredito"],
      query: (data) => {
        return {
          url: `/operaciones/clonar/${data.CartaCreditoId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateCartaComercial: builder.mutation<IRespuestaFormato, ICartaComercial>({
      invalidatesTags: ["CartasCreditoDetalle"],
      query: (data) => {
        return {
          url: `/cartascredito/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    updateCartaComercialEstatus: builder.mutation<IRespuestaFormato, ICartaComercial>({
      invalidatesTags: ["CartasCreditoDetalle"],
      query: (data) => {
        return {
          url: `/operaciones/cambiarestatus/${data.Id}`,
          method: "POST",
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
    addSwiftNumCarta: builder.mutation<IRespuestaFormato, ISwiftNumCartaRequest>({
      query: (data) => {
        let fd = new FormData();
        fd.append("CartaCreditoId", data.CartaCreditoId);
        fd.append("NumCarta", data.NumCarta);

        if (data.SwiftFile.length > 0) {
          fd.append("SwiftFile", data.SwiftFile[0]);
        }

        return {
          url: `/operaciones/adjuntarswift/${data.CartaCreditoId}`,
          method: "POST",
          body: fd,
          /* headers: {
            "content-type": "multipart/form-data",
          }, */
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
  useLazyGetCartaComercialQuery,
  useUpdateCartaComercialEstatusMutation,
  useAddSwiftNumCartaMutation,
  useClonarCartaComercialMutation
} = cartasCreditoApiSlice;
