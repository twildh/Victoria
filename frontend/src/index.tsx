/* @refresh reload */
import { render } from "solid-js/web";

import "./globalStyles/root.css";
import "./globalStyles/index.css";

import App from "./App";
import { Router } from "@solidjs/router";

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
