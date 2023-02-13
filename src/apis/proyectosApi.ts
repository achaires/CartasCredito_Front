import { IProyecto, IRespuestaFormato, IProyectoInsert, IProyectoUpdate } from "@/interfaces";
import { rootApi } from "./rootApi";

export const proyectosApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getProyectos: builder.query<IProyecto[], void>({
      providesTags: ["Proyectos"],
      query: () => `/proyectos`,
    }),
    addProyecto: builder.mutation<IRespuestaFormato, IProyectoInsert>({
      invalidatesTags: ["Proyectos"],
      query: (data) => {
        return {
          url: `/proyectos`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateProyecto: builder.mutation<IRespuestaFormato, IProyectoUpdate>({
      invalidatesTags: ["Proyectos"],
      query: (data) => {
        return {
          url: `/proyectos/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleProyecto: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["Proyectos"],
      query: (data) => {
        return {
          url: `/proyectos/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetProyectosQuery, useAddProyectoMutation, useUpdateProyectoMutation, useToggleProyectoMutation } = proyectosApiSlice;
