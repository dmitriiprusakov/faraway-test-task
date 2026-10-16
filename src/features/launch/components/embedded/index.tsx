import type { FC } from "react";

import css from "./index.module.css";

type EmbeddedProps = {
	title: string;
	link: string;
}
const Embedded: FC<EmbeddedProps> = ({ title, link }: EmbeddedProps) => {
	return (
		<iframe
			loading="lazy"
			src={link}
			title={title}
			className={css.iFrame}
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
		/>
	);
};

export default Embedded;
