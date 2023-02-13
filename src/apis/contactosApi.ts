import { IContacto, IContactoByModelQuery, IContactoInsert, IContactoUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const contactosApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactos: builder.query<IContacto[], void>({
      providesTags: ["Contactos"],
      query: () => `/contactos`,
    }),
    addContacto: builder.mutation<IRespuestaFormato, IContactoInsert>({
      invalidatesTags: ["Contactos", "AgentesAduanales"],
      query: (data) => {
        return {
          url: `/contactos`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateContacto: builder.mutation<IRespuestaFormato, IContactoUpdate>({
      invalidatesTags: ["Contactos", "AgentesAduanales"],
      query: (data) => {
        return {
          url: `/contactos/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleContacto: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Contactos"],
      query: (data) => {
        return {
          url: `/contactos/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useAddContactoMutation, useGetContactosQuery, useUpdateContactoMutation, useToggleContactoMutation } = contactosApiSlice;
