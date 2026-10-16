import type { FC } from "react";
import { Card } from "./components";

const LaunchLoading: FC = () => {
	return (
		<Card
			loading={true}
			name="..."
			details="..."
		/>
	);
};

export default LaunchLoading;
