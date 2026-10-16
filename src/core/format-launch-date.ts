import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function formatLaunchDate(value?: string): string {
	return value && dayjs(value).isValid()
		? dayjs.utc(value).format("YYYY.MM.DD HH:mm:ss [UTC]")
		: "Date to be determined";
}
