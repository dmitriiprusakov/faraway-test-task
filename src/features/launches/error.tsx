import { Button, Result } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type LaunchesErrorProps = {
	retry: () => Promise<unknown>;
}
const LaunchesError: FC<LaunchesErrorProps> = ({ retry }: LaunchesErrorProps) => {
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
			title="Something went wrong."
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
