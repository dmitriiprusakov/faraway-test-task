import type { FC } from "react";
import { Avatar, Badge, Button, Card as AntdCard } from "antd";
import dayjs from "dayjs";
import clsx from "clsx";
import { BookOutlined, RocketOutlined, YoutubeOutlined } from "@ant-design/icons";

import css from "./index.module.css";
import { Link } from "react-router-dom";

const renderStatus = (upcoming: boolean | undefined, success: boolean | undefined) => {
	if (upcoming) return <Badge status="processing" text="Upcoming" />;
	if (success) return <Badge status="success" text="Success" />;
	return <Badge status="error" text="Failure" />;
};

type CardProps = {
	name?: string;
	details?: string;
	links?: {
		article: string;
		presskit: string;
		webcast: string;
		patch: {
			small: string;
			large: string;
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
			className={css.card}
			title={name}
			cover={
				links?.patch.large
					? <img
						loading="lazy"
						alt={`Patch of ${name || "not named"} mission`}
						src={links?.patch.large}
						className={css.cardCoverImage}
					/>
					: <div />
			}
			extra={
				<Link to="edit" data-cy="edit-launch-link">
					<Button>Edit</Button>
				</Link>
			}
			actions={[
				<Link
					className={clsx(!links?.article && css.disabledLink)}
					key="spacex"
					target={links?.article ? "_blank" : "_self"}
					to={links?.article || "/"}
				>
					<RocketOutlined />
				</Link>,
				<Link
					className={clsx(!links?.presskit && css.disabledLink)}
					key="reddit"
					target={links?.presskit ? "_blank" : "_self"}
					to={links?.presskit || "/"}
				>
					<BookOutlined />
				</Link>,
				<Link
					className={clsx(!links?.webcast && css.disabledLink)}
					key="youtube"
					target={links?.webcast ? "_blank" : "_self"}
					to={links?.webcast || "/"}
				>
					<YoutubeOutlined />
				</Link>,
			]}
		>
			<AntdCard.Meta
				avatar={<Avatar size="large" shape="square" src={links?.patch.small} />}
				title={
					<div className={css.metaTitle}>
						{dayjs(date_utc).format("YYYY.MM.DD HH:mm:ss [UTC]")}
						{renderStatus(upcoming, success)}
					</div>
				}
				description={details}
			/>
		</AntdCard>
	);
};

export default Card;
