export const en = {
	app: {
		title: "SpaceX Launches",
		language: "Language",
	},
	common: {
		submit: "Submit",
		cancel: "Cancel",
		reset: "Reset",
		edit: "Edit",
		backHome: "Back Home",
		goHome: "Go home",
		retry: "Retry last operation",
	},
	filters: {
		title: "Filters",
		submit: "Submit",
		search: "Search",
		dateRange: "Date range",
	},
	launch: {
		name: "Name",
		nameRequired: "Please input name!",
		unnamed: "unnamed",
		imageAlt: "Image of {{name}} mission",
		photoAlt: "Launch photo {{number}}",
		webcastTitle: "Webcast of {{name}}",
		dateTbd: "Date to be determined",
		dateFormat: "YYYY.MM.DD HH:mm:ss [UTC]",
		article: "Mission information",
		presskit: "Press kit",
		webcast: "Webcast",
	},
	error: {
		generic: "Something went wrong.",
		rateLimit: "Request limit reached.",
		rateLimitDescription: "Launch Library's request limit has been reached. Please try again later.",
		notFound: "Sorry, the page you visited does not exist.",
	},
	status: {
		upcoming: "Upcoming",
		success: "Success",
		failure: "Failure",
		hold: "On hold",
		inFlight: "In flight",
		partialFailure: "Partial failure",
		payloadDeployed: "Payload deployed",
		unknown: "Unknown",
	},
} as const;

type Translation = {
	[Section in keyof typeof en]: { [Key in keyof (typeof en)[Section]]: string };
};

export const ru = {
	app: {
		title: "Запуски SpaceX",
		language: "Язык",
	},
	common: {
		submit: "Сохранить",
		cancel: "Отмена",
		reset: "Сбросить",
		edit: "Редактировать",
		backHome: "На главную",
		goHome: "На главную",
		retry: "Повторить попытку",
	},
	filters: {
		title: "Фильтры",
		submit: "Применить",
		search: "Поиск",
		dateRange: "Период",
	},
	launch: {
		name: "Название",
		nameRequired: "Введите название!",
		unnamed: "без названия",
		imageAlt: "Изображение миссии «{{name}}»",
		photoAlt: "Фотография запуска {{number}}",
		webcastTitle: "Трансляция миссии «{{name}}»",
		dateTbd: "Дата уточняется",
		dateFormat: "DD.MM.YYYY HH:mm:ss [UTC]",
		article: "Информация о миссии",
		presskit: "Материалы для прессы",
		webcast: "Трансляция",
	},
	error: {
		generic: "Что-то пошло не так.",
		rateLimit: "Превышен лимит запросов.",
		rateLimitDescription: "Превышен лимит запросов к Launch Library. Попробуйте позже.",
		notFound: "К сожалению, такой страницы не существует.",
	},
	status: {
		upcoming: "Ожидается",
		success: "Успешно",
		failure: "Неудача",
		hold: "Приостановлен",
		inFlight: "В полёте",
		partialFailure: "Частичная неудача",
		payloadDeployed: "Полезная нагрузка выведена",
		unknown: "Неизвестно",
	},
} satisfies Translation;
