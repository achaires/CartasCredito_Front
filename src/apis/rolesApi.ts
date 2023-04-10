import { IRespuestaFormato } from "@/interfaces";
import { IRole, IRoleInsert, IRoleUpdate } from "@/interfaces/rolesInterface";
import { rootApi } from "./rootApi";

export const rolesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<IRole[], void>({
      providesTags: ["Roles"],
      query: () => `/roles`,
    }),
    getRoleById: builder.query<IRole, string>({
      providesTags: ["Roles"],
      query: (roleId) => `/roles/${roleId}`,
    }),
    addRole: builder.mutation<IRespuestaFormato, IRoleInsert>({
      invalidatesTags: ["Roles"],
      query: (data) => {
        return {
          url: `/roles`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateRole: builder.mutation<IRespuestaFormato, IRoleUpdate>({
      invalidatesTags: ["Roles"],
      query: (data) => {
        return {
          url: `/roles/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleRole: builder.mutation<IRespuestaFormato, string>({
      invalidatesTags: ["Roles"],
      query: (data) => {
        return {
          url: `/roles/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetRolesQuery, useLazyGetRoleByIdQuery, useAddRoleMutation, useUpdateRoleMutation, useToggleRoleMutation } = rolesApiSlice;
