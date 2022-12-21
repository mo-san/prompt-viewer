/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./App";
import "./index.scss";

render(() => <App />, document.querySelector("#root") as HTMLElement);
