export type Pagination = {
	page: number;
	pageSize: number;
	total?: number;
}

export type Filters = {
	text?: string;
	datesRange?: [string | undefined, string | undefined],
}

export type RouterParams = {
	launchId: string;
}
