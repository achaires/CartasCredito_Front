import { IRespuestaFormato, ICartaCreditoComisionInsert, ICartaCreditoComisionUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const cartaCreditoComisionesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addCartaCreditoComision: builder.mutation<IRespuestaFormato, ICartaCreditoComisionInsert>({
      invalidatesTags: ["CartaCreditoComisiones"],
      query: (data) => {
        return {
          url: `/cartacreditocomisiones`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateCartaCreditoComision: builder.mutation<IRespuestaFormato, ICartaCreditoComisionUpdate>({
      invalidatesTags: ["CartaCreditoComisiones"],
      query: (data) => {
        return {
          url: `/cartacreditocomisiones/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleCartaCreditoComision: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["CartaCreditoComisiones"],
      query: (data) => {
        return {
          url: `/cartacreditocomisiones/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useAddCartaCreditoComisionMutation, useUpdateCartaCreditoComisionMutation, useToggleCartaCreditoComisionMutation } = cartaCreditoComisionesApi;
