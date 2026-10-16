import { Button, Empty, Form, Input } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { apiSlice, useGetLaunchQuery } from "api";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "store";
import type { RouterParams } from "types";

import css from "./index.module.css";
import LaunchError from "../error";
import LaunchLoading from "../loading";

type FormValues = {
	name: string;
}

const LaunchEdit: FC = () => {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const { launchId } = useParams<RouterParams>();

	const { data, isLoading, isFetching, isError, error, refetch } = useGetLaunchQuery(launchId ?? skipToken);

	if (!launchId) return null;

	if (isLoading || isFetching) return <LaunchLoading />;

	if (isError) return <LaunchError retry={refetch} rateLimited={error && "status" in error && error.status === 429} />;

	if (!data) return <Empty />;

	const { name } = data;

	const handleFinish = ({ name }: FormValues) => {
		dispatch(
			apiSlice.util.updateQueryData("getLaunch", launchId, (draft) => {
				Object.assign(draft, { name });
			})
		);

		void navigate(`/${launchId}`);
	};

	return (
		<div className={css.launchEdit}>
			<Form
				initialValues={{ name }}
				layout="vertical"
				onFinish={handleFinish}
				autoComplete="off"
			>
				<Form.Item
					label="Name"
					name="name"
					rules={[{ required: true, message: "Please input name!" }]}
				>
					<Input data-cy="edit-launch-name-input" />
				</Form.Item>

				<Form.Item >
					<Button type="primary" htmlType="submit" data-cy="edit-launch-name-submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LaunchEdit;
