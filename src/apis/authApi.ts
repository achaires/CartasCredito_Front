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
    registerUser: builder.mutation<string, { UserName: string; Password: string }>({
      invalidatesTags: ["Users"],
      query: (data) => {
        return {
          url: `/account/register`,
          method: "POST",
          body: data,
        };
      },
    }),
    validateToken: builder.query<IUser, string>({
      providesTags: ["UserDetail"],
      query: (token) => {
        return {
          url: `/validainvitacion/${token}`,
          method: "POST",
        };
      },
    }),
    registerUserGIS: builder.mutation<IRespuestaFormato, { UserName: string; Password: string; Token: string }>({
      query: (userData) => {
        return {
          url: `/invitaciones/finalizaregistro`,
          method: "POST",
          body: userData,
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

export const { useLazyLoginUserQuery, useLazyGetCurrentUserQuery, useLogoutUserMutation, useRegisterUserMutation, useLazyValidateTokenQuery, useRegisterUserGISMutation } =
  authApiSlice;
