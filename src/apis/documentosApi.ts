import { IDocumento, IRespuestaFormato, IDocumentoInsert, IDocumentoUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const documentosApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentos: builder.query<IDocumento[], void>({
      providesTags: ["Documentos"],
      query: () => `/documentos`,
    }),
    addDocumento: builder.mutation<IRespuestaFormato, IDocumentoInsert>({
      invalidatesTags: ["Documentos"],
      query: (data) => {
        return {
          url: `/documentos`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateDocumento: builder.mutation<IRespuestaFormato, IDocumentoUpdate>({
      invalidatesTags: ["Documentos"],
      query: (data) => {
        return {
          url: `/documentos/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleDocumento: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Documentos"],
      query: (data) => {
        return {
          url: `/documentos/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetDocumentosQuery, useAddDocumentoMutation, useUpdateDocumentoMutation, useToggleDocumentoMutation } = documentosApiSlice;
