import type { LibraryLaunch } from "../../src/api/types";

const apiUrl = "https://lldev.thespacedevs.com/2.3.0";
const launches: LibraryLaunch[] = [
 {
  id: "launch-1", name: "Falcon 1 | FalconSAT-2", net: "2006-03-24T22:30:00Z",
  status: { id: 4, name: "Launch Failure", abbrev: "Failure" },
  image: { image_url: "https://images.example.test/rocket.jpg", thumbnail_url: "https://images.example.test/thumbnail.jpg" },
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
}

function submitFilters() {
 cy.get('[data-cy="submit-filters-button"]').click();
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
  cy.get('[data-cy="launch-link"]').first().find("img").should("have.attr", "src", "https://images.example.test/thumbnail.jpg");
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
  cy.get(".ant-pagination-options-size-changer").click();
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
  cy.get('[data-cy="date-range-input"] input').first().type("2015-04-14{enter}");
  cy.get('[data-cy="date-range-input"] input').last().type("2015-04-15{enter}");
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
  cy.get('[data-cy="date-range-input"] input').first().type("2015-04-14");
  cy.get('.ant-picker-cell[title="2015-04-14"]').first().click();
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
   ...launches[0], id: "status-" + i, name: "Status " + i, status, net: null, image: null, mission: null,
  }))));
  cy.visit("/");
  for (const label of ["Upcoming", "On hold", "In flight", "Partial failure", "Payload deployed", "Unknown"]) {
   cy.contains(".ant-badge-status-text", label).should("be.visible");
  }
  cy.get('[data-cy="launch-link"]').first().should("contain", "Date to be determined");
 });

 it("shows a detail with no mission, images, or webcast", () => {
  cy.intercept("GET", apiUrl + "/launches/launch-1/", { ...launches[0], mission: null, image: null, net: null, status: null });
  cy.visit("/launch-1");
  cy.contains("Falcon 1 | FalconSAT-2").should("be.visible");
  cy.contains("Date to be determined").should("be.visible");
  cy.get("iframe").should("not.exist");
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
});
