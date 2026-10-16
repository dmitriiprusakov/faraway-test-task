import type { Launch, LaunchStatus, LibraryLaunch, LibraryLaunchesResponse, LaunchesOptions, LaunchesResponse } from "./types";

const statuses: Record<number, LaunchStatus> = {
	1: { label: "Upcoming", tone: "processing" },
	2: { label: "Upcoming", tone: "processing" },
	3: { label: "Success", tone: "success" },
	4: { label: "Failure", tone: "error" },
	5: { label: "On hold", tone: "warning" },
	6: { label: "In flight", tone: "processing" },
	7: { label: "Partial failure", tone: "warning" },
	8: { label: "Upcoming", tone: "processing" },
	9: { label: "Payload deployed", tone: "processing" },
};

function youtubeId(value: string): string | undefined {
	try {
		const url = new URL(value);
		let id: string | null | undefined;
		if (url.hostname === "youtu.be") id = url.pathname.split("/")[1];
		else if (["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
			id = url.searchParams.get("v") ?? (/^\/(embed|live|shorts)\//.test(url.pathname) ? url.pathname.split("/")[2] : undefined);
		}
		return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : undefined;
	} catch {
		return undefined;
	}
}

export function adaptLaunch(launch: LibraryLaunch): Launch {
	const info = [...(launch.info_urls ?? []), ...(launch.mission?.info_urls ?? [])]
		.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
	const videos = [...(launch.vid_urls ?? []), ...(launch.mission?.vid_urls ?? [])]
		.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
	const patch = [...(launch.mission_patches ?? [])].sort((a, b) => a.priority - b.priority)[0]?.image_url;
	const image = launch.image ?? launch.mission?.image;
	const video = videos.map(video => ({ url: video.url, id: youtubeId(video.url) }));
	const embedded = video.find(video => video.id);

	return {
		id: launch.id,
		name: launch.name,
		details: launch.mission?.description || undefined,
		date_utc: launch.net ?? undefined,
		status: (launch.status && statuses[launch.status.id]) ?? { label: launch.status?.name ?? "Unknown", tone: "default" },
		links: {
			article: info[0]?.url,
			presskit: info.find(link => /press\s?kit/i.test(link.title ?? ""))?.url,
			webcast: embedded?.url ?? video[0]?.url,
			youtube_id: embedded?.id,
			image: {
				small: image?.thumbnail_url ?? image?.image_url,
				large: image?.image_url,
			},
			patch: patch ?? undefined,
			photos: [...new Set([launch.image?.image_url, launch.mission?.image?.image_url].filter((url): url is string => !!url))],
		},
	};
}

export function adaptLaunches(response: LibraryLaunchesResponse, options: LaunchesOptions): LaunchesResponse {
	return {
		docs: response.results.map(adaptLaunch),
		totalDocs: response.count,
		page: options.page,
		limit: options.limit,
	};
}
