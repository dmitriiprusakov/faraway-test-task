// Application-facing data, independent of the API provider.
export type Launch = {
	id: string;
	name: string;
	details?: string;
	date_utc?: string;
	links: LaunchLinks;
	status: LaunchStatus;
};

export type LaunchStatus = {
	label: string;
	tone: "processing" | "success" | "error" | "warning" | "default";
};

export type LaunchLinks = {
	article?: string;
	presskit?: string;
	webcast?: string;
	youtube_id?: string;
	image: { small?: string; large?: string };
	patch?: string;
	photos: string[];
};

export type LaunchesResponse = {
	docs: Launch[];
	totalDocs: number;
	limit: number;
	page: number;
};

export type LaunchesRequest = {
	query: LaunchesQuery;
	options: LaunchesOptions;
};

export type LaunchesQuery = {
	text?: string;
	datesRange?: [string | undefined, string | undefined];
};

export type LaunchesOptions = {
	page: number;
	limit: number;
};

export type LaunchResponse = Launch;

// Launch Library 2 v2.3.0 normal/list-detail response fields used by the adapter.
export type LibraryImage = {
	image_url: string;
	thumbnail_url?: string | null;
};

export type LibraryLink = {
	url: string;
	title?: string | null;
	priority?: number;
};

export type LibraryLaunch = {
	id: string;
	name: string;
	net: string | null;
	status: { id: number; name: string; abbrev: string } | null;
	image: LibraryImage | null;
	mission: {
		description: string;
		image?: LibraryImage | null;
		info_urls?: LibraryLink[];
		vid_urls?: LibraryLink[];
	} | null;
	mission_patches?: { image_url: string; priority: number }[];
	info_urls?: LibraryLink[];
	vid_urls?: LibraryLink[];
};

export type LibraryLaunchesResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: LibraryLaunch[];
};
