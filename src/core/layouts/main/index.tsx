import type { FC } from "react";
import { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { ErrorBoundary, ErrorResult } from "core/components";

import css from "./index.module.css";

const LaunchesLazy = lazy(() => import(/* webpackChunkName: "launches-lazy"  */ "features/launches"));

const LaunchLazy = lazy(() => import(/* webpackChunkName: "launch-lazy"  */ "features/launch"));

const LaunchEditLazy = lazy(() => import(/* webpackChunkName: "launch-edit-lazy"  */ "features/launch/edit"));

const Main: FC = () => {
	return (
		<div className={css.content}>
			<Routes>
				<Route
					path="/"
					element={<Outlet />}
				>
					<Route
						index
						element={
							<ErrorBoundary showComponentStack>
								<Suspense fallback={null}>
									<LaunchesLazy />
								</Suspense>
							</ErrorBoundary>
						}
					/>
					<Route
						path=":launchId"
						element={
							<ErrorBoundary showComponentStack>
								<Suspense fallback={null}>
									<LaunchLazy />
								</Suspense>
							</ErrorBoundary>

						}
					/>
					<Route
						path=":launchId/edit"
						element={
							<ErrorBoundary showComponentStack>
								<Suspense fallback={null}>
									<LaunchEditLazy />
								</Suspense>
							</ErrorBoundary>
						}
					/>
					<Route
						path="*"
						element={
							<ErrorResult
								status="404"
								title="404"
								subTitle="Sorry, the page you visited does not exist."
							/>
						}
					/>
				</Route>
			</Routes>
		</div>
	);
};

export default Main;
