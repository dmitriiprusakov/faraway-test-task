import { Card } from "antd";
import type { FC } from "react";

import { selectPagination } from "core/redux/selectors";
import { useAppSelector } from "store";

import { Pagination } from "./components";

import css from "./index.module.css";

const LaunchesLoading: FC = () => {
	const { pageSize } = useAppSelector(selectPagination);

	return (
		<>
			<div className={css.launches}>
				{Array.from({ length: pageSize }, (_, index) => (
					<Card
						key={index}
						loading
						className={css.cardLoading}
						title={"..."}
						cover={<div />}
					>
						<Card.Meta title={" "} />
					</Card>
				))}
			</div>
			<Pagination disabled pageSize={pageSize} />
		</>
	);
};

export default LaunchesLoading;
