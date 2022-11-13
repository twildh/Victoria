import { useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, Match, onMount, Switch } from "solid-js";
import sharedStyles from "../Shared.module.css";
import styles from "./Untouched.module.scss";
import { Banner, BannerType } from "../../components/Banner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { checkSecret, deleteSecret } from "../../network/calls";

import { checkIfValidUUID, SecretState } from "./utils";
import { AcceptButton, DenyButton } from "../../components/Buttons";

export const Untouched: Component = () => {
  const [secretState, setSecretState] = createSignal<SecretState>(
    SecretState.LOADING
  );
  const params = useParams();
  const navigate = useNavigate();

  const handleSecretDeletion = async () => {
    const deletion = await deleteSecret(params.secretId);
    if (!deletion.error) {
      navigate("/");
    }
  };

  onMount(async () => {
    if (!params.secretId || !checkIfValidUUID(params.secretId)) {
      setSecretState(SecretState.NOT_FOUND);
      return;
    }
    const secretExists = await checkSecret(params.secretId);
    if (secretExists) {
      setSecretState(SecretState.EXISTS);
      return;
    }
    setSecretState(SecretState.NOT_FOUND);
  });

  const secretLocation = `https://${window.location.host}/secrets/${params.secretId}`;
  return (
    <div class={sharedStyles.content}>
      <Switch>
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
        </Match>
        <Match when={secretState() === SecretState.EXISTS}>
          <Banner
            type={BannerType.INFO}
            text={
              "Secret still exists, this is a read-only view, copy the link to send the secret to someone"
            }
          />
          <div class={styles.linkWrapper}>
            <input readOnly value={secretLocation} />
            <AcceptButton
              text={"Copy link"}
              onClick={() => navigator.clipboard.writeText(secretLocation)}
            />
          </div>
          <DenyButton text={"Delete secret"} onClick={handleSecretDeletion} />
        </Match>
      </Switch>
    </div>
  );
};
