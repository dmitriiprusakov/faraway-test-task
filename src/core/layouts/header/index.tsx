import { Button } from "antd";
import type { FC } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

import { useAppDispatch } from "store";
import { toggleSidebarVisibility } from "core/redux/slice";

import css from "./index.module.css";

const Header: FC = () => {
	const dispatch = useAppDispatch();

	const showFiltersSidebar = () => {
		dispatch(toggleSidebarVisibility());
	};

	return (
		<div className={css.content}>
			<Link to="/" className={css.title}>
				<h1>SpaceX Launches</h1>
			</Link>

			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route
						index
						element={
							<Button
								type="primary"
								onClick={showFiltersSidebar}
								data-cy="show-filters-button"
							>
								Filters
							</Button>
						}
					/>
					<Route path="*" element={null} />
				</Route>
			</Routes>
		</div>
	);
};

export default Header;
