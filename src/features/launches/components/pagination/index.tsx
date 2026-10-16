import { setPagination } from "core/redux/slice";
import type { FC } from "react";
import { useAppDispatch } from "store";
import { Pagination as AntdPagination } from "antd";

import css from "./index.module.css";

type PaginationProps = {
	current?: number;
	pageSize?: number;
	total?: number;
	disabled?: boolean;
}
const Pagination: FC<PaginationProps> = ({
	current,
	pageSize,
	total,
	disabled,
}: PaginationProps) => {
	const dispatch = useAppDispatch();

	const handleChange = (page: number, pageSize: number) => {
		dispatch(setPagination({ page, pageSize }));
	};

	return (
		<div className={css.paginationLayout}>
			<AntdPagination
				disabled={disabled}
				current={current}
				defaultCurrent={1}
				pageSize={pageSize}
				defaultPageSize={10}
				total={total}
				showSizeChanger
				pageSizeOptions={[10, 25, 50]}
				onChange={handleChange}
				className={css.pagination}
			/>
		</div>
	);
};

export default Pagination;
