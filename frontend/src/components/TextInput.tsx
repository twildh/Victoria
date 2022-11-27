import { JSX } from "solid-js";
import styles from "./TextInput.module.scss";

type TextAreaProps = {
  value: string;
  readonly?: boolean;
  onInput?: JSX.EventHandler<HTMLInputElement, Event>;
  placeholder?: string;
};

export const TextInput = (props: TextAreaProps) => {
  return <input class={styles.textinput} {...props} />;
};
