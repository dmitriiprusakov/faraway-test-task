import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	return (
		<AntdCard
			loading={loading}
			className={css.card}
			title={name}
			cover={
				links?.patch
					? <img
						loading="lazy"
						alt={t("launch.imageAlt", { name: name || t("launch.unnamed") })}
						src={links?.patch}
						className={css.cardCoverImage}
					/>
					: <div />
			}
			extra={
				<Link to="edit" data-cy="edit-launch-link">
					<Button>{t("common.edit")}</Button>
				</Link>
			}
			actions={[
				<Link
					className={clsx(!links?.article && css.disabledLink)}
					key="spacex"
					aria-label={t("launch.article")}
					target={links?.article ? "_blank" : "_self"}
					to={links?.article || "/"}
				>
					<RocketOutlined />
				</Link>,
				<Link
					className={clsx(!links?.presskit && css.disabledLink)}
					key="reddit"
					aria-label={t("launch.presskit")}
					target={links?.presskit ? "_blank" : "_self"}
					to={links?.presskit || "/"}
				>
					<BookOutlined />
				</Link>,
				<Link
					className={clsx(!links?.webcast && css.disabledLink)}
					key="youtube"
					aria-label={t("launch.webcast")}
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
						{formatLaunchDate(date_utc, t)}
						<Badge status={status?.tone ?? "default"} text={t(`status.${status?.key ?? "unknown"}`)} />
					</div>
				}
				description={details}
			/>
		</AntdCard>
	);
};

export default Card;
