import { IEnmienda, IEnmiendaInsert, IEnmiendaUpdate, IRespuestaFormato, ISwiftEnmiendaRequest } from "@/interfaces";
import { rootApi } from "./rootApi";

export const enmiendasApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addEnmienda: builder.mutation<IRespuestaFormato, IEnmiendaInsert>({
      invalidatesTags: ["Enmiendas", "CartasCreditoDetalle", "CartasCredito"],
      query: (data) => {
        return {
          url: `/enmiendas`,
          method: "POST",
          body: data,
        };
      },
    }),
    approveEnmienda: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Enmiendas", "CartasCreditoDetalle", "CartasCredito"],
      query: (id) => {
        return {
          url: `/enmiendas/aprobar/${id}`,
          method: "POST",
        };
      },
    }),
    addSwiftEnmienda: builder.mutation<IRespuestaFormato, ISwiftEnmiendaRequest>({
      query: (data) => {
        let fd = new FormData();
        fd.append("EnmiendaId", data.EnmiendaId.toString());

        if (data.SwiftFile.length > 0) {
          fd.append("SwiftFile", data.SwiftFile[0]);
        }

        return {
          url: `/operaciones/adjuntarswift-enmienda/${data.EnmiendaId}`,
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

export const { useAddEnmiendaMutation, useApproveEnmiendaMutation, useAddSwiftEnmiendaMutation } = enmiendasApiSlice;
