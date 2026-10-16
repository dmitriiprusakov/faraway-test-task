import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "store";
import { ErrorBoundary } from "./components";
import { Header, Main } from "./layouts";
import { toggleSidebarVisibility } from "./redux/slice";

import css from "./index.module.css";

const SidebarLazy = lazy(() => import(/* webpackChunkName: "sidebar-lazy" */ "./layouts/sidebar"));

const Core: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [sidebarRequested, setSidebarRequested] = useState(false);

	const showFiltersSidebar = () => {
		setSidebarRequested(true);
		dispatch(toggleSidebarVisibility());
	};

	return (
		<section className={css.layout}>
			<header className={css.header}>
				<Header onShowFilters={showFiltersSidebar} />
			</header>

			<main className={css.main}>
				<Main />
			</main>

			{sidebarRequested && (
				<ErrorBoundary>
					<Suspense fallback={<div className={css.sidebarLoading} role="status">{t("filters.loading")}</div>}>
						<SidebarLazy />
					</Suspense>
				</ErrorBoundary>
			)}
		</section>
	);
};

export default Core;
