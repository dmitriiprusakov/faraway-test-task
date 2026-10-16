import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adaptLaunch, adaptLaunches } from "./adapters";
import type { LaunchesResponse, LaunchesRequest, LaunchResponse, LibraryLaunch, LibraryLaunchesResponse } from "./types";

const baseUrl = process.env.NODE_ENV === "production"
	? "https://ll.thespacedevs.com/2.3.0/"
	: "https://lldev.thespacedevs.com/2.3.0/";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl }),
	// Retain visited pages/details to reduce requests against LL2's public quota.
	keepUnusedDataFor: 3600,
	endpoints: builder => ({
		getLaunches: builder.query<LaunchesResponse, LaunchesRequest>({
			query: ({ query: { text, datesRange }, options: { page, limit } }) => ({
				url: "launches/",
				params: {
					lsp__id: 121, // SpaceX
					mode: "detailed",
					ordering: "net",
					limit,
					offset: (page - 1) * limit,
					search: text?.trim() || undefined,
					net__gte: datesRange?.[0],
					net__lte: datesRange?.[1],
				},
			}),
			transformResponse: (response: LibraryLaunchesResponse, _meta, { options }) => adaptLaunches(response, options),
		}),
		getLaunch: builder.query<LaunchResponse, string>({
			query: id => "launches/" + encodeURIComponent(id) + "/",
			transformResponse: (response: LibraryLaunch) => adaptLaunch(response),
		}),
	}),
});

export const { useGetLaunchesQuery, useGetLaunchQuery } = apiSlice;
