import { useNavigate } from "@solidjs/router";
import CryptoJS from "crypto-js";
import { Component, createSignal } from "solid-js";
import { AcceptButton } from "../components/Buttons";
import { TextArea } from "../components/TextArea";
import { createSecret } from "../network/calls";

import sharedStyles from "./Shared.module.css";

import styles from "./Home.module.scss";
import { TextInput } from "../components/TextInput";

export const Home: Component = () => {
  const [secretInput, setSecretInput] = createSignal("");
  const [secretKey, setSecretKey] = createSignal("");
  const [secretTiming, setSecretTiming] = createSignal(`${60 * 24}`);

  const navigate = useNavigate();

  const handleSecretSubmit = async () => {
    const { message, error } = await createSecret(
      !secretKey().trim()
        ? secretInput()
        : CryptoJS.AES.encrypt(secretInput(), secretKey()).toString(),
      Number.parseInt(secretTiming()),
      Boolean(secretKey().trim())
    );
    if (error) {
      return;
    }
    navigate(`/untouched/${message}`);
  };

  return (
    <div class={sharedStyles.content}>
      <TextArea
        value={secretInput()}
        placeholder={"Enter your secret here."}
        onInput={(e) => setSecretInput(e.currentTarget.value)}
      />
      <TextInput
        value={secretKey()}
        placeholder={"Optional: set a password for your secret"}
        onInput={(e) => setSecretKey(e.currentTarget.value)}
      />
      <div class={styles.submitRow}>
        <select
          value={secretTiming()}
          onChange={(e) => setSecretTiming(e.currentTarget.value)}
        >
          <option textContent={"5 Minutes"} value={5} />
          <option textContent={"15 Minutes"} value={15} />
          <option textContent={"1 Hour"} value={60} />
          <option textContent={"3 Hours"} value={60 * 3} />
          <option textContent={"6 Hours"} value={60 * 6} />
          <option textContent={"12 Hours"} value={60 * 12} />
          <option textContent={"1 Day"} value={60 * 24} />
          <option textContent={"3 Days"} value={60 * 24 * 3} />
          <option textContent={"7 Days"} value={60 * 24 * 7} />
        </select>
        <AcceptButton
          onClick={handleSecretSubmit}
          disabled={secretInput().length < 1}
          text={"Create secret"}
        />
      </div>
    </div>
  );
};
