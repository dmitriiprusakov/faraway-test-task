const path = require("node:path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = function (env = {}, { mode = "development" } = {}) {
	const production = mode === "production";
	const publicPath = production ? "/faraway-test-task/" : "/";

	return {
		mode,
		devtool: "source-map",
		entry: "./src/index.tsx",
		devServer: { port: 8080, historyApiFallback: true },
		output: {
			path: path.resolve(__dirname, "dist"),
			clean: true,
			publicPath,
			filename: production ? "js/[name].[contenthash].js" : "js/[name].js",
			chunkFilename: "js/chunks/[name].[contenthash].js",
		},
		resolve: {
			modules: [path.resolve(__dirname, "src"), "node_modules"],
			extensions: [".ts", ".tsx", ".js", ".jsx"],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					options: {
						presets: [
							["@babel/preset-react", { runtime: "automatic", development: !production }],
							"@babel/preset-typescript",
						],
					},
				},
				{
					test: /\.css$/i,
					use: [
						production ? MiniCssExtractPlugin.loader : "style-loader",
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
								modules: {
									auto: /\.module\.css$/i,
									namedExport: false,
									localIdentName: production ? "[local]-[hash:base64:5]" : "[path]__[local]--[hash:base64:5]",
								},
							},
						},
					],
				},
			],
		},
		plugins: [
			new ESLintPlugin({ extensions: ["ts", "tsx"], context: "src" }),
			new HtmlWebpackPlugin({ template: "./public/index.html", favicon: "./public/favicon.ico", publicPath }),
			...(production ? [new MiniCssExtractPlugin({ filename: "css/[name].[contenthash].css", chunkFilename: "css/chunks/[name].[contenthash].css" })] : []),
			...(env.analyze ? [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false })] : []),
		],
	};
};
