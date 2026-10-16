import type { FC } from "react";
import { Link } from "react-router-dom";
import { Empty } from "antd";

import { useAppSelector } from "store";
import { useGetLaunchesQuery } from "api";
import { selectFilters, selectPagination } from "core/redux/selectors";

import { Card, Pagination } from "./components";
import LaunchesLoading from "./loading";
import LaunchesError from "./error";

import css from "./index.module.css";

const Launches: FC = () => {
	const { page, pageSize } = useAppSelector(selectPagination);

	const { text, datesRange } = useAppSelector(selectFilters);

	const { data, isLoading, isFetching, isError, error, refetch } = useGetLaunchesQuery({
		options: {
			page,
			limit: pageSize,
		},
		query: {
			text,
			datesRange,
		},
	});

	if (isLoading || isFetching) return <LaunchesLoading />;

	if (isError) return <LaunchesError retry={refetch} rateLimited={error && "status" in error && error.status === 429} />;

	if (!data || !data.docs.length) return <Empty />;

	const { docs, page: currentPage, limit, totalDocs } = data;

	return (
		<>
			<div className={css.launches}>
				{docs.map(({ id, name, details, links, date_utc, status }) => (
					<Link key={id} to={id} data-cy="launch-link">
						<Card
							name={name}
							details={details}
							links={links}
							date_utc={date_utc}
							status={status}
						/>
					</Link>
				))}
			</div>
			<Pagination current={currentPage} pageSize={limit} total={totalDocs} />
		</>
	);
};

export default Launches;
