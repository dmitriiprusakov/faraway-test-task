import type { FC } from "react";
import { Carousel } from "antd";

import css from "./index.module.css";

type PhotosProps = {
	links?: string[];
}
const Photos: FC<PhotosProps> = ({ links }: PhotosProps) => {
	return (
		<Carousel className={css.carousel} effect="fade">
			{links?.map((link, index) => (
				<img
					key={`${link}-${index}`}
					src={link}
					loading="lazy"
					className={css.carouselImg}
				/>
			))}
		</Carousel>
	);
};

export default Photos;
