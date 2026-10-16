import { useTranslation } from "react-i18next";
import { Button, DatePicker, Drawer, Form, Input } from "antd";
import type { FC } from "react";
import { useMemo } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { selectFilters, selectSidebarVisibility } from "core/redux/selectors";
import { resetFilters, setFilters, toggleSidebarVisibility } from "core/redux/slice";
import { useAppDispatch, useAppSelector } from "store";

import css from "./index.module.css";

const { RangePicker } = DatePicker;

type FiltersFormValues = {
	text?: string;
	datesRange?: [Dayjs | null, Dayjs | null];
}

const Sidebar: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const sidebarVisibility = useAppSelector(selectSidebarVisibility);

	const filters = useAppSelector(selectFilters);

	const handleFinish = ({ text, datesRange }: FiltersFormValues) => {
		dispatch(setFilters({
			text,
			datesRange: datesRange
				? [datesRange[0]?.startOf("day").toISOString(), datesRange[1]?.endOf("day").toISOString()]
				: undefined,
		}));

		dispatch(toggleSidebarVisibility());
	};

	const handleReset = () => {
		dispatch(resetFilters());

		dispatch(toggleSidebarVisibility());
	};

	const handleClose = () => {
		dispatch(toggleSidebarVisibility());
	};

	const fields = useMemo(() => filters ? [
		{ name: ["text"], value: filters.text },
		{ name: ["datesRange"], value: filters.datesRange?.map(value => value ? dayjs(value) : null) },
	] : undefined, [filters]);

	return (
		<Drawer
			title={t("filters.title")}
			onClose={handleClose}
			open={sidebarVisibility}
			rootClassName={css.drawerRoot}
			extra={
				<>
					<Button className={css.button} onClick={handleClose}>
						{t("common.cancel")}
					</Button>
					<Button className={css.button} form="filters" type="primary" htmlType="submit">
						{t("filters.submit")}
					</Button>
				</>
			}
		>
			<Form
				id="filters"
				layout="vertical"
				onFinish={handleFinish}
				fields={fields}
			>
				<Form.Item label={t("filters.search")} name="text">
					<Input data-cy="search-input" />
				</Form.Item>
				<Form.Item label={t("filters.dateRange")} name="datesRange" data-cy="date-range-input">
					<RangePicker allowEmpty={[true, true]} className={css.rangePicker} />
				</Form.Item>
				<Form.Item>
					<Button
						className={css.button}
						form="filters"
						type="primary"
						htmlType="submit"
						data-cy="submit-filters-button"
					>
						{t("filters.submit")}
					</Button>
					<Button
						className={css.button}
						htmlType="button"
						onClick={handleReset}
						data-cy="reset-filters-button"
					>
						{t("common.reset")}
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
};

export default Sidebar;
