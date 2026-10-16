import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LaunchesResponse, LaunchesRequest, LaunchResponse } from "./types";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: "https://api.spacexdata.com/v5" }),
	endpoints: builder => ({
		getLaunches: builder.query<LaunchesResponse, LaunchesRequest>({
			query: ({
				query: { text, datesRange },
				options,
			}) => ({
				url: "/launches/query",
				method: "POST",
				body: {
					query: {
						$text: text && {
							$search: text,
						},
						date_utc: datesRange && {
							$gte: datesRange && datesRange[0],
							$lte: datesRange && datesRange[1],
						},
					},
					options,
				},
			}),
		}),
		getLaunch: builder.query<LaunchResponse, string>({
			query: (id) => ({
				url: `/launches/${id}`,
			}),
		}),
	}),

});

export const { useGetLaunchesQuery, useGetLaunchQuery } = apiSlice;
