declare module "antd/dist/reset.css";

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
