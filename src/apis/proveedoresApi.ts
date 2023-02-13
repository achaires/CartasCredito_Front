import { IProveedor, IRespuestaFormato, IProveedorInsert, IProveedorUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const proveedoresApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getProveedores: builder.query<IProveedor[], void>({
      providesTags: ["Proveedores"],
      query: () => `/proveedores`,
    }),
    addProveedor: builder.mutation<IRespuestaFormato, IProveedorInsert>({
      invalidatesTags: ["Proveedores"],
      query: (data) => {
        return {
          url: `/proveedores`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateProveedor: builder.mutation<IRespuestaFormato, IProveedorUpdate>({
      invalidatesTags: ["Proveedores"],
      query: (data) => {
        return {
          url: `/proveedores/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleProveedor: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Proveedores"],
      query: (data) => {
        return {
          url: `/proveedores/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetProveedoresQuery, useAddProveedorMutation, useUpdateProveedorMutation, useToggleProveedorMutation } = proveedoresApiSlice;
