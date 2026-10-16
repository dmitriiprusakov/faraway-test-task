import { useTranslation } from "react-i18next";
import { Button, Result as AntdResult } from "antd";
import type { ResultStatusType } from "antd/es/result";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type ErrorResultProps = {
	status?: ResultStatusType;
	title?: string;
	subTitle?: string;
}
const ErrorResult: FC<ErrorResultProps> = ({ status, title, subTitle }: ErrorResultProps) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleGoHome = () => {
		void navigate("/");
	};

	return (
		<AntdResult
			status={status}
			title={title}
			subTitle={subTitle}
			extra={<Button type="primary" onClick={handleGoHome}>{t("common.backHome")}</Button>}
		/>
	);
};

export default ErrorResult;
