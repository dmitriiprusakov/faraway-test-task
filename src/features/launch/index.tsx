import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	const { launchId } = useParams<RouterParams>();

	const { data, isLoading, isFetching, isError, error, refetch } = useGetLaunchQuery(launchId ?? skipToken);

	if (!launchId) return null;

	if (isLoading || isFetching) return <LaunchLoading />;

	if (isError) return <LaunchError retry={refetch} rateLimited={error && "status" in error && error.status === 429} />;

	if (!data) return <Empty />;

	const { name, date_utc, details, links, status } = data;

	return (
		<>
			<Card
				name={name}
				details={details}
				status={status}
				date_utc={date_utc}
				links={links}
			/>
			{!!links.photos.length && (
				<Photos links={links.photos} />
			)}
			{links?.youtube_id && (
				<Embedded
					title={t("launch.webcastTitle", { name })}
					link={`https://www.youtube.com/embed/${links?.youtube_id}`}
				/>
			)}
		</>
	);
};

export default Launch;
