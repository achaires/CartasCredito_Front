import { IPago, IRespuestaFormato, IPagoInsert, IPagoUpdate, IPagoComisionInsert } from "@/interfaces";
import { rootApi } from "./rootApi";

export const pagosComisionesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addPagoComision: builder.mutation<IRespuestaFormato, IPagoComisionInsert>({
      invalidatesTags: ["Pagos"],
      query: (data) => {
        return {
          url: `/pagoscomisiones`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useAddPagoComisionMutation } = pagosComisionesApi;
