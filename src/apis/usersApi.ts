import { IRespuestaFormato, IUser, IUserInsert, IUserUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const usersApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      providesTags: ["Users"],
      query: () => `/users`,
    }),
    getUserById: builder.query<IUser, string>({
      providesTags: ["UserDetail"],
      query: (userId) => `/users/${userId}`,
    }),
    addUser: builder.mutation<IRespuestaFormato, IUserInsert>({
      invalidatesTags: ["Users"],
      query: (data) => {
        return {
          url: `/users`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateUser: builder.mutation<IRespuestaFormato, IUserUpdate>({
      invalidatesTags: ["Users"],
      query: (data) => {
        return {
          url: `/users/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleUser: builder.mutation<IRespuestaFormato, string>({
      invalidatesTags: ["Users"],
      query: (data) => {
        return {
          url: `/users/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useToggleUserMutation, useLazyGetUserByIdQuery } = usersApiSlice;
