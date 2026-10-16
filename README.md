# TEST TASK

## TASK

Using a third-party API as a data source (for example, the Star Wars API at https://swapi.dev/), build a two-page single-page application (SPA) with React and TypeScript.

The main page should display a list or cards of characters, with pagination.

Implement character search or filtering on the main page, depending on the chosen API.

Create a page with detailed information about the selected character.

Bonus points:

- Clean, polished layout
- Use of a UI framework such as Material UI, Ant Design, or Bootstrap

Additional requirements:

- Use Redux for data management
- Allow character information to be edited locally, without sending changes to the server
- Include tests

---

## SOLUTION

### Development

Use Node.js 24.22.0 (see `.nvmrc`) and pnpm 12.14.0. The build tooling requires
Node.js `^22.18.0 || >=24.11.0`.

```sh
corepack enable
corepack prepare pnpm@12.14.0 --activate
pnpm install --frozen-lockfile
pnpm start
```

The development server runs at http://localhost:8080 and supports direct navigation
to launch and edit routes.

```sh
pnpm lint       # Check application, test, and build configuration code
pnpm typecheck  # Check application and Cypress types separately
pnpm build      # Type-check and build dist/ for /faraway-test-task/
pnpm analyze    # Build and write dist/report.html
pnpm cy:run     # Run end-to-end tests with the development server running
pnpm cy         # Open the interactive Cypress runner
pnpm deploy     # Build and publish dist/ to GitHub Pages
```

The application uses React 19, Ant Design 6, Redux Toolkit 2, React Router 7,
Webpack 5, ESLint 10, and Cypress 16. All build loaders and plugins are declared
explicitly; the unused Create React App and Jest packages have been removed.
Cypress tests stub API responses and cover filtering, pagination, local editing,
validation, loading routes directly, empty/error states, retry, and missing pages.

Type checking runs on TypeScript 7. The `typescript` dependency aliases the official
TypeScript 6 compatibility package because ESLint still requires the JavaScript
compiler API. `@typescript/native` aliases TypeScript 7 and provides `tsc`, following
the [official side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

As of October 16, 2026, `pnpm audit --prod` reports no known vulnerabilities.
The full audit reports one unpatched development-tooling advisory for `braces`
([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)).
Production builds succeed with Webpack warnings about the initial bundle size
and runtime chunk placement.

### Launch data

The application now uses [TheSpaceDevs Launch Library 2](https://thespacedevs.com/llapi)
v2.3.0. The existing SpaceX focus is preserved with `lsp__id=121`; launches remain
ordered by launch date. The API adapter maps `results`/`count` and limit/offset
pagination to the existing list UI, translates search and inclusive date filters,
and normalizes mission descriptions, images, patches, information links, videos,
and launch statuses. Missing mission/media/date fields are supported. Name edits
remain local to the Redux query cache; no changes are sent to the API.

Development builds use `https://lldev.thespacedevs.com/2.3.0/`, the provider's
recommended test endpoint with limited, stale data. Production builds use
`https://ll.thespacedevs.com/2.3.0/` for current data. The public production API
allows 15 requests per hour. Unused list/detail responses are retained for one
hour during the browser session, and HTTP 429 responses show a request-limit
message. Reloading the app clears this in-memory cache.

Cypress tests use Launch Library-shaped fixtures to verify pagination, search,
date ranges (including a missing bound), media mapping, local editing, statuses,
missing fields, rate limits, and error handling without consuming the public quota.

### Original implementation

Hello!

For this task, I used the latest versions of TypeScript, React, React Router, and Redux Toolkit with RTK Query, along with CSS Modules for styling. Webpack and ESLint round out the setup.

I chose the [SpaceX API](https://github.com/r-spacex/SpaceX-API) as the data source and Ant Design for the UI.

This was my first time using RTK Query, and I really enjoyed it. Previously, I used custom solutions built on Axios, or SWR for Next.js.

The demo is deployed on [GitHub Pages](https://dmitrytevtonsky.github.io/faraway-test-task/).

I aimed to create a clear, easy-to-navigate file structure:

- `/api` contains the API slice configuration and types describing requests and responses.
- `/core` contains shared application components and a slice, as well as the routing configuration.
- `/features` contains individual features, such as the launch list page and the launch details page.
- `/store` contains the application-wide Redux setup.

I frequently use code splitting. For example, routes are lazy-loaded and wrapped in ErrorBoundary and Suspense. I implemented error, loading, and empty states, used semantic HTML elements, and split the code into small components.

For this project, I chose to include only end-to-end tests using Cypress, as there was limited time for other types of tests. I also have experience writing unit tests with Jest, component tests, and Redux store tests.

Static assets, bundles, and chunks are built and minified with Webpack.
