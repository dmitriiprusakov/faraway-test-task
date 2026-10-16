import { Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

import { useAppDispatch } from "store";
import { toggleSidebarVisibility } from "core/redux/slice";

import css from "./index.module.css";

const Header: FC = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();

	const showFiltersSidebar = () => {
		dispatch(toggleSidebarVisibility());
	};

	return (
		<div className={css.content}>
			<Link to="/" className={css.title}>
				<h1>{t("app.title")}</h1>
			</Link>

			<div className={css.controls}>
				<Select
					data-cy="language-switcher"
					aria-label={t("app.language")}
					className={css.language}
					value={i18n.resolvedLanguage === "ru" ? "ru" : "en"}
					onChange={language => { void i18n.changeLanguage(language); }}
					options={[
						{ value: "en", label: "English" },
						{ value: "ru", label: "Русский" },
					]}
				/>
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
									{t("filters.title")}
								</Button>
							}
						/>
						<Route path="*" element={null} />
					</Route>
				</Routes>
			</div>
		</div>
	);
};

export default Header;
