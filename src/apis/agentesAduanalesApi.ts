import { IAgenteAduanal, IAgenteAduanalInsert, IAgenteAduanalUpdate, IRespuestaFormato } from "@/interfaces";
import { rootApi } from "./rootApi";

export const agentesAduanalesApiSlice = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentesAduanales: builder.query<IAgenteAduanal[], void>({
      providesTags: ["AgentesAduanales"],
      query: () => `/agentesaduanales`,
    }),
    addAgenteAduanal: builder.mutation<IRespuestaFormato, IAgenteAduanalInsert>({
      invalidatesTags: ["AgentesAduanales"],
      query: (data) => {
        return {
          url: `/agentesaduanales`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateAgenteAduanal: builder.mutation<IRespuestaFormato, IAgenteAduanalUpdate>({
      invalidatesTags: ["AgentesAduanales"],
      query: (data) => {
        return {
          url: `/agentesaduanales/${data.Id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleAgenteAduanal: builder.mutation<IRespuestaFormato, number>({
      invalidatesTags: ["AgentesAduanales"],
      query: (data) => {
        return {
          url: `/agentesaduanales/${data.toString()}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetAgentesAduanalesQuery, useAddAgenteAduanalMutation, useUpdateAgenteAduanalMutation, useToggleAgenteAduanalMutation } = agentesAduanalesApiSlice;
