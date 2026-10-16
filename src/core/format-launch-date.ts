import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { TFunction } from "i18next";

dayjs.extend(utc);

export function formatLaunchDate(value: string | undefined, t: TFunction): string {
	return value && dayjs(value).isValid()
		? dayjs.utc(value).format(t("launch.dateFormat"))
		: t("launch.dateTbd");
}
