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
