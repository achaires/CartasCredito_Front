import { IDivision, IDivisionInsert, IDivisionUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const divisionesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisiones: builder.query<IDivision[], void>({
      providesTags: ["Divisiones"],
      query: () => `/divisiones`,
    }),
    addDivision: builder.mutation<IRespuestaFormato, IDivisionInsert>({
      invalidatesTags: ["Divisiones"],
      query: (data) => {
        return {
          url: `/divisiones`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateDivision: builder.mutation<IRespuestaFormato, IDivisionUpdate>({
      invalidatesTags: ["Divisiones"],
      query: (data) => {
        return {
          url: `/divisiones/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleDivision: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Divisiones"],
      query: (data) => {
        return {
          url: `/divisiones/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetDivisionesQuery, useAddDivisionMutation, useToggleDivisionMutation, useUpdateDivisionMutation } = divisionesApiSlice;
