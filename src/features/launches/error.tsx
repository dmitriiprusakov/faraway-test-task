import { Button, Result } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type LaunchesErrorProps = {
	retry: () => Promise<unknown>;
	rateLimited?: boolean;
}
const LaunchesError: FC<LaunchesErrorProps> = ({ retry, rateLimited }: LaunchesErrorProps) => {
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
			title={rateLimited ? "Request limit reached." : "Something went wrong."}
			subTitle={rateLimited ? "Launch Library's request limit has been reached. Please try again later." : undefined}
			extra={[
				<Button
					key="console"
					type="primary"
					onClick={handleRetry}
				>
					Retry last operation
				</Button>,
				<Button
					key="home"
					onClick={handleGoHome}
				>
					Go home
				</Button>,
			]}
		/>
	);
};

export default LaunchesError;
