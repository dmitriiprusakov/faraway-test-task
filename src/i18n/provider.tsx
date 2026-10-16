import type { PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import ruRU from "antd/locale/ru_RU";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./index";

function ComponentLocale({ children }: PropsWithChildren) {
	const { i18n } = useTranslation();
	return <ConfigProvider locale={i18n.resolvedLanguage === "ru" ? ruRU : enUS}>{children}</ConfigProvider>;
}

export default function LocalizationProvider({ children }: PropsWithChildren) {
	return (
		<I18nextProvider i18n={i18n}>
			<ComponentLocale>{children}</ComponentLocale>
		</I18nextProvider>
	);
}
