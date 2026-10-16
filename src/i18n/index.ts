import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { en, ru } from "./resources";

export const languageStorageKey = "faraway-language";

function savedLanguage(): "en" | "ru" {
	try {
		return localStorage.getItem(languageStorageKey) === "ru" ? "ru" : "en";
	} catch {
		return "en";
	}
}

i18n.on("languageChanged", (language: string) => {
	const locale = language === "ru" ? "ru" : "en";
	dayjs.locale(locale);
	document.documentElement.lang = locale;
	document.title = i18n.t("app.title");
	try {
		localStorage.setItem(languageStorageKey, locale);
	} catch {
		// Language switching remains available when browser storage is blocked.
	}
});

void i18n.use(initReactI18next).init({
	resources: { en: { translation: en }, ru: { translation: ru } },
	lng: savedLanguage(),
	fallbackLng: "en",
	supportedLngs: ["en", "ru"],
	initAsync: false,
	interpolation: { escapeValue: false },
});

export default i18n;
