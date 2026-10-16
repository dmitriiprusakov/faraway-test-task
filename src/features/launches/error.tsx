import { useTranslation } from "react-i18next";
import { Button, Result } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type LaunchesErrorProps = {
	retry: () => Promise<unknown>;
	rateLimited?: boolean;
}
const LaunchesError: FC<LaunchesErrorProps> = ({ retry, rateLimited }: LaunchesErrorProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleRetry = () => {
		void retry();
	};

	const handleGoHome = () => {
		void navigate("/");
	};

	return (
		<Result
			status="warning"
			title={t(rateLimited ? "error.rateLimit" : "error.generic")}
			subTitle={rateLimited ? t("error.rateLimitDescription") : undefined}
			extra={[
				<Button
					key="console"
					type="primary"
					onClick={handleRetry}
				>
					{t("common.retry")}
				</Button>,
				<Button
					key="home"
					onClick={handleGoHome}
				>
					{t("common.goHome")}
				</Button>,
			]}
		/>
	);
};

export default LaunchesError;
