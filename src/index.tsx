import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "antd/dist/reset.css";

import store from "store";
import Core from "core";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element detected!");

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<Suspense fallback={null}>
			<Provider store={store}>
				<BrowserRouter
					basename={
						process.env.NODE_ENV === "production"
							? "/faraway-test-task"
							: "/"
					}
				>
					<Core />
				</BrowserRouter>
			</Provider>
		</Suspense>
	</StrictMode>
);
