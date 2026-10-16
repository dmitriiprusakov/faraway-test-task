import type { FC } from "react";

import { Header, Main, Sidebar } from "./layouts";

import css from "./index.module.css";

const Core: FC = () => {
	return (
		<section className={css.layout}>
			<header className={css.header}>
				<Header />
			</header>
			<main className={css.main}>
				<Main />
			</main>
			<Sidebar />
		</section>
	);
};

export default Core;
