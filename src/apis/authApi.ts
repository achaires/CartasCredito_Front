import { IRespuestaFormato, IUser, IUserInsert, IUserUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const authApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.query<string, { UserName: string; Password: string }>({
      providesTags: ["Users"],
      query: (data) => {
        return {
          url: `/account/login`,
          method: "POST",
          body: data,
        };
      },
    }),
    getCurrentUser: builder.query<IUser, void>({
      providesTags: ["UserDetail"],
      query: () => `/account/user`,
    }),
    logoutUser: builder.mutation<IUser, string>({
      invalidatesTags: ["UserDetail"],
      query: () => `/account/logout`,
    }),
  }),
});

export const { useLazyLoginUserQuery, useLazyGetCurrentUserQuery, useLogoutUserMutation } = authApiSlice;
