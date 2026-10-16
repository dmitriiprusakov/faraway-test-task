import type { LibraryLaunch } from "../../src/api/types";

const apiUrl = "https://lldev.thespacedevs.com/2.3.0";
const launches: LibraryLaunch[] = [
 {
  id: "launch-1", name: "Falcon 1 | FalconSAT-2", net: "2006-03-24T22:30:00Z",
  status: { id: 4, name: "Launch Failure", abbrev: "Failure" },
  image: { image_url: "https://images.example.test/rocket.jpg", thumbnail_url: "https://images.example.test/thumbnail.jpg" },
  mission_patches: [{ priority: 10, image_url: "https://images.example.test/patch.png" }],
  mission: { description: "First Falcon launch" },
 },
 {
  id: "launch-2", name: "Falcon 9 | CRS-6", net: "2015-04-14T20:10:00Z",
  status: { id: 3, name: "Launch Successful", abbrev: "Success" },
  image: null, mission: { description: "Space station resupply" },
 },
];
const detail: LibraryLaunch = {
 ...launches[0],
 mission_patches: [{ priority: 10, image_url: "https://images.example.test/patch.png" }],
 info_urls: [{ priority: 0, title: "Mission information", url: "https://example.com/mission" }],
 vid_urls: [{ priority: 0, url: "https://youtu.be/0a_00nJ_Y88" }],
};

function response(results = launches, offset = 0) {
 return {
  results, count: results.length ? 20 : 0,
  next: offset < 10 ? apiUrl + "/launches/?offset=10&limit=10" : null,
  previous: offset > 0 ? apiUrl + "/launches/?offset=0&limit=10" : null,
 };
}

function openFilters() {
 cy.get('[data-cy="show-filters-button"]').click();
 cy.get(".ant-drawer-content-wrapper").should(($panel) => {
  expect($panel.attr("class")).not.to.match(/-(appear|enter)(?:-|\s|$)/);
 });
 cy.get('[data-cy="search-input"]').should("be.visible");
}

function submitFilters() {
 cy.get('[data-cy="submit-filters-button"]').click();
}

function selectDate(index: number, date: string) {
 cy.get('[data-cy="date-range-input"] input').eq(index).click();
 cy.get('[data-cy="date-range-input"] input').eq(index).clear().type(date);
 cy.get('.ant-picker-dropdown:visible .ant-picker-cell-in-view[title="' + date + '"]').first().click();
}

function switchLanguage(label: "English" | "Русский") {
 cy.get('[data-cy="language-switcher"] [role="combobox"]').click();
 cy.get(".ant-select-dropdown:visible .ant-select-item-option").contains(label).click();
}

describe("SpaceX launches via Launch Library 2", () => {
 beforeEach(() => {
  cy.intercept("GET", apiUrl + "/launches/?*", req => {
   const params = new URL(req.url).searchParams;
   req.reply(response(params.get("search") ? [launches[1]] : launches, Number(params.get("offset"))));
  }).as("launches");
  cy.intercept("GET", apiUrl + "/launches/launch-1/", detail).as("launch");
  cy.intercept("GET", "https://images.example.test/**", {
   headers: { "content-type": "image/svg+xml" },
   body: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="blue"/></svg>',
  });
  cy.intercept("GET", "https://www.youtube.com/embed/*", "<html><body>Webcast</body></html>");
 });

 it("filters, resets, paginates, and edits a launch locally", () => {
  cy.visit("/");
  cy.wait("@launches").then(({ request }) => {
   const params = new URL(request.url).searchParams;
   expect(params.get("lsp__id")).to.eq("121");
   expect(params.get("limit")).to.eq("10");
   expect(params.get("offset")).to.eq("0");
   expect(params.get("ordering")).to.eq("net");
  });
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
  cy.contains("2006.03.24 22:30:00 UTC").should("be.visible");
  cy.get('[data-cy="launch-link"]').first().find("img")
   .should("have.attr", "src", "https://images.example.test/patch.png")
   .and("have.prop", "naturalWidth").and("be.greaterThan", 0);
  openFilters();
  cy.get('[data-cy="search-input"]').type("CRS-6");
  submitFilters();
  cy.wait("@launches").then(({ request }) => expect(new URL(request.url).searchParams.get("search")).to.eq("CRS-6"));
  cy.get('[data-cy="launch-link"]').should("have.length", 1).and("contain", "CRS-6");
  openFilters();
  cy.get('[data-cy="reset-filters-button"]').click();
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
  cy.get(".ant-pagination-item-2").click();
  cy.wait("@launches").then(({ request }) => expect(new URL(request.url).searchParams.get("offset")).to.eq("10"));
  cy.get('[data-cy="launch-link"]').first().click();
  cy.wait("@launch");
  cy.get('img[src="https://images.example.test/patch.png"]').should("be.visible");
  cy.get('a[href="https://example.com/mission"]').should("exist");
  cy.get('iframe').should("have.attr", "src", "https://www.youtube.com/embed/0a_00nJ_Y88");
  cy.get('[data-cy="edit-launch-link"]').click();
  cy.url().should("include", "/edit");
  cy.get('[data-cy="edit-launch-name-input"]').clear().type("Super Rocket");
  cy.get('[data-cy="edit-launch-name-submit"]').click();
  cy.url().should("not.include", "/edit");
  cy.contains("Super Rocket").should("be.visible");
  cy.get("@launch.all").should("have.length", 1);
 });

 it("changes the page size using limit/offset pagination", () => {
  cy.visit("/");
  cy.wait("@launches");
  cy.get(".ant-pagination-options-size-changer [role=combobox]").click();
  cy.get(".ant-pagination-options-size-changer [role=combobox]").should("have.attr", "aria-expanded", "true");
  cy.get(".ant-select-item-option").contains("25 / page").click();
  cy.wait("@launches").then(({ request }) => {
   const params = new URL(request.url).searchParams;
   expect(params.get("limit")).to.eq("25");
   expect(params.get("offset")).to.eq("0");
  });
 });

 it("filters an inclusive date range", () => {
  cy.visit("/");
  cy.wait("@launches");
  openFilters();
  selectDate(0, "2015-04-14");
  selectDate(1, "2015-04-15");
  submitFilters();
  cy.wait("@launches").then(({ request }) => {
   const params = new URL(request.url).searchParams;
   expect(params.get("net__gte")).to.eq(new Date(2015, 3, 14).toISOString());
   expect(params.get("net__lte")).to.eq(new Date(2015, 3, 15, 23, 59, 59, 999).toISOString());
  });
 });

 it("supports an open-ended date filter", () => {
  cy.visit("/");
  cy.wait("@launches");
  openFilters();
  selectDate(0, "2015-04-14");
  cy.get('[data-cy="date-range-input"] input').last().click();
  cy.get('[data-cy="search-input"]').click();
  submitFilters();
  cy.wait("@launches").then(({ request }) => {
   const params = new URL(request.url).searchParams;
   expect(params.get("net__gte")).to.eq(new Date(2015, 3, 14).toISOString());
   expect(params.has("net__lte")).to.eq(false);
  });
 });

 it("loads the edit route directly and validates the name", () => {
  cy.visit("/launch-1/edit");
  cy.wait("@launch");
  cy.get('[data-cy="edit-launch-name-input"]').should("have.value", "Falcon 1 | FalconSAT-2").clear();
  cy.get('[data-cy="edit-launch-name-submit"]').click();
  cy.contains("Please input name!").should("be.visible");
 });

 it("retries a failed list request", () => {
  cy.intercept({ method: "GET", url: apiUrl + "/launches/?*", times: 1 }, { statusCode: 500, body: {} }).as("failedLaunches");
  cy.visit("/");
  cy.wait("@failedLaunches");
  cy.contains("Something went wrong.").should("be.visible");
  cy.contains("button", "Retry last operation").click();
  cy.wait("@launches");
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
 });

 it("shows an empty state", () => {
  cy.intercept("GET", apiUrl + "/launches/?*", response([]));
  cy.visit("/");
  cy.get(".ant-empty-description").should("contain", "No data").and("be.visible");
 });

 it("handles missing mission data and distinguishes non-final statuses", () => {
  const statuses = [
   { id: 1, name: "Go for Launch", abbrev: "Go" },
   { id: 5, name: "On Hold", abbrev: "Hold" },
   { id: 6, name: "Launch in Flight", abbrev: "In Flight" },
   { id: 7, name: "Launch was a Partial Failure", abbrev: "Partial Failure" },
   { id: 9, name: "Payload Deployed", abbrev: "Deployed" },
   null,
  ];
  cy.intercept("GET", apiUrl + "/launches/?*", response(statuses.map((status, i) => ({
   ...launches[0], id: "status-" + i, name: "Status " + i, status, net: null, image: null, mission: null, mission_patches: [],
  }))));
  cy.visit("/");
  for (const label of ["Upcoming", "On hold", "In flight", "Partial failure", "Payload deployed", "Unknown"]) {
   cy.contains(".ant-badge-status-text", label).should("be.visible");
  }
  cy.get('[data-cy="launch-link"]').first().should("contain", "Date to be determined");
 });

 it("shows a detail with no mission, images, or webcast", () => {
  cy.intercept("GET", apiUrl + "/launches/launch-1/", { ...launches[0], mission: null, image: null, mission_patches: [], net: null, status: null });
  cy.visit("/launch-1");
  cy.contains("Falcon 1 | FalconSAT-2").should("be.visible");
  cy.contains("Date to be determined").should("be.visible");
  cy.get("iframe").should("not.exist");
 });

 it("renders a mission patch without requiring a launch photo", () => {
  cy.intercept("GET", apiUrl + "/launches/?*", response([{ ...launches[0], image: null }, launches[1]]));
  cy.visit("/");
  cy.get('[data-cy="launch-link"]').first().find("img")
   .should("have.attr", "src", "https://images.example.test/patch.png")
   .and("have.prop", "naturalWidth").and("be.greaterThan", 0);
  cy.get('[data-cy="launch-link"]').last().find("img").should("not.exist");
 });

 it("shows the error state on the edit route", () => {
  cy.intercept("GET", apiUrl + "/launches/launch-1/", { statusCode: 500, body: {} });
  cy.visit("/launch-1/edit");
  cy.contains("Something went wrong.").should("be.visible");
 });

 it("explains API throttling", () => {
  cy.intercept("GET", apiUrl + "/launches/?*", { statusCode: 429, body: { detail: "Request was throttled." } });
  cy.visit("/");
  cy.contains("Request limit reached.").should("be.visible");
 });

 it("shows a 404 for an unknown route", () => {
  cy.visit("/missing/route");
  cy.contains("Sorry, the page you visited does not exist.").should("be.visible");
  cy.contains("button", "Back Home").click();
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
 });

 it("switches cached launches between English and Russian without refetching", () => {
  cy.visit("/");
  cy.wait("@launches");
  switchLanguage("Русский");
  cy.get("h1").should("have.text", "Запуски SpaceX");
  cy.get("html").should("have.attr", "lang", "ru");
  cy.title().should("eq", "Запуски SpaceX");
  cy.get('[data-cy="show-filters-button"]').should("have.text", "Фильтры");
  cy.contains(".ant-badge-status-text", "Неудача").should("be.visible");
  cy.contains(".ant-badge-status-text", "Успешно").should("be.visible");
  cy.contains("24.03.2006 22:30:00 UTC").should("be.visible");
  cy.contains("Falcon 1 | FalconSAT-2").should("be.visible");
  cy.window().then(win => expect(win.localStorage.getItem("faraway-language")).to.eq("ru"));
  switchLanguage("English");
  cy.get("h1").should("have.text", "SpaceX Launches");
  cy.get("html").should("have.attr", "lang", "en");
  cy.contains(".ant-badge-status-text", "Failure").should("be.visible");
  cy.get("@launches.all").should("have.length", 1);
 });

 it("remembers Russian and translates validation without losing local edits", () => {
  cy.visit("/");
  switchLanguage("Русский");
  cy.reload();
  cy.get("h1").should("have.text", "Запуски SpaceX");
  cy.get('[data-cy="launch-link"]').first().click();
  cy.wait("@launch");
  cy.get(".ant-card-head-title").should("contain", "Falcon 1 | FalconSAT-2");
  cy.get('[data-cy="edit-launch-link"]').should("contain", "Редактировать");
  cy.get('[data-cy="edit-launch-link"]').click();
  cy.contains("label", "Название").should("be.visible");
  cy.get('[data-cy="edit-launch-name-input"]').clear();
  cy.get('[data-cy="edit-launch-name-submit"]').click();
  cy.contains("Введите название!").should("be.visible");
  switchLanguage("English");
  cy.contains("Please input name!").should("be.visible");
  cy.get('[data-cy="edit-launch-name-input"]').type("Локальное имя");
  switchLanguage("Русский");
  cy.get('[data-cy="edit-launch-name-input"]').should("have.value", "Локальное имя");
  cy.get('[data-cy="edit-launch-name-submit"]').should("contain", "Сохранить").click();
  cy.contains("Локальное имя").should("be.visible");
  cy.get("@launch.all").should("have.length", 1);
 });

 it("localizes Ant Design pagination, filter fields, and calendar", () => {
  cy.visit("/");
  cy.wait("@launches");
  switchLanguage("Русский");
  cy.get(".ant-pagination-options-size-changer").should("contain", "стр");
  openFilters();
  cy.contains("label", "Поиск").should("be.visible");
  cy.contains("label", "Период").should("be.visible");
  cy.get('[data-cy="date-range-input"] input').first()
   .invoke("attr", "placeholder").should("match", /[А-Яа-яЁё]/);
  cy.get('[data-cy="submit-filters-button"]').should("contain", "Применить");
  cy.get('[data-cy="date-range-input"] input').first().click();
  cy.get(".ant-picker-dropdown:visible .ant-picker-month-btn").first()
   .invoke("text").should("match", /[А-Яа-яЁё]/);
 });

 it("translates the empty state and request-limit errors", () => {
  cy.intercept("GET", apiUrl + "/launches/?*", response([]));
  cy.visit("/");
  switchLanguage("Русский");
  cy.get(".ant-empty-description").should("contain", "Нет данных");
  cy.intercept("GET", apiUrl + "/launches/?*", { statusCode: 429, body: {} });
  cy.reload();
  cy.contains("Превышен лимит запросов.").should("be.visible");
  cy.contains("button", "Повторить попытку").should("be.visible");
 });

 it("uses the saved language on a missing-page deep link", () => {
  cy.visit("/missing/route", {
   onBeforeLoad(win) { win.localStorage.setItem("faraway-language", "ru"); },
  });
  cy.contains("К сожалению, такой страницы не существует.").should("be.visible");
  cy.contains("button", "На главную").click();
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
  cy.contains(".ant-badge-status-text", "Неудача").should("be.visible");
 });

 it("falls back to English for an unsupported saved language", () => {
  cy.visit("/", {
   onBeforeLoad(win) { win.localStorage.setItem("faraway-language", "de"); },
  });
  cy.get("html").should("have.attr", "lang", "en");
  cy.get("h1").should("have.text", "SpaceX Launches");
 });

 it("keeps the translated header readable on a narrow screen", () => {
  cy.viewport(390, 844);
  cy.visit("/");
  switchLanguage("Русский");
  cy.get("header h1").should(($title) => {
   expect($title[0].scrollWidth).to.be.at.most($title[0].clientWidth);
  });
  cy.get('[data-cy="language-switcher"]').should("be.visible");
  cy.get('[data-cy="show-filters-button"]').should("be.visible");
 });
});
