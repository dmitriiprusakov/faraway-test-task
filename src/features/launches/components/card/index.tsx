import type { FC } from "react";
import { Badge, Card as AntdCard, Typography } from "antd";
import dayjs from "dayjs";

import css from "./index.module.css";

const { Text } = Typography;

const renderStatus = (upcoming: boolean | undefined, success: boolean | undefined) => {
	if (upcoming) return <Badge status="processing" text="Upcoming" />;
	if (success) return <Badge status="success" text="Success" />;
	return <Badge status="error" text="Failure" />;
};

type CardProps = {
	name?: string;
	details?: string;
	links?: {
		patch: {
			small: string;
		}
	};
	date_utc?: string;
	success?: boolean;
	upcoming?: boolean;
	loading?: boolean;
}
const Card: FC<CardProps> = ({ name, details, links, date_utc, success, upcoming, loading }: CardProps) => {
	return (
		<AntdCard
			loading={loading}
			title={name}
			className={css.card}
			hoverable
			cover={
				links?.patch.small
					? <img
						loading="lazy"
						alt={`Patch of ${name || "not named"} mission`}
						src={links?.patch.small}
						className={css.cardCoverImage}
					/>
					: <div />
			}
		>
			<article className={css.article}>
				<h3 className={css.heading}>
					<Text type="secondary">
						{dayjs(date_utc).format("YYYY.MM.DD HH:mm:ss [UTC]")}
					</Text>
					{renderStatus(upcoming, success)}
				</h3>
				<p className={css.details}>
					{details}
				</p>
			</article>
		</AntdCard>
	);
};

export default Card;
