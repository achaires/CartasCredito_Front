import { IPermission, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const permissionsApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<IPermission[], void>({
      providesTags: ["Permissions"],
      query: () => `/permissions`,
    }),
  }),
});

export const { useGetPermissionsQuery } = permissionsApiSlice;
