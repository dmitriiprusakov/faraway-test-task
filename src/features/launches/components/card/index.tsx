import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { Badge, Card as AntdCard, Typography } from "antd";
import type { Launch } from "api/types";
import { formatLaunchDate } from "core/format-launch-date";

import css from "./index.module.css";

const { Text } = Typography;

type CardProps = Partial<Pick<Launch, "name" | "details" | "links" | "date_utc" | "status">> & {
	loading?: boolean;
};
const Card: FC<CardProps> = ({ name, details, links, date_utc, status, loading }: CardProps) => {
	const { t } = useTranslation();
	return (
		<AntdCard
			loading={loading}
			title={name}
			className={css.card}
			hoverable
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
		>
			<article className={css.article}>
				<h3 className={css.heading}>
					<Text type="secondary">
						{formatLaunchDate(date_utc, t)}
					</Text>
					<Badge status={status?.tone ?? "default"} text={t(`status.${status?.key ?? "unknown"}`)} />
				</h3>
				<p className={css.details}>
					{details}
				</p>
			</article>
		</AntdCard>
	);
};

export default Card;
