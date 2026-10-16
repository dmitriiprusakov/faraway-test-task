const apiUrl = "https://api.spacexdata.com/v5";
const launches = [
 { id: "launch-1", name: "FalconSat", details: "First Falcon launch", date_utc: "2006-03-24T22:30:00.000Z", success: false, upcoming: false },
 { id: "launch-2", name: "CRS-6", details: "Space station resupply", date_utc: "2015-04-14T20:10:00.000Z", success: true, upcoming: false },
];

function response(docs = launches, page = 1) {
 return { docs, totalDocs: 20, offset: (page - 1) * 10, limit: 10, totalPages: 2, page, pagingCounter: 1, hasPrevPage: page > 1, hasNextPage: page < 2, prevPage: page > 1 ? 1 : null, nextPage: page < 2 ? 2 : null };
}

describe("SpaceX launches", () => {
 beforeEach(() => {
  cy.intercept("POST", apiUrl + "/launches/query", req => {
   const { query, options } = req.body as { query: { $text?: { $search: string } }; options: { page: number } };
   req.reply(response(query.$text ? [launches[1]] : launches, options.page));
  }).as("launches");
  cy.intercept("GET", apiUrl + "/launches/launch-1", launches[0]).as("launch");
 });

 it("filters, resets, paginates, and edits a launch locally", () => {
  cy.visit("/");
  cy.wait("@launches");
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
  cy.get('[data-cy="show-filters-button"]').click();
  cy.get('[data-cy="search-input"]').type("CRS-6");
  cy.get('[data-cy="submit-filters-button"]').click();
  cy.wait("@launches").its("request.body.query.$text.$search").should("eq", "CRS-6");
  cy.get('[data-cy="launch-link"]').should("have.length", 1).and("contain", "CRS-6");
  cy.get('[data-cy="show-filters-button"]').click();
  cy.get('[data-cy="reset-filters-button"]').click();
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
  cy.get('.ant-pagination-item-2').click();
  cy.wait("@launches").its("request.body.options.page").should("eq", 2);
  cy.get('[data-cy="launch-link"]').first().click();
  cy.wait("@launch");
  cy.get('[data-cy="edit-launch-link"]').click();
  cy.url().should("include", "/edit");
  cy.get('[data-cy="edit-launch-name-input"]').clear().type("Super Rocket");
  cy.get('[data-cy="edit-launch-name-submit"]').click();
  cy.url().should("not.include", "/edit");
  cy.contains("Super Rocket").should("be.visible");
  cy.get("@launch.all").should("have.length", 1);
 });

 it("loads the edit route directly and validates the name", () => {
  cy.visit("/launch-1/edit");
  cy.wait("@launch");
  cy.get('[data-cy="edit-launch-name-input"]').should("have.value", "FalconSat").clear();
  cy.get('[data-cy="edit-launch-name-submit"]').click();
  cy.contains("Please input name!").should("be.visible");
 });

 it("retries a failed list request", () => {
  cy.intercept({ method: "POST", url: apiUrl + "/launches/query", times: 1 }, { statusCode: 500, body: {} }).as("failedLaunches");
  cy.visit("/");
  cy.wait("@failedLaunches");
  cy.contains("Something went wrong.").should("be.visible");
  cy.contains("button", "Retry last operation").click();
  cy.wait("@launches");
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
 });

 it("shows an empty state", () => {
  cy.intercept("POST", apiUrl + "/launches/query", response([]));
  cy.visit("/");
  cy.get(".ant-empty-description").should("contain", "No data").and("be.visible");
 });

 it("shows the error state on the edit route", () => {
  cy.intercept("GET", apiUrl + "/launches/launch-1", { statusCode: 500, body: {} });
  cy.visit("/launch-1/edit");
  cy.contains("Something went wrong.").should("be.visible");
 });

 it("shows a 404 for an unknown route", () => {
  cy.visit("/missing/route");
  cy.contains("Sorry, the page you visited does not exist.").should("be.visible");
  cy.contains("button", "Back Home").click();
  cy.get('[data-cy="launch-link"]').should("have.length", 2);
 });
});
