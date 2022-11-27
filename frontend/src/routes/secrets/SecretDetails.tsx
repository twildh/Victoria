import { A, useNavigate, useParams } from "@solidjs/router";
import CryptoJS from "crypto-js";
import {
  Component,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import sharedStyles from "../Shared.module.css";
import styles from "./SecretDetails.module.scss";

import { Banner, BannerType } from "../../components/Banner";
import { AcceptButton, DenyButton } from "../../components/Buttons";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { fetchSecret, getSecretInfos } from "../../network/calls";

import { checkIfValidUUID, SecretState } from "./utils";
import { TextArea } from "../../components/TextArea";
import { TextInput } from "../../components/TextInput";

export const SecretDetails: Component = () => {
  const [secretState, setSecretState] = createSignal<SecretState>(
    SecretState.LOADING
  );
  const [secretInfos, setSecretInfos] = createSignal<{
    isEncrypted: boolean;
    expirationDate: Date;
  }>();
  const [decryptionKey, setDecryptionKey] = createSignal<string>("");
  const [secretMessage, setSecretMessage] = createSignal<string>();

  const params = useParams();
  const navigate = useNavigate();

  onMount(async () => {
    if (!params.secretId || !checkIfValidUUID(params.secretId)) {
      setSecretState(SecretState.NOT_FOUND);
      return;
    }
    const secretInfos = await getSecretInfos(params.secretId);
    if (secretInfos) {
      setSecretInfos({
        isEncrypted: secretInfos.isEncrypted,
        expirationDate: new Date(
          new Date().getTime() + secretInfos.timeToExpiration / 1000000
        ),
      });
      setSecretState(SecretState.HIDDEN);
      return;
    }
    setSecretState(SecretState.NOT_FOUND);
  });

  const handleRevealSecret = async () => {
    setSecretState(SecretState.LOADING);

    const { message, error } = await fetchSecret(params.secretId);

    if (error) {
      setSecretState(SecretState.NOT_FOUND);
      return;
    }

    try {
      console.log(decryptionKey());
      const hiddenMessage = secretInfos()?.isEncrypted
        ? CryptoJS.AES.decrypt(message, decryptionKey()).toString(
            CryptoJS.enc.Utf8
          )
        : message;
      if (hiddenMessage === "") {
        setSecretState(SecretState.ENCRYPTION_ERROR);
        return;
      }
      setSecretMessage(hiddenMessage);
      setSecretState(SecretState.EXISTS);
    } catch {
      setSecretState(SecretState.ENCRYPTION_ERROR);
    }
  };

  return (
    <div class={`${sharedStyles.content} ${styles.details}`}>
      <Switch>
        <Match when={secretState() === SecretState.HIDDEN}>
          <Banner
            type={BannerType.INFO}
            text={`Reveal secret may only work once, Press 'Reveal secret' to show it if it still exists. Will expire at: ${
              secretInfos()
                ? new Intl.DateTimeFormat("de-CH", {
                    dateStyle: "full",
                    timeStyle: "long",
                  }).format(secretInfos()?.expirationDate)
                : "-"
            }`}
          />
          <Show when={secretInfos()?.isEncrypted}>
            <TextInput
              value={decryptionKey()}
              placeholder={
                "For this secret a password is required, Careful: you have only 1 try!"
              }
              onInput={(e) => setDecryptionKey(e.currentTarget.value)}
            />
          </Show>
          <DenyButton
            onClick={handleRevealSecret}
            text={"Reveal secret"}
            disabled={
              secretInfos()?.isEncrypted && decryptionKey().trim().length === 0
            }
          />
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
        <Match when={secretState() === SecretState.ENCRYPTION_ERROR}>
          <Banner
            type={BannerType.ERROR}
            text={
              "Something failed with your encrypted maybe the key was wrong? The secret was reset."
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
