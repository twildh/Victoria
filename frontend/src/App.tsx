import { A, Navigate, Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";

import styles from "./App.module.scss";
import { Home } from "./routes/Home";
import { SecretDetails } from "./routes/secrets/SecretDetails";
import { Untouched } from "./routes/secrets/Untouched";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header>
        <A href={"/"}>Victoria</A>
      </header>
      <main>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/:unknown" element={<Navigate href={"/"} />} />
          <Route path="/untouched/:secretId" component={Untouched} />
          <Route path="/secrets/:secretId" component={SecretDetails} />
          <Route
            path="/about"
            element={<div>Technologies used: Typescript (Solid), Golang</div>}
          />
        </Routes>
      </main>
      <footer>
        <A href={"/about"}>about</A>
      </footer>
    </div>
  );
};

export default App;
