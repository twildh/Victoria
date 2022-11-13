import { A, useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, Match, Switch } from "solid-js";
import styles from "../Shared.module.css";
import { Banner, BannerType } from "../../components/Banner";
import { AcceptButton, DenyButton } from "../../components/Buttons";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { fetchSecret } from "../../network/calls";

import { checkIfValidUUID, SecretState } from "./utils";
import { TextArea } from "../../components/TextArea";

export const SecretDetails: Component = () => {
  const [secretState, setSecretState] = createSignal<SecretState>(
    SecretState.HIDDEN
  );
  const [secretMessage, setSecretMessage] = createSignal<string>();
  const params = useParams();
  const navigate = useNavigate();

  const handleRevealSecret = async () => {
    setSecretState(SecretState.LOADING);
    if (!params.secretId || !checkIfValidUUID(params.secretId)) {
      setSecretState(SecretState.NOT_FOUND);
      return;
    }
    const { message, error } = await fetchSecret(params.secretId);
    if (error) {
      setSecretState(SecretState.NOT_FOUND);
      return;
    }
    setSecretMessage(message);
    setSecretState(SecretState.EXISTS);
  };

  return (
    <div class={styles.content}>
      <Switch>
        <Match when={secretState() === SecretState.HIDDEN}>
          <Banner
            type={BannerType.INFO}
            text={
              "Reveal secret may only work once, Press 'Reveal secret' to show it if it still exists"
            }
          />
          <DenyButton onClick={handleRevealSecret} text={"Reveal secret"} />
        </Match>
        <Match when={secretState() === SecretState.LOADING}>
          <LoadingSpinner />
        </Match>
        <Match when={secretState() === SecretState.NOT_FOUND}>
          <Banner
            type={BannerType.ERROR}
            text={
              "Secret was not found, maybe it was already used or the id is wrong?"
            }
          />
          <AcceptButton text={"Return home"} onClick={() => navigate("/")} />
        </Match>
        <Match when={secretState() === SecretState.EXISTS}>
          <TextArea value={secretMessage()} readonly />
          <AcceptButton onClick={() => navigate("/")} text={"Create another"} />
        </Match>
      </Switch>
    </div>
  );
};
