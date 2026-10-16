
import { Empty } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import type { FC } from "react";
import { useParams } from "react-router-dom";

import { useGetLaunchQuery } from "api";
import type { RouterParams } from "types";

import { Card, Embedded, Photos } from "./components";
import LaunchError from "./error";
import LaunchLoading from "./loading";

const Launch: FC = () => {
	const { launchId } = useParams<RouterParams>();

	const { data, isLoading, isFetching, isError, refetch } = useGetLaunchQuery(launchId ?? skipToken);

	if (!launchId) return null;

	if (isLoading || isFetching) return <LaunchLoading />;

	if (isError) return <LaunchError retry={refetch} />;

	if (!data) return <Empty />;

	const { name, date_utc, details, links, success, upcoming } = data;

	return (
		<>
			<Card
				name={name}
				details={details}
				success={success}
				upcoming={upcoming}
				date_utc={date_utc}
				links={links}
			/>
			{!!links?.flickr?.original?.length && (
				<Photos links={links.flickr.original} />
			)}
			{links?.youtube_id && (
				<Embedded
					title={`Webcast of ${name}`}
					link={`https://www.youtube.com/embed/${links?.youtube_id}`}
				/>
			)}
		</>
	);
};

export default Launch;
