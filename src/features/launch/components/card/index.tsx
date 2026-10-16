import type { FC } from "react";
import { Avatar, Badge, Button, Card as AntdCard } from "antd";
import type { Launch } from "api/types";
import { formatLaunchDate } from "core/format-launch-date";
import clsx from "clsx";
import { BookOutlined, RocketOutlined, YoutubeOutlined } from "@ant-design/icons";

import css from "./index.module.css";
import { Link } from "react-router-dom";

type CardProps = Partial<Pick<Launch, "name" | "details" | "links" | "date_utc" | "status">> & {
	loading?: boolean;
};
const Card: FC<CardProps> = ({ name, details, links, date_utc, status, loading }: CardProps) => {
	return (
		<AntdCard
			loading={loading}
			className={css.card}
			title={name}
			cover={
				links?.patch
					? <img
						loading="lazy"
						alt={`Image of ${name || "not named"} mission`}
						src={links?.patch}
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
				avatar={<Avatar size="large" shape="square" src={links?.patch} />}
				title={
					<div className={css.metaTitle}>
						{formatLaunchDate(date_utc)}
						<Badge status={status?.tone ?? "default"} text={status?.label ?? "Unknown"} />
					</div>
				}
				description={details}
			/>
		</AntdCard>
	);
};

export default Card;
