import { Translation } from "react-i18next";
import type { ErrorInfo } from "react";
import React from "react";

import css from "./index.module.css";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	showComponentStack?: boolean;
}

interface ErrorBoundaryState {
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div className={css.layout}>
					<h3><Translation>{t => t("error.generic")}</Translation></h3>
					<details>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.props.showComponentStack && this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}
